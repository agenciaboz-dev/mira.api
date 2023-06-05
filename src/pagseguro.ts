import axios from "axios"
import { Order } from "./definitions/pagseguro"

const api = axios.create({
    baseURL: "https://api.pagseguro.com",
    // baseURL: "https://sandbox.api.pagseguro.com",
    timeout: 1000 * 10,
})

// const token = "070B295159854F84A2358971995B2C6E"
const token = "a85eda2d-b4d5-498a-8321-7122124409cde86412e44669a7601efe4175e898a271a597-c60a-4d8b-88ee-969945e3682c"

const headers = { Authorization: token }

export const pagseguro = {
    order: (order: Order, callback: Function) =>
        api.post("/orders", order, { headers }).then((response) => callback(response)),
    pixPay: (order: any, callback: Function) =>
        api.post("/pix/pay/" + order.id, { status: "PAID", tx_id: order.id }, { headers }).then((response) => {
            callback(response)
        }),
    get: (order: any, callback: Function) =>
        api.get("/orders/" + order.id, { headers }).then((response) => {
            callback(response)
        }),
}
