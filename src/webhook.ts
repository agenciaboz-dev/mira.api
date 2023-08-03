import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { sendRefresh } from "./websocket/socket"
import axios from "axios"
import { sendMail } from "./scripts/mail"
import { mailTemplate } from "./templates/mail/nfe"
const router = express.Router()
const prisma = new PrismaClient()

router.post("/nfe", async (request: Request, response: Response) => {
    const data = request.body
    console.log(data)

    if (data.status == "autorizado") {
        const order = await prisma.orders.update({
            where: { id: Number(data.ref) },
            data: { nfe: `https://api.focusnfe.com.br${data.caminho_danfe}` },
            include: { user: true },
        })

        const pdfResponse = await axios({
            method: "get",
            url: `https://api.focusnfe.com.br${data.caminho_danfe}`,
            responseType: "arraybuffer",
        })
        const pdfData = pdfResponse.data
        sendMail(order.user.email, "Nota fiscal", "", mailTemplate(order), [{ filename: `Nfe_${order.id}.pdf`, content: pdfData }])
    } else {
        await prisma.orders.update({
            where: { id: Number(data.ref) },
            data: { nfe: data.status },
        })
    }

    sendRefresh("orders")
    response.json({ success: true })
})

export default router
