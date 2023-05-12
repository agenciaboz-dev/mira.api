import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
const router = express.Router()
const prisma = new PrismaClient()

router.post("/", async (request: Request, response: Response) => {
    const data = request.body
    console.log({ change_password: data.change_password })

    if (data.change_password) {
        const user = await prisma.users.update({
            where: { id: data.id },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.new_password,
            },
        })
        response.json(user)
    } else {
        const user = await prisma.users.update({
            where: { id: data.id },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
            },
        })
        response.json(user)
    }
})

export default router
