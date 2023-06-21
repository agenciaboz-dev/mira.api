import express, { Express, Request, Response } from "express"
import { PrismaClient, categories, products } from "@prisma/client"
import { sendRefresh } from "./websocket/socket"
import fileUpload from "express-fileupload"
const router = express.Router()
const prisma = new PrismaClient()

router.post("/reload_page", async (request: Request, response: Response) => {
    const data = request.body
    console.log(data)

    sendRefresh("app", data.time)
    response.json({ refresh: "app", time: data.time || 60 })
})

router.post("/import_products", async (request: Request, response: Response) => {
    const data = request.body
    interface product extends products {
        category: categories
    }

    const newProducts: product[] = data.newProducts
    const updateProducts: product[] = data.updateProducts

    console.log({ newProducts, updateProducts })

    const createdProducts = newProducts.map(
        async (product) =>
            await prisma.products.create({
                data: {
                    name: product.name,
                    description: product.description,
                    brand: product.brand,
                    supplier_id: product.supplier_id,
                    price: product.cost * (product.profit / 100 + 1),
                    profit: product.profit,
                    stock_warehouse: product.stock_warehouse,
                    cost: product.cost,
                    stock: product.stock,
                    image: "",
                    video: "",
                    story: product.story,
                    usage: product.usage,
                    weight: product.weight,
                    width: product.width,
                    height: product.height,
                    length: product.length,
                    preparation: product.preparation,
                    prep_unit: product.prep_unit,
                    specifications: JSON.stringify([{ name: "teste", value: "5kg" }]),
                    categories: { connect: [{ id: product.category.id }] },
                },
            })
    )

    const updatedProducts = updateProducts.map(async (product) => {
        const oldProduct = await prisma.products.findUnique({ where: { id: product.id } })
        return await prisma.products.update({
            where: { id: product.id },
            data: {
                name: product.name,
                description: product.description,
                brand: product.brand,
                supplier_id: product.supplier_id,
                price: product.cost * (product.profit / 100 + 1) || product.cost * (oldProduct!.profit / 100 + 1),
                profit: product.profit,
                stock_warehouse: (product.stock_warehouse || 0) + (oldProduct!.stock_warehouse || 0),
                cost: product.cost,
                stock: (product.stock || 0) + (oldProduct!.stock || 0),
                story: product.story,
                usage: product.usage,
                weight: product.weight,
                width: product.width,
                height: product.height,
                length: product.length,
                preparation: product.preparation,
                prep_unit: product.prep_unit,
            },
        })
    })

    response.json({ createdProducts, updatedProducts })
})

export default router
