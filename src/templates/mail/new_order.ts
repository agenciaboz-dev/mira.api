import { orders, users } from "@prisma/client"

export const newOrderTemplate = (order: orders&{user:users}) => `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0;padding: 0;">
<tbody>
    <tr>
        <td>
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                style="background: linear-gradient(to bottom, #b7b7b7, white);">
                <tbody>
                    <tr>
                        <td style="padding: 6vw;">
                            <p
                                style="color: #53337d;font-size: 3.5em;font-family: sans-serif;font-weight: bold;margin: 0;">
                                ${order.user.name}
                            </p>
                            <p style="font-size: 2.5em;font-family: sans-serif;">
                                Seu novo pedido foi recebido.
                                <br>
                                Obrigado!
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
</tbody>
</table>
`
