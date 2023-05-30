import express, { Express, Request, Response } from "express"
import { PrismaClient, products } from "@prisma/client"
import { clients } from "./websocket/socket"
const router = express.Router()
const prisma = new PrismaClient()

router.post("/", async (request: Request, response: Response) => {
    const data = request.body
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
    client.connection.send(JSON.stringify({ paid: true, order }))
})

export default router
