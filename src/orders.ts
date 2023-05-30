import express, { Express, Request, Response } from "express"
import { PrismaClient, products } from "@prisma/client"
import { clients } from "./websocket/socket"
import { frete, mira } from "./frete"
import { AxiosResponse } from "axios"

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

    const client = clients.filter((client) => client.user.id == data.user.id)[0]
    const products: products[] = data.products

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

    response.json(order)

    //
    // API DE ENTREGA AQUI
    if (data.address.delivery) {
        // frete.list()
        // frete.list()
        frete.quotation({
            from: "80230040",
            to: "80060020",
            invoice_amount: 15.5,
            volumes: [{ height: 1, length: 40, quantity: 1, weight: 1, width: 20 }],
        })
    }
    //

    client.connection.send(JSON.stringify({ paid: true, order }))
})

export default router
