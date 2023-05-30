import axios from "axios"
import { Quotation } from "./definitions/frete"

const api = axios.create({
    baseURL: "https://api.centraldofrete.com/v1",
    timeout: 1000 * 10,
})

const token = "37fde495b4078426a5a5f6d5c65b3cd9f8792a5a2a4d68c74ab83b4e477400dc"

export const mira = {
    cep: "02304000",
    address: "Avenida Tucuruvi",
    number: "248",
    district: "Tucuruvi",
    city: "São Paulo",
    uf: "SP",
}

const headers = { Authorization: token }

export const frete = {
    list: () =>
        api.get("/order", { headers }).then((response) => {
            const orders = response.data.data
            console.log(orders)
        }),
    cargos: () =>
        api.get("/cargo-type", { headers }).then((response) => {
            const data = response.data
            console.log(data)
        }),
    quotation: (values: Quotation, callback: Function) =>
        api.post("/quotation", values, { headers }).then((response) => {
            callback(response)
        }),
}