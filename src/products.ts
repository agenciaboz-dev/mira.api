import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
const router = express.Router()
const prisma = new PrismaClient()

router.get("/", async (request: Request, response: Response) => {
    const products = await prisma.products.findMany()
    response.json(products)
})

router.post("/add", async (request: Request, response: Response) => {
    const data = request.body

    data.stock = Number(data.stock.toString().replace(/\D/g, ""))
    data.price = Number(
        data.price
            .toString()
            .replace(/[^,.\d]/g, "")
            .replace(",", ".")
    )

    console.log(data)

    const product = await prisma.products.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            image: data.image,
            video: data.video,
            story: data.story,
            specifications: JSON.stringify([{ name: "teste", value: "5kg" }]),
        },
    })
    response.json(product)
})

router.post("/update", async (request: Request, response: Response) => {
    const data = request.body
    console.log(data)

    data.stock = Number(data.stock.toString().replace(/\D/g, ""))
    data.price = Number(
        data.price
            .toString()
            .replace(/[^,.\d]/g, "")
            .replace(",", ".")
    )

    const product = await prisma.products.update({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            image: data.image,
            video: data.video,
            story: data.story,
            specifications: JSON.stringify([{ name: "teste", value: "5kg" }]),
        },
        where: { id: data.id },
    })
    response.json(product)
})

export default router
