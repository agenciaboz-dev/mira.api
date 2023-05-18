import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { exec } from "child_process"
const router = express.Router()
const prisma = new PrismaClient()

router.post("/webhook", (request, response, next) => {
    const data = request.body

    if (data?.charges[0]?.status == "PAID") {
        const id = data.charges[0].reference_id
        let assinatura = data.items[0].name
        assinatura = assinatura.charAt(0).toUpperCase() + assinatura.slice(1)
        console.log({ datetime: new Date(), webhook: data })

        console.log(`pago membro ${id}`)

        // const mysql = newMysql(config.sbop.database)
        // mysql.connect()

        // mysql.query({
        //     sql: "UPDATE Membros SET pago=true, assinatura = ?, temporario = 'false' WHERE id = ?",
        //     values: [ assinatura, id ]
        // }, (error, results) => {
        //     if (error) console.log(error)
        // })

        // clients[id].send('PAID')
    }

    response.json({ message: "teste" })
})

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

// router.post("/new_order", (request, response, next) => {
//     const data = request.body
//     // console.log(data)

//     const options = {
//         method: "POST",
//         url: "https://api.pagseguro.com/orders",
//         headers: {
//             accept: "application/json",
//             Authorization:
//                 "Bearer ac4751ea-4d2b-4f32-9ae2-cf6b2f4da772bf4af43b43c6b2834627b037ec82c9a93900-8c98-4e5f-b786-e34a98d3b18e",
//             "content-type": "application/json",
//         },

//         data: data,
//     }
//     console.log({ datetime: new Date(), request: options })

//     axios.request(options).then((_response) => {
//         console.log({ datetime: new Date(), response: _response.data })
//         response.json(_response.data)
//     })
//     // .catch(function (error) {
//     //     console.error(error);
//     // });
// })

// router.post("/simulate_payment", (request, response, next) => {
//     const options = request.body
//     // console.log(data)

//     axios
//         .request(options)
//         .then(function (_response) {
//             response.json(_response.data)
//         })
//         .catch(function (error) {
//             console.error(error)
//         })
// })

// router.post("/consult", (request, response, next) => {
//     const options = request.body
//     // console.log(data)

//     axios
//         .request(options)
//         .then(function (_response) {
//             response.json(_response.data)
//         })
//         .catch(function (error) {
//             console.error(error)
//         })
// })

// router.post("/refund", (request, response, next) => {
//     const options = request.body
//     // console.log(data)

//     axios
//         .request(options)
//         .then(function (_response) {
//             response.json(_response.data)
//         })
//         .catch(function (error) {
//             console.error(error)
//         })
// })

export default router
