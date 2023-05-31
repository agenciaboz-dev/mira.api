import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { exec } from "child_process"
import { Order } from "./definitions/pagseguro"
import { pagseguro } from "./pagseguro"
import { AxiosResponse } from "axios"
const router = express.Router()
const prisma = new PrismaClient()

router.get("/keys", async (request, response) => {
    const keys = await prisma.pagseguro.findFirst()

    if (keys) {
        const key = {
            public_key: keys.public,
            created_at: keys.timestamp,
        }

        response.json(key)
    }
})

router.get("/new_keys", async (request, response, next) => {
    const keys = await prisma.pagseguro.findFirst()

    if (keys) {
        console.log(keys)
        response.json({ keys, url: `https://app.agenciaboz.com.br:4102/api/pagseguro/keys` })
    } else {
        console.log("keys not found, generating new rsa key")
        const command = {
            private: `openssl genpkey -algorithm RSA -out private-key -pkeyopt rsa_keygen_bits:2048`,
            public: `openssl rsa -pubout -in private-key -out public-key`,
        }

        const new_keys = { public: "", private: "" }

        exec(command.private, (err, stdout, stderr) => {
            console.log("private key:")
            exec("cat private-key", (err, stdout, stderr) => {
                console.log("success")
                new_keys.private = stdout.replace(/\r\n/g, "")

                exec(command.public, (err, stdout, stderr) => {
                    console.log("public key:")
                    exec("cat public-key", async (err, stdout, stderr) => {
                        console.log("success")
                        new_keys.public = stdout.replace(/\r\n/g, "")

                        const inserted_keys = await prisma.pagseguro.create({
                            data: {
                                private: new_keys.private,
                                public: new_keys.public,
                                timestamp: Date.now(),
                            },
                        })
                        console.log("keys stored in database")

                        response.json({
                            keys: new_keys,
                            url: `https://app.agenciaboz.com.br:4102/api/pagseguro/keys`,
                            new: true,
                        })
                    })
                })
            })
        })
    }
})

router.post("/new", async (request: Request, response: Response) => {
    const data: Order = request.body
    console.log(data)

    const order = await prisma.orders.create({
        data: {
            user_id: 1,
            method: "pix",
            status: 0,
            // products: { connect: data.items?.map((product) => ({ id: 1 })) }, /
            address_id: 1,
        },
        include: { address: true },
    })

    pagseguro.order(data, (pag_response: AxiosResponse) => {
        const data = pag_response.data
        response.json({ pagseguro: data, order })
    })
})

export default router
