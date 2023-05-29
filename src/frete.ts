import axios from "axios"

export const api = axios.create({
    baseURL: "https://sandbox.centraldofrete.com",
    timeout: 1000 * 10,
})
