import express, { Express, Request, Response } from "express"
import { PrismaClient, categories } from "@prisma/client"
import fileUpload from "express-fileupload"
import { existsSync, mkdirSync } from "fs"
import { join } from "path"
const router = express.Router()
const prisma = new PrismaClient()

router.get("/", async (request: Request, response: Response) => {
    const products = await prisma.products.findMany({
        include: { categories: true, supplier: true },
        orderBy: { id: "asc" },
    })
    response.json(products)
})

router.post("/", async (request: Request, response: Response) => {
    const data = request.body

    const product = await prisma.products.findUnique({
        where: { id: Number(data.id) },
        include: { categories: true, supplier: true },
    })
    response.json(product)
})

router.post("/name", async (request: Request, response: Response) => {
    const data = request.body

    const product = await prisma.products.findMany({
        where: { name: { contains: data.name } },
        include: { categories: true, supplier: true },
    })
    response.json(product)
})

router.post("/add", async (request: Request, response: Response) => {
    const data = JSON.parse(request.body.data)
    const imageFile = request.files?.file! as fileUpload.UploadedFile

    data.stock = Number(data.stock.toString().replace(/\D/g, ""))
    data.stock_warehouse = Number(data.stock_warehouse.toString().replace(/\D/g, ""))
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
    data.profit = Number(
        data.profit
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
            supplier_id: data.supplier_id,
            price: data.price,
            profit: data.profit,
            stock_warehouse: data.stock_warehouse,
            shelf: data.shelf,
            cost: data.cost,
            stock: data.stock,
            image: data.image,
            video: data.video,
            story: data.story,
            usage: data.usage,
            weight: data.weight,
            width: data.width,
            height: data.height,
            length: data.length,
            preparation: data.preparation,
            prep_unit: data.prep_unit,
            stock_type: Number(data.stock_type),
            specifications: JSON.stringify([{ name: "teste", value: "5kg" }]),
            categories: { connect: categories.map((category) => ({ id: category.id })) },
        },
    })

    const uploadDir = `images/products/${product.id}`
    if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true })
    }
    const filepath = join(uploadDir, imageFile.name)

    imageFile.mv(filepath)

    const updatedProduct = await prisma.products.update({
        data: { image: `https://app.agenciaboz.com.br:4102/${filepath}` },
        where: { id: product.id },
        include: { categories: true, supplier: true },
    })

    response.json(updatedProduct)
})

router.post("/update", async (request: Request, response: Response) => {
    const data = JSON.parse(request.body.data)
    const imageFile = request.files?.file! as fileUpload.UploadedFile

    if (imageFile) {
        const uploadDir = `images/products/${data.id}`
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true })
        }

        const filepath = join(uploadDir, imageFile.name)

        imageFile.mv(filepath, (err) => {
            console.log(err)
        })

        const imageProduct = await prisma.products.update({
            data: {
                image: `https://app.agenciaboz.com.br:4102/${filepath}`,
            },
            where: { id: data.id },
            include: { categories: true, supplier: true },
        })
    }

    data.stock = Number(data.stock.toString().replace(/\D/g, ""))
    data.stock_warehouse = Number(data.stock_warehouse.toString().replace(/\D/g, ""))
    data.price = Number(
        data.price
            .toString()
            .replace(/[^,\d]/g, "")
            .replace(",", ".")
    )
    data.profit = Number(
        data.profit
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
            supplier_id: data.supplier_id,
            price: data.price,
            profit: data.profit,
            cost: data.cost,
            stock: data.stock,
            stock_warehouse: data.stock_warehouse,
            shelf: data.shelf,
            video: data.video,
            usage: data.usage,
            story: data.story,
            weight: data.weight,
            width: data.width,
            height: data.height,
            length: data.length,
            preparation: data.preparation,
            prep_unit: data.prep_unit,
            stock_type: Number(data.stock_type),
            specifications: JSON.stringify([{ name: "teste", value: "5kg" }]),
            categories: { set: [], connect: categories.map((category) => ({ id: category.id })) },
        },
        where: { id: data.id },
        include: { categories: true, supplier: true },
    })

    response.json(product)
})

router.post("/delete", async (request: Request, response: Response) => {
    const data = request.body

    const product = await prisma.products.delete({ where: { id: data.id }, include: { categories: true, supplier: true } })
    response.json(product)
})

router.post("/apply_profit_margin", async (request: Request, response: Response) => {
    const data = request.body

    const product = await prisma.products.update({
        where: { id: data.product.id },
        data: { price: data.price },
    })

    response.json(product)
})


export default router
