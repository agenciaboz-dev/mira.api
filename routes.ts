import express, { Express, Request, Response } from 'express'
import login from './src/login'
import signup from "./src/signup"
import products from "./src/products"
import user from "./src/user"
import pagseguro from "./src/pagseguro"
import checkout from "./src/checkout"
import orders from "./src/orders"

export const router = express.Router()

router.get("/", async (request: Request, response: Response) => {
    response.json({ success: true })
})

router.use("/login", login)
router.use("/signup", signup)
router.use("/products", products)
router.use("/user", user)
router.use("/pagseguro", pagseguro)
router.use("/checkout", checkout)
router.use("/orders", orders)