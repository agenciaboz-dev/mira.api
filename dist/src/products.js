"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma.products.findMany();
    response.json(products);
}));
router.post("/add", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const data = request.body;
    data.stock = Number(data.stock.toString().replace(/\D/g, ""));
    data.price = Number(data.price
        .toString()
        .replace(/[^,.\d]/g, "")
        .replace(",", "."));
    console.log(data);
    const product = yield prisma.products.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            image: data.image,
            video: data.video,
            story: data.story,
            specifications: JSON.stringify([{ name: "teste", value: "5kg" }]),
        },
    });
    response.json(product);
}));
router.post("/update", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const data = request.body;
    console.log(data);
    data.stock = Number(data.stock.toString().replace(/\D/g, ""));
    data.price = Number(data.price
        .toString()
        .replace(/[^,.\d]/g, "")
        .replace(",", "."));
    const product = yield prisma.products.update({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            image: data.image,
            video: data.video,
            story: data.story,
            specifications: JSON.stringify([{ name: "teste", value: "5kg" }]),
        },
        where: { id: data.id },
    });
    response.json(product);
}));
exports.default = router;
