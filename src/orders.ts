import express, { Express, Request, Response } from "express"
import { PrismaClient, addresses, products, users } from "@prisma/client"
import { clients } from "./websocket/socket"
import { frete, mira } from "./frete"
import { AxiosResponse } from "axios"
import { pagseguro } from "./pagseguro"
import { writeFileSync } from "fs"

const router = express.Router()
const prisma = new PrismaClient()

router.get("/", async (request: Request, response: Response) => {
    const orders = await prisma.orders.findMany({
        include: { address: true, products: true, user: true },
        orderBy: { id: "desc" },
    })

    response.json(orders)
})

router.post("/", async (request: Request, response: Response) => {
    const data = request.body

    const order = await prisma.orders.findUnique({
        where: { id: Number(data.id) },
        include: { address: true, products: true, user: true },
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

router.post("/new", async (request: Request, response: Response) => {
    const data = request.body
    // console.log(data)

    interface product extends products {
        quantity: number
    }

    const user: users = data.user
    const address: addresses = data.address
    const products: product[] = data.products
    const total: number = data.total

    const order = await prisma.orders.create({
        data: {
            user_id: data.user.id,
            method: data.method,
            status: 0,
            products: { connect: products.map((product) => ({ id: product.id })) },
            address_id: data.address?.id || 0,
            name: data.name,
            cpf: data.cpf,
            value: total,
        },
        include: { address: !!address?.id },
    })

    const pag_order = {
        reference_id: order.id.toString(),
        customer: {
            name: order.name,
            tax_id: order.cpf.replace(/\D/g, ""),
            email: user?.email || "fernando@agenciazop.com.br",
        },
        items: products.map((product) => ({
            name: product.name,
            quantity: product.quantity,
            unit_amount: Number((product.price / 100).toString().replace(/\D/g, "")),
        })),
        notification_urls: ["https://app.agenciaboz.com.br:4102/api/orders/webhook"],
    }

    // PIX
    if (data.method == "pix") {
        pagseguro.order(
            {
                ...pag_order,
                qr_codes: [{ amount: { value: Number((total / 100).toString().replace(/\D/g, "")) } }],
            },

            (pag_response: AxiosResponse) => {
                const data = pag_response.data
                response.json({ pagseguro: data, order })
            }
        )
    } else if (data.method == "card") {
        pagseguro.order(
            {
                ...pag_order,
                charges: [
                    {
                        reference_id: order.id.toString(),
                        amount: { currency: "BRL", value: Number((total / 100).toString().replace(/\D/g, "")) },
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
            }
        )
    }
})

router.post("/webhook", async (request, response, next) => {
    const data = request.body

    console.log("WEBHOOK CALL")
    // console.log(data)
    if (data.charges?.length > 0) {
        const client = clients.filter((client) => client.order.id == data.reference_id)[0]
        const charge = data.charges[0]
        client?.connection.send(JSON.stringify(charge))

        if (charge.status == "PAID") {
            await prisma.orders.update({ data: { status: 2 }, where: { id: Number(data.reference_id) } })
        }
        // console.log(client)
    }

    response.json({ message: "teste" })
})

router.post("/simulate_pay", async (request: Request, response: Response) => {
    const data = request.body
})

export default router
