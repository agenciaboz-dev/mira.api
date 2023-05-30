import axios from "axios"
import { Order } from "./definitions/pagseguro"

const api = axios.create({
    baseURL: "https://sandbox.api.pagseguro.com",
    timeout: 1000 * 10,
})

const token = "070B295159854F84A2358971995B2C6E"

const headers = { Authorization: token }

export const pagseguro = {
    order: (order: Order, callback: Function) =>
        api.post("/orders", order, { headers }).then((response) => callback(response)),
}
