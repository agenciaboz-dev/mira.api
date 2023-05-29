import { WebSocketServer } from "ws"
import { clients } from "../websocket/clients"

export const wsServer = new WebSocketServer({ noServer: true })

wsServer.on("connection", (connection) => {
    // Generate a unique code for every user

    connection.on("message", (message) => {
        const user = JSON.parse(message.toString())
        clients.push({ user, connection })
    })
})
