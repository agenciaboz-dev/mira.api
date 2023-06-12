import express, { Express, Request, Response } from "express"
import { PrismaClient, categories } from "@prisma/client"
const router = express.Router()
const prisma = new PrismaClient()

router.get("/", async (request: Request, response: Response) => {
    const products = await prisma.products.findMany({ include: { categories: true } })
    response.json(products)
})

router.post("/", async (request: Request, response: Response) => {
    const data = request.body

    const product = await prisma.products.findUnique({ where: { id: Number(data.id) }, include: { categories: true } })
    response.json(product)
})

router.post("/add", async (request: Request, response: Response) => {
    const data = request.body

    data.stock = Number(data.stock.toString().replace(/\D/g, ""))
    data.price = Number(
        data.price
            .toString()
            .replace(/[^,\d]/g, "")
            .replace(",", ".")
    )
    data.cost = Number(
        data.cost
            .toString()
            .replace(/[^,\d]/g, "")
            .replace(",", ".")
    )
    data.weight = Number(
        data.weight
            .toString()
            .replace(/[^,\d]/g, "")
            .replace(",", ".")
    )
    data.width = Number(
        data.width
            .toString()
            .replace(/[^,\d]/g, "")
            .replace(",", ".")
    )
    data.height = Number(
        data.height
            .toString()
            .replace(/[^,\d]/g, "")
            .replace(",", ".")
    )
    data.length = Number(
        data.length
            .toString()
            .replace(/[^,\d]/g, "")
            .replace(",", ".")
    )
    data.preparation = Number(data.preparation.toString().replace(/\D/g, "").replace(",", "."))

    const categories: categories[] = data.categories

    const product = await prisma.products.create({
        data: {
            name: data.name,
            description: data.description,
            brand: data.brand,
            price: data.price,
            cost: data.cost,
            stock: data.stock,
            image: data.image,
            video: data.video,
            story: data.story,
            usage: data.usage,
            weight: data.weight,
            width: data.width,
            height: data.height,
            preparation: data.preparation,
            prep_unit: data.prep_unit,
            stock_type: data.stock_type,
            specifications: JSON.stringify([{ name: "teste", value: "5kg" }]),
            categories: { connect: categories.map((category) => ({ id: category.id })) },
        },
        include: { categories: true },
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
            .replace(/[^,\d]/g, "")
            .replace(",", ".")
    )
    data.cost = Number(
        data.cost
            .toString()
            .replace(/[^,\d]/g, "")
            .replace(",", ".")
    )
    data.weight = Number(
        data.weight
            .toString()
            .replace(/[^,\d]/g, "")
            .replace(",", ".")
    )
    data.width = Number(
        data.width
            .toString()
            .replace(/[^,\d]/g, "")
            .replace(",", ".")
    )
    data.height = Number(
        data.height
            .toString()
            .replace(/[^,\d]/g, "")
            .replace(",", ".")
    )
    data.length = Number(
        data.length
            .toString()
            .replace(/[^,\d]/g, "")
            .replace(",", ".")
    )
    data.preparation = Number(data.preparation.toString().replace(/\D/g, "").replace(",", "."))

    const categories: categories[] = data.categories

    const product = await prisma.products.update({
        data: {
            name: data.name,
            description: data.description,
            brand: data.brand,
            price: data.price,
            cost: data.cost,
            stock: data.stock,
            image: data.image,
            video: data.video,
            usage: data.usage,
            story: data.story,
            weight: data.weight,
            width: data.width,
            height: data.height,
            preparation: data.preparation,
            prep_unit: data.prep_unit,
            stock_type: data.stock_type,
            specifications: JSON.stringify([{ name: "teste", value: "5kg" }]),
            categories: { set: [], connect: categories.map((category) => ({ id: category.id })) },
        },
        where: { id: data.id },
        include: { categories: true },
    })
    response.json(product)
})

router.post("/delete", async (request: Request, response: Response) => {
    const data = request.body

    const product = await prisma.products.delete({ where: { id: data.id }, include: { categories: true } })
    response.json(product)
})

export default router
