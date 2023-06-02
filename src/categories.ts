import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
const router = express.Router()
const prisma = new PrismaClient()

router.get("/", async (request: Request, response: Response) => {
    const categories = await prisma.categories.findMany({ include: { products: true } })
    response.json(categories)
})

router.post("/add", async (request: Request, response: Response) => {
    const data = request.body

    const category = await prisma.categories.create({ data: { name: data.name }, include: { products: true } })
    response.json(category)
})

router.post("/update", async (request: Request, response: Response) => {
    const data = request.body

    const category = await prisma.categories.update({
        where: { id: data.id },
        data: { name: data.name },
        include: { products: true },
    })

    response.json(category)
})

router.post("/delete", async (request: Request, response: Response) => {
    const data = request.body

    const category = await prisma.categories.delete({ where: { id: data.id }, include: { products: true } })
    response.json(category)
})

export default router
