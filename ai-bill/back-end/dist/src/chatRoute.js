"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoutes = void 0;
const deepseek_1 = require("@ai-sdk/deepseek");
const ai_1 = require("ai");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./index");
dotenv_1.default.config();
exports.chatRoutes = express_1.default.Router();
const deepSeek = (0, deepseek_1.createDeepSeek)({
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    baseURL: 'https://api.deepseek.com',
});
const today = new Date().toISOString().split('T')[0];
const prompt = `你是一个财务分析助手。请严格遵循以下规则：

当用户输入包含消费或支出记录时，你必须返回一个 JSON 对象，格式如下：
{
  "amount": 数字,
  "title": "字符串",
  "date": "YYYY-MM-DD"
}

规则：
1. 消费金额为负数，收入金额为正数
2. title 字段：消费时填写商品/服务名称，收入时填写来源，无法确定时填"others"
3. date 字段：如果能从输入中分析出日期，使用该日期，否则使用今天日期：${today}
4. 如果输入不是财务记录，返回普通文本回复

重要：如果是财务记录，只返回 JSON 对象，不要添加任何额外文本！

示例：
用户输入："今天吃饭花了50元"
正确响应：{"amount": -50, "title": "餐饮", "date": "${today}"}

用户输入："I spend 500 on cars"
正确响应：{"amount": -500, "title": "汽车", "date": "${today}"}

用户输入："你好"
正确响应："你好！有什么可以帮助你的吗？"`;
// 添加GET路由处理 - 在POST路由之前添加
exports.chatRoutes.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Chat API is running',
        timestamp: new Date().toISOString(),
        usage: 'Send POST requests to this endpoint for chat functionality'
    });
});
exports.chatRoutes.post('/', async (req, res) => {
    const { messages, user_id: userId } = req.body;
    let resJson = {
        text: '',
        records: null,
    };
    try {
        // 调用 AI API
        const { text } = await (0, ai_1.generateText)({
            model: deepSeek('deepseek-chat'),
            system: prompt,
            messages: messages,
        });
        const record = parseText(text);
        if (record) {
            // 记录到数据库
            await (0, index_1.createRecord)(userId, record.amount, record.title, record.date);
            resJson.records = record;
        }
        else {
            resJson.text = text;
        }
        // 返回响应格式
        res.status(200).json({
            id: Date.now().toString(),
            role: 'assistant',
            content: resJson.records ? JSON.stringify(resJson.records) : resJson.text,
        });
    }
    catch (error) {
        console.error('❌ API 调用错误:', error);
        res.status(500).json({
            text: '服务器错误',
            records: null,
        });
        return;
    }
});
const parseText = (result) => {
    try {
        //清理可能存在的markdown
        const cleanResult = result.replace(/```json\n/, '').replace(/\n```/, '').trim();
        const parsedResult = JSON.parse(cleanResult);
        if (parsedResult.amount && parsedResult.title && parsedResult.date) {
            return parsedResult;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.log('❌ 解析JSON错误:', error);
        return null;
    }
};
//# sourceMappingURL=chatRoute.js.map