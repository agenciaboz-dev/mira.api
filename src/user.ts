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

router.post("/address", async (request: Request, response: Response) => {
    const data = request.body
    console.log(data)

    if (data.new_address) {
        const address = await prisma.addresses.create({
            data: {
                receiver: data.receiver,
                phone: data.phone,
                cep: data.cep,
                address: data.address,
                number: Number(data.number.toString().replace(/D/, "")),
                complement: data.complement,
                district: data.district,
                city: data.city,
                uf: data.uf,
                user: data.user_id,
            },
        })

        response.json(address)
    } else {
        const address = await prisma.addresses.update({
            data: {
                receiver: data.receiver,
                phone: data.phone,
                cep: data.cep,
                address: data.address,
                number: Number(data.number.toString().replace(/D/, "")),
                complement: data.complement,
                district: data.district,
                city: data.city,
                uf: data.uf,
            },

            where: { id: data.id },
        })

        response.json(address)
    }
})

export default router
