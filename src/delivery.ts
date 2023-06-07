import express, { Express, Request, Response } from "express"
import { PrismaClient, products } from "@prisma/client"
import { frete } from "./frete"
import { mira } from "./frete"
import { Volume } from "./definitions/frete"
import { AxiosResponse } from "axios"

const router = express.Router()
const prisma = new PrismaClient()

router.post("/", async (request: Request, response: Response) => {
    const data = request.body

    interface product extends products {
        quantity: number
    }

    const products: product[] = data.products

    try {
        frete.quotation(
            {
                from: mira.cep,
                invoice_amount: data.total,
                to: data.cep,
                volumes: products.map((product) => ({
                    quantity: product.quantity,
                    height: product.height,
                    length: product.length,
                    weight: product.weight,
                    width: product.width,
                })),
            },
            (delivery_response: AxiosResponse) => {
                // console.log(delivery_response.data)
                response.json(delivery_response.data)
            }
        )
    } catch (e) {
        console.log(e)
    }

})

export default router
