"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoutes = void 0;
const deepseek_1 = require("@ai-sdk/deepseek");
const ai_1 = require("ai");
const express_1 = __importDefault(require("express"));
exports.chatRoutes = express_1.default.Router();
const deepSeek = (0, deepseek_1.createDeepSeek)({
    apiKey: process.env.DEEPSEEK_API_KEY || '',
});
exports.chatRoutes.post('/', async (req, res) => {
    const result = await (0, ai_1.generateText)({
        model: deepSeek('deekseek-chat'),
        prompt: 'Hello.',
    });
    res.json({ result });
    return;
});
//# sourceMappingURL=chatRoute.js.map