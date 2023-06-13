import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import fileUpload from "express-fileupload"
import { router } from "./routes"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import https from "https"
import http from "http"
import fs from "fs"
import { wsServer } from "./src/websocket/socket"

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(fileUpload())
app.use("/api", router)
app.use("/images", express.static("images"))

try {
    const server = https.createServer(
        {
            key: fs.readFileSync("/etc/letsencrypt/live/app.agenciaboz.com.br/privkey.pem", "utf8"),
            cert: fs.readFileSync("/etc/letsencrypt/live/app.agenciaboz.com.br/cert.pem", "utf8"),
            ca: fs.readFileSync("/etc/letsencrypt/live/app.agenciaboz.com.br/chain.pem", "utf8"),
        },
        app
    )

    server.listen(port, () => {
        console.log(`[server]: Server is running at https ${port}`)
    })

    server.on("upgrade", (request, socket, head) => {
        wsServer.handleUpgrade(request, socket, head, (socket) => {
            wsServer.emit("connection", socket, request)
        })
    })
} catch {
    const server = http.createServer(app)

    server.listen(port, () => {
        console.log(`[server]: Server is running at http ${port}`)
    })

    server.on("upgrade", (request, socket, head) => {
        wsServer.handleUpgrade(request, socket, head, (socket) => {
            wsServer.emit("connection", socket, request)
        })
    })
}