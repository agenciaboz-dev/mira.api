import express, { Express, Request, Response } from 'express'
import login from './src/login'
import signup from "./src/signup"
import products from "./src/products"
import user from "./src/user"

export const router = express.Router()

router.get("/", async (request: Request, response: Response) => {
    response.json(router)
})

router.use("/login", login)
router.use("/signup", signup)
router.use("/products", products)
router.use("/user", user)