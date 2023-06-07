import express, { Express, Request, Response } from 'express'
import viacep from "./src/viacep"
import login from "./src/login"
import signup from "./src/signup"
import products from "./src/products"
import user from "./src/user"
import pagseguro from "./src/pagseguro_setup"
import orders from "./src/orders"
import categories from "./src/categories"
import delivery from "./src/delivery"

export const router = express.Router()

router.get("/", async (request: Request, response: Response) => {
    response.json({ success: true })
})

router.post("/cep", (request, response, next) => {
    const data = request.body

    viacep.search(data.cep.replace(/\D/g, ""), (address: any) => {
        response.json(address)
    })
})

router.use("/login", login)
router.use("/signup", signup)
router.use("/products", products)
router.use("/user", user)
router.use("/pagseguro", pagseguro)
router.use("/orders", orders)
router.use("/categories", categories)
router.use("/delivery", delivery)