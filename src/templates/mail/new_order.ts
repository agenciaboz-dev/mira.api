import { orders, users } from "@prisma/client"

export const newOrderTemplate = (order: orders&{user:users}) => `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0;padding: 0;">
    <tbody>
        <tr>
            <td>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tbody>
                        <tr>
                            <td style="padding: 6vw;">
                                <p
                                    style="color: #53337d;font-size: 3em;font-family: sans-serif;font-weight: bold;margin: 0;">
                                    ${order.user.name}
                                </p>
                                <p style="font-size: 2em;font-family: sans-serif;">
                                    Seu novo pedido foi recebido. ID: ${order.id}
                                    <br>
                                    Obrigado!
                                </p>
                            </td>
                            <td>
                                <img src="https://static.wixstatic.com/media/082295_b758f0567197402fafb8ee9666796ac4~mv2.png/v1/fill/w_393,h_393,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Design%20sem%20nome.png" alt="Mira Suprimentos" style="width: 15em">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
`
