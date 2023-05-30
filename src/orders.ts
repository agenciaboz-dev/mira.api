import express, { Express, Request, Response } from "express"
import { PrismaClient, addresses, products, users } from "@prisma/client"
import { clients } from "./websocket/socket"
import { frete, mira } from "./frete"
import { AxiosResponse } from "axios"
import { pagseguro } from "./pagseguro"

const router = express.Router()
const prisma = new PrismaClient()

router.post("/", async (request: Request, response: Response) => {
    const data = request.body
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
    const delivery: boolean = data.address.delivery
    const address: addresses = data.address
    const products: product[] = data.products
    const total: number = data.total

    const order = await prisma.orders.create({
        data: {
            user_id: data.user.id,
            method: data.method,
            status: 1,
            products: { connect: products.map((product) => ({ id: product.id })) },
            address_id: data.address.id,
        },
        include: { address: true },
    })

    pagseguro.order(
        {
            reference_id: order.id.toString(),
            customer: {
                name: user.name,
                tax_id: user.cpf,
                email: user.email,
            },
            items: products.map((product) => ({
                name: product.name,
                quantity: product.quantity,
                unit_amount: product.price * 100,
            })),
            notification_urls: ["https://agenciaboz.com.br/api"],
            qr_codes: [{ amount: { value: total * 100 } }],
        },
        (response: AxiosResponse) => console.log(response.data)
    )

    // const client = clients.filter((client) => client.user.id == data.user.id)[0]

    // response.json(order)

    //
    // API DE ENTREGA AQUI
    if (data.address.delivery) {
        // frete.list()
        // frete.list()
    }
    //

    // client.connection.send(JSON.stringify({ paid: true, order }))
})

router.post("/webhook", (request, response, next) => {
    const data = request.body

    if (data?.charges[0]?.status == "PAID") {
        const id = data.charges[0].reference_id
        let assinatura = data.items[0].name
        assinatura = assinatura.charAt(0).toUpperCase() + assinatura.slice(1)
        console.log({ datetime: new Date(), webhook: data })

        console.log(`pago membro ${id}`)

        // const mysql = newMysql(config.sbop.database)
        // mysql.connect()

        // mysql.query({
        //     sql: "UPDATE Membros SET pago=true, assinatura = ?, temporario = 'false' WHERE id = ?",
        //     values: [ assinatura, id ]
        // }, (error, results) => {
        //     if (error) console.log(error)
        // })

        // clients[id].send('PAID')
    }

    response.json({ message: "teste" })
})

export default router
