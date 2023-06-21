import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { sendRefresh } from "./websocket/socket"
const router = express.Router()
const prisma = new PrismaClient()

router.post("/reload_page", async (request: Request, response: Response) => {
    const data = request.body

    sendRefresh("app", data.time)
    response.json({ refresh: "app" })
})

export default router
