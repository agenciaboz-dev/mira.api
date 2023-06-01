import { WebSocketServer, WebSocket } from "ws"
import { orders, users } from "@prisma/client"

interface Client {
    order: orders
    connection: WebSocket
}

export let clients: Client[] = []

export const wsServer = new WebSocketServer({ noServer: true })

wsServer.on("connection", (connection) => {
    // Generate a unique code for every user

    connection.on("message", (message) => {
        const data = JSON.parse(message.toString())
        // console.log({ websocket: data })

        if (data.order.id) {
            const filtered_clients = clients.filter((client) => client.order.id == data.id)

            if (filtered_clients.length > 0) {
                clients = clients.filter((client) => client.order.id != data.order.id)
            }

            clients.push({ order: data.order, connection })
        }
    })
})
