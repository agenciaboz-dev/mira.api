import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { clients } from "./websocket/socket"
import nodemailer from 'nodemailer';

const router = express.Router()
const prisma = new PrismaClient()

router.post("/", async (request: Request, response: Response) => {
  const data = request.body
  console.log({ change_password: data.change_password })

  if (data.change_password) {
    const user = await prisma.users.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.new_password,
      },
      include: { addresses: true, cards: true, orders: true },
    })
    response.json(user)
  } else {
    const user = await prisma.users.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
      include: { addresses: true, cards: true, orders: true },
    })
    response.json(user)
  }
})

router.post("/address", async (request: Request, response: Response) => {
  const data = request.body
  console.log(data)

  if (data.new_address) {
    const address = await prisma.addresses.create({
      data: {
        receiver: data.receiver,
        phone: data.phone,
        cep: data.cep,
        address: data.address,
        number: Number(data.number.toString().replace(/D/, "")),
        complement: data.complement,
        district: data.district,
        city: data.city,
        uf: data.uf,
        user: data.user_id,
      },
    })

    response.json(address)
  } else {
    const address = await prisma.addresses.update({
      data: {
        receiver: data.receiver,
        phone: data.phone,
        cep: data.cep,
        address: data.address,
        number: Number(data.number.toString().replace(/D/, "")),
        complement: data.complement,
        district: data.district,
        city: data.city,
        uf: data.uf,
      },

      where: { id: data.id },
    })

    response.json(address)
  }
})

router.post("/card", async (request: Request, response: Response) => {
  const data = request.body
  console.log(data)

  if (data.new_card) {
    const card = await prisma.cards.create({
      data: {
        name: data.name,
        number: data.number,
        cvv: data.cvv,
        expiration_month: data.expiration_month,
        expiration_year: data.expiration_year,
        type: data.type,
        user: data.user_id,
      },
    })

    response.json(card)
  } else {
    const card = await prisma.cards.update({
      data: {
        name: data.name,
        number: data.number,
        cvv: data.cvv,
        expiration_month: data.expiration_month,
        expiration_year: data.expiration_year,
        type: data.type,
        user: data.id,
      },

      where: { id: data.id },
    })

    response.json(card)
  }
})

router.get("/ws", async (request: Request, response: Response) => {
  response.json(clients)
})

router.post("/password-recovery", async (request: Request, response: Response) => {
  const { email } = request.body;

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    return response.status(400).json({ error: "Usuário não encontrado." });
  }

  const token = Math.random().toString(36).slice(-10);
  const recoveryLink = `localhost:3000/password-reset?token=${token}`;
  // https://app.mirasuprimentos.com.br/password-reset?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: 'mail.cooperativasion.com.br',
    port: 25,
    secure: true,
    auth: {
      user: 'noreply@cooperativasion.com.br',
      pass: '2Fc2K[TXT?C'
    }
  });

  const mailOptions = {
    from: '"Teste" <noreply@cooperativasion.com.br>',
    to: user.email,
    subject: "Recuperação de senha",
    html: `
      <p>Olá ${user.name},</p>
      <p>Clique <a href="${recoveryLink}">aqui</a> para redefinir sua senha.</p>
      `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      response.status(500).json({ error: "Ocorreu um erro ao enviar o e-mail de recuperação de senha." });
    } else {
      response.json({ success: true });
    }
  });
});


router.post("/password-reset", async (request: Request, response: Response) => {
  const { token, password } = request.body;

  const user = await prisma.users.findFirst({
    where: {
      token: { equals: token },
    },
  });

  if (!user) {
    return response.status(400).json({ error: "Token inválido." });
  }

  const updatedUser = await prisma.users.update({
    where: { id: user.id },
    data: {
      password,
      token,
    },
  });

  response.json({ message: "Senha redefinida com sucesso.", updatedUser });
});


export default router
