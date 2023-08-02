import express, { Express, Request, Response } from "express"
import { PrismaClient, addresses, orders, products, users } from "@prisma/client"
import { clients, sendRefresh } from "./websocket/socket"
import { frete, mira } from "./frete"
import axios, { AxiosResponse } from "axios"
import { pagseguro } from "./pagseguro"
import { writeFileSync } from "fs"
import { nfe } from "./nfe"

const router = express.Router()
const prisma = new PrismaClient()

router.get("/", async (request: Request, response: Response) => {
    try {
        const orders = await prisma.orders.findMany({
            include: { address: true, products: { include: { product: true } }, user: true },
            orderBy: { id: "desc" },
        })

        response.json(orders)
    } catch {
        const orders = await prisma.orders.findMany({
            include: { address: true, user: true },
            orderBy: { id: "desc" },
        })

        response.json(orders)
    }
})

router.post("/", async (request: Request, response: Response) => {
    const data = request.body

    const order = await prisma.orders.findUnique({
        where: { id: Number(data.id) },
        include: { address: true, products: { include: { product: true } }, user: true },
    })

    response.json(order)
})

router.post("/quotation", async (request: Request, response: Response) => {
    const data = request.body

    frete.quotation(
        {
            from: mira.cep,
            to: data.cep,
            invoice_amount: Number(data.total),
            volumes: [{ height: 1, length: 40, quantity: 1, weight: 1, width: 20 }],
        },
        (response: AxiosResponse) => {
            console.log(response.data)
        }
    )
})

router.post("/reviews/cancel", async (request: Request, response: Response) => {
    const data = request.body

    const order = await prisma.orders.update({
        where: { id: Number(data.id) },
        data: {
            review: true,
        },
    })

    response.json(order)
})

router.post("/reviews/send", async (request: Request, response: Response) => {
    const data = request.body

    interface ratingProduct extends products {
        new_rating: number
    }

    const products: ratingProduct[] = data.products
    const newProducts: products[] = []

    products.map(async (product) => {
        const ratings = product.ratings + 1
        const rating = (product.rating * product.ratings + product.new_rating) / ratings

        const newProduct = await prisma.products.update({
            where: { id: Number(product.id) },
            data: {
                rating: rating,
                ratings: ratings,
            },
        })

        newProducts.push(newProduct)
    })

    const order = await prisma.orders.update({
        where: { id: Number(data.id) },
        data: {
            review: true,
        },
    })

    response.json(newProducts)
})

router.post("/new", async (request: Request, response: Response) => {
    const data = request.body
    // console.log(JSON.stringify(data))
    // console.log(data)

    interface product extends products {
        quantity: number
    }

    const user: users = data.user
    const sentAddress: addresses = data.address
    const products: product[] = data.products
    const total: number = data.total
    const quotation: Quotation = data.quotation

    const address = sentAddress?.id
        ? sentAddress
        : sentAddress?.address
        ? (await axios.post("https://app.agenciaboz.com.br:4102/api/user/address", { new_address: true, ...sentAddress })).data
        : undefined

    const _order = await prisma.orders.create({
        data: {
            user_id: data.user.id,
            method: data.method,
            status: 0,
            frete: quotation?.id.toString(),
            address_id: address?.id || 0,
            name: data.name,
            cpf: data.cpf,
            value: total,
            delivery: !!address?.id,
        },
        include: { address: !!address?.id },
    })

    const orderProducts = await prisma.orderProduct.createMany({
        data: products.map((product) => ({
            orderId: _order.id,
            productId: product.id,
            quantity: product.quantity, // assuming you have quantity in the products array
        })),
    })

    const order = await prisma.orders.findUnique({
        where: { id: _order.id },
        include: { address: !!address?.id, products: { include: { product: true } }, user: true },
    })

    const pag_order = {
        reference_id: order!.id.toString(),
        customer: {
            name: order!.name,
            tax_id: order!.cpf.replace(/\D/g, ""),
            email: user?.email || "fernando@agenciazop.com.br",
        },
        items: products.map((product) => ({
            name: product.name,
            quantity: product.quantity,
            unit_amount: product.price * 100,
        })),
        notification_urls: ["https://app.agenciaboz.com.br:4102/api/orders/webhook"],
    }

    // PIX
    if (data.method == "pix") {
        pagseguro.order(
            {
                ...pag_order,
                qr_codes: [{ amount: { value: total * 100 } }],
            },

            (pag_response: AxiosResponse) => {
                const data = pag_response.data
                response.json({ pagseguro: data, order })
                sendRefresh("orders")
            }
        )
    } else if (data.method == "card") {
        pagseguro.order(
            {
                ...pag_order,
                charges: [
                    {
                        reference_id: order!.id.toString(),
                        amount: { currency: "BRL", value: total * 100 },
                        payment_method: {
                            capture: true,
                            card: {
                                encrypted: data.card.encrypted,
                                holder: {
                                    name: data.card.holder,
                                },
                                security_code: data.card.cvv,
                                store: false,
                            },
                            installments: 1,
                            type: "CREDIT_CARD",
                        },
                    },
                ],
            },

            (pag_response: AxiosResponse) => {
                const data = pag_response.data
                response.json({ pagseguro: data, order })
                sendRefresh("orders")
            }
        )
    }
})

// webhook for pagseguro
router.post("/webhook", async (request, response, next) => {
    const data = request.body

    console.log("WEBHOOK CALL")
    // console.log(data)
    if (data.charges?.length > 0) {
        const client = clients.filter((client) => client.order.id == data.reference_id)[0]
        const charge = data.charges[0]
        client?.connection.send(JSON.stringify(charge))

        console.log(charge)

        writeFileSync("logs/webhook.txt", JSON.stringify(data, null, 4))

        if (charge.status == "PAID") {
            const order = await prisma.orders.update({
                data: { status: 2 },
                where: { id: Number(data.reference_id) },
                include: { address: true, products: { include: { product: true } }, user: true },
            })
            nfe.create(order!)
            sendRefresh("orders")
        } else if (charge.status == "DECLINED") {
            await prisma.orders.update({ data: { status: 1 }, where: { id: Number(data.reference_id) } })
            // sendRefresh("orders")
        } else if (charge.status == "CANCELED") {
            await prisma.orders.update({ data: { status: 6 }, where: { id: Number(data.reference_id) } })
            // sendRefresh("orders")
        }
        // console.log(client)
    }

    response.json({ message: "teste" })
})

router.post("/close", async (request: Request, response: Response) => {
    const data = request.body

    const order = await prisma.orders.update({
        where: { id: data.id },
        data: { status: 4 },
        include: { address: true, products: { include: { product: true } }, user: true },
    })
    response.json(order)
})

router.get("/send_refresh", async (request: Request, response: Response) => {
    sendRefresh("orders")
    response.json({ refresh: "orders" })
})

router.post("/simulate_pay", async (request: Request, response: Response) => {
    const data = request.body
})

export default router
