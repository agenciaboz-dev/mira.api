import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
const router = express.Router()
const prisma = new PrismaClient()

router.post("/", async (request: Request, response: Response) => {
    const data = request.body
    data.username = data.email.split("@")[0]
    console.log(data)

    try {
        const user = await prisma.users.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password,
                username: data.username,
                phone: data.phone,
            },
        })
        console.log(user)
        response.json(user)
    } catch (error) {
        console.log(error)
        response.json(null)
    }
})

export default router
