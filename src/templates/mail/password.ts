import { users } from "@prisma/client"

export const passwordTemplate = (user: users, hash: string) => `
    <div>
        <p>${user.name},</p>
        <p>Clique nesse link e insira sua nova senha:</p>
        <a href="https://app.mirasuprimentos.com.br/password/reset/${hash}">Redefinir senha</a>
    </div>
`
