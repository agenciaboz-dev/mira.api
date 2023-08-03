import { orders } from "@prisma/client"

export const mailTemplate = (order: orders) => {
    return `
    <div>
        <p>Pedido: ${order.id}</p>

    </div>
    `
}
