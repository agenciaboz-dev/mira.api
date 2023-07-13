import axios from "axios"
import { PrismaClient, addresses, orderProduct, orders, products, users } from "@prisma/client"

const prisma = new PrismaClient()

const api = axios.create({
    baseURL: "https://homologacao.focusnfe.com.br",
    timeout: 1000 * 10,
})

// const token = "070B295159854F84A2358971995B2C6E" // sandbox
const token = "f5f3ebec-cfbd-4f67-9ead-d42902381641864fbe9140cfb82a8005b4f5c049c336d7c7-7333-4f2a-bb46-3df8d5a282f9"

const headers = { Authorization: token }

export const nfe = {
    create: (
        order: orders & {
            address: addresses | null
            products: (orderProduct & {
                product: products
            })[]
            user: users
        }
    ) => {
        const data = {
            natureza_operacao: "Venda de mercadoria adquirida de terceiros",
            data_emissao: new Date().toISOString().split("T")[0],
            data_entrada_saida: new Date().toISOString().split("T")[0],
            tipo_documento: 1,
            local_destino: order.delivery ? 2 : 1,
            finalidade_emissao: 1,
            consumidor_final: 1,
            presenca_comprador: 1,
            cnpj_emitente: "13532029000247",
            nome_emitente: "Mira Suprimentos Industriais LTDA",
            nome_fantasia_emitente: "Mira Suprimentos",
            logradouro_emitente: "Avenida Tucuruvi",
            numero_emitente: 248,
            bairro_emitente: "Tucuruvi",
            municipio_emitente: "S\u00e3o Paulo",
            uf_emitente: "SP",
            // cep_emitente: "02304-000",
            inscricao_estadual_emitente: "131463323114",
            regime_tributario_emitente: 3,

            nome_destinatario: order.name,
            cpf_destinatario: order.cpf,
            inscricao_estadual_destinatario: null,
            telefone_destinatario: 1196185555,
            logradouro_destinatario: order.address?.address || "Avenida Tucuruvi",
            numero_destinatario: order.address?.number || 248,
            bairro_destinatario: order.address?.district || "Tucuruvi",
            municipio_destinatario: order.address?.city || "S\u00e3o Paulo",
            uf_destinatario: order.address?.uf || "SP",
            indicador_inscricao_estadual_destinatario: 9,
            // cep_destinatario: order.address?.cep || "02304-000",

            valor_frete: 0.0,
            valor_seguro: 0,
            valor_total: order.value,
            valor_produtos: order.value,
            pis_valor: order.value * (0.65 / 100),
            cofins_valor: order.value * (3 / 100),
            modalidade_frete: 0,

            items: order.products.map((item) => ({
                numero_item: order.products.indexOf(item) + 1,
                codigo_produto: item.product.id,
                descricao: item.product.name,
                cfop: 5102,
                unidade_comercial: "un",
                quantidade_comercial: item.quantity,
                valor_unitario_comercial: item.product.price,
                valor_unitario_tributavel: item.product.price,
                unidade_tributavel: "un",
                codigo_ncm: item.product.ncm,
                quantidade_tributavel: item.quantity,
                valor_bruto: item.product.price * item.quantity,
                icms_origem: 0,
                icms_situacao_tributaria: "00",
                cofins_situacao_tributaria: "01",
                icms_base_calculo: item.product.price * item.quantity,
                icms_valor_total: item.product.price * item.quantity * (1 + item.product.aliquot / 100),
            })),
        }

        api.post(`/v2/nfe?ref=${order.id}`, data)
    },
}
