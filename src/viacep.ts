import axios from "axios"

const api = axios.create({
    baseURL: "https://viacep.com.br/ws",
    timeout: 1000 * 10,
})

const viacep = {
    search: (cep: string | number, callback: Function) => {
        api.get(`/${cep}/json/`)
            .then((response) => callback(response.data))
            .catch((error) => console.error(error))
    },
}

export default viacep
