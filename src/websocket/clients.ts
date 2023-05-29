import { users } from "@prisma/client"
import { WebSocket } from "ws"

interface Client {
    user: users
    connection: WebSocket
}

export const clients: Client[] = []
