import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { sendRefresh } from "./websocket/socket"
const router = express.Router()
const prisma = new PrismaClient()

router.post("/nfe", async (request: Request, response: Response) => {
    const data = request.body
    console.log(data)

    if (data.status == "autorizado") {
        await prisma.orders.update({
            where: { id: Number(data.ref) },
            data: { nfe: `https://api.focusnfe.com.br${data.caminho_danfe}` },
        })
    } else {
        await prisma.orders.update({
            where: { id: Number(data.ref) },
            data: { nfe: data.status },
        })
    }

    sendRefresh("orders")
})

export default router
