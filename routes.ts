import express, { Express, Request, Response } from 'express'
import { sendRefresh } from "./src/websocket/socket"
import viacep from "./src/viacep"
import login from "./src/login"
import signup from "./src/signup"
import products from "./src/products"
import user from "./src/user"
import pagseguro from "./src/pagseguro_setup"
import orders from "./src/orders"
import categories from "./src/categories"
import delivery from "./src/delivery"
import suppliers from "./src/suppliers"
import tools from "./src/tools"
import webhook from "./src/webhook"

export const router = express.Router()

router.get("/", async (request: Request, response: Response) => {
    response.json({ success: true })
})

router.get("/refresh_adm", async (request: Request, response: Response) => {
    sendRefresh("app")
    response.json({ refresh: "app" })
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
router.use("/suppliers", suppliers)
router.use("/tools", tools)
router.use("/webhook", webhook)