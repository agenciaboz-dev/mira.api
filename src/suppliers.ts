import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
const router = express.Router()
const prisma = new PrismaClient()

router.get("/", async (request: Request, response: Response) => {
    const suppliers = await prisma.suppliers.findMany({ include: { products: true } })
    response.json(suppliers)
})

router.post("/add", async (request: Request, response: Response) => {
    const data = request.body

    const supplier = await prisma.suppliers.create({
        data: { name: data.name, contact: data.contact, document: data.document },
        include: { products: true },
    })
    response.json(supplier)
})

router.post("/update", async (request: Request, response: Response) => {
    const data = request.body

    const supplier = await prisma.suppliers.update({
        where: { id: data.id },
        data: { name: data.name, contact: data.contact, document: data.document },
        include: { products: true },
    })

    response.json(supplier)
})

router.post("/delete", async (request: Request, response: Response) => {
    const data = request.body

    const supplier = await prisma.suppliers.delete({ where: { id: data.id }, include: { products: true } })
    response.json(supplier)
})

export default router
