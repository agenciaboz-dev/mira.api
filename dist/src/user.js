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
router.post("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const data = request.body;
    console.log({ change_password: data.change_password });
    if (data.change_password) {
        const user = yield prisma.users.update({
            where: { id: data.id },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.new_password,
            },
        });
        response.json(user);
    }
    else {
        const user = yield prisma.users.update({
            where: { id: data.id },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
            },
        });
        response.json(user);
    }
}));
exports.default = router;
