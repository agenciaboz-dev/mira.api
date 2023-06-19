import axios from "axios"
import { Order } from "./definitions/pagseguro"

const api = axios.create({
    baseURL: "https://api.pagseguro.com",
    // baseURL: "https://sandbox.api.pagseguro.com",
    timeout: 1000 * 10,
})

// const token = "070B295159854F84A2358971995B2C6E" // sandbox
const token = "f5f3ebec-cfbd-4f67-9ead-d42902381641864fbe9140cfb82a8005b4f5c049c336d7c7-7333-4f2a-bb46-3df8d5a282f9"

const headers = { Authorization: token }

export const pagseguro = {
    order: (order: Order, callback: Function) =>
        api
            .post("/orders", order, { headers })
            .then((response) => callback(response))
            .catch((error) => console.log(error.response.data)),
    pixPay: (order: any, callback: Function) =>
        api.post("/pix/pay/" + order.id, { status: "PAID", tx_id: order.id }, { headers }).then((response) => {
            callback(response)
        }),
    get: (order: any, callback: Function) =>
        api.get("/orders/" + order.id, { headers }).then((response) => {
            callback(response)
        }),
}
