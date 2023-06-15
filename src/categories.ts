import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import fileUpload from "express-fileupload"
import { existsSync, mkdirSync } from "fs"
import { join } from "path"
const router = express.Router()
const prisma = new PrismaClient()

router.get("/", async (request: Request, response: Response) => {
    const categories = await prisma.categories.findMany({ include: { products: true } })
    response.json(categories)
})

router.post("/add", async (request: Request, response: Response) => {
    const data = JSON.parse(request.body.data)
    const imageFile = request.files?.file! as fileUpload.UploadedFile

    const category = await prisma.categories.create({
        data: { name: data.name, image: data.image },
        include: { products: true },
    })

    const uploadDir = `images/categories/${category.id}`
    if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true })
    }
    const filepath = join(uploadDir, imageFile.name)

    imageFile.mv(filepath)

    const updatedCategory = await prisma.categories.update({
        data: { image: `https://app.agenciaboz.com.br:4102/${filepath}` },
        where: { id: category.id },
        include: { products: true },
    })

    response.json(updatedCategory)
})

router.post("/update", async (request: Request, response: Response) => {
    const data = JSON.parse(request.body.data)
    const imageFile = request.files?.file! as fileUpload.UploadedFile

    if (imageFile) {
        const uploadDir = `images/categories/${data.id}`
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true })
        }

        const filepath = join(uploadDir, imageFile.name)

        imageFile.mv(filepath, (err) => {
            console.log(err)
        })

        const imageCategory = await prisma.categories.update({
            data: {
                image: `https://app.agenciaboz.com.br:4102/${filepath}`,
            },
            where: { id: data.id },
            include: { products: true },
        })
    }

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
