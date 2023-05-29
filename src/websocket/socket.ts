import { WebSocketServer, WebSocket } from "ws"
import { users } from "@prisma/client"

interface Client {
    user: users
    connection: WebSocket
}

export let clients: Client[] = []

export const removeClient = (user: users) => {
    clients = clients.filter((client) => client.user.id != user.id)
}

export const wsServer = new WebSocketServer({ noServer: true })

wsServer.on("connection", (connection) => {
    // Generate a unique code for every user

    connection.on("message", (message) => {
        const data = JSON.parse(message.toString())

        if (data.user) {
            const filtered_clients = clients.filter((client) => client.user.id == data.user.id)

            if (filtered_clients.length > 0) {
                clients = clients.filter((client) => client.user.id != data.user.id)
            }

            clients.push({ user: data.user, connection })
        }
    })
})
