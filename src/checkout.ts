import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { clients, wsServer } from "./websocket/socket"

const router = express.Router()
const prisma = new PrismaClient()
const ws = wsServer

router.post("/", async (request: Request, response: Response) => {
    const data = request.body
    const client = clients.filter((client) => client.user.id == data.user.id)[0]
    response.json(client)

    client.connection.send(JSON.stringify({ paid: true }))
})

export default router
