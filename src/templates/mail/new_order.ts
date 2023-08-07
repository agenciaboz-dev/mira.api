import { orders, users } from "@prisma/client"

export const newOrderTemplate = (order: orders&{user:users}) => `
    <div>
        <p>${order.user.name},</p>
        <p>Clique nesse link e insira sua nova senha</p>
        <a href="https://app.mirasuprimentos.com.br/password/reset/">Resetar senha</a>
    </div>
`
