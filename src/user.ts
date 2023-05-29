import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { clients } from "./websocket/clients"
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

router.post("/card", async (request: Request, response: Response) => {
    const data = request.body
    console.log(data)

    if (data.new_card) {
        const card = await prisma.cards.create({
            data: {
                name: data.name,
                number: data.number,
                cvv: data.cvv,
                expiration_month: data.expiration_month,
                expiration_year: data.expiration_year,
                type: data.type,
                user: data.user_id,
            },
        })

        response.json(card)
    } else {
        const card = await prisma.cards.update({
            data: {
                name: data.name,
                number: data.number,
                cvv: data.cvv,
                expiration_month: data.expiration_month,
                expiration_year: data.expiration_year,
                type: data.type,
                user: data.id,
            },

            where: { id: data.id },
        })

        response.json(card)
    }
})

router.get("/ws", async (request: Request, response: Response) => {
    response.json(clients)
})

export default router
