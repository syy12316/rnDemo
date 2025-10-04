"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const chatRoute_1 = require("./src/chatRoute");
dotenv.config();
const app = express();
// 修复：将端口转换为数字类型
const port = parseInt(process.env.PORT || '8000', 10);
// 解决跨域问题
app.use(cors({
    origin: '*', // 允许所有来源
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// 解析请求体为json格式
app.use(express.json());
// 在注册路由前添加
console.log('正在注册 /chat 路由...');
app.use('/chat', chatRoute_1.chatRoutes);
// 添加一个测试路由
app.get('/test', (req, res) => {
    res.json({ message: '测试路由正常工作' });
});
console.log('路由注册完成');
// 修复：现在 port 是数字类型，不会出现类型错误
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 服务器运行在 http://0.0.0.0:${port}`);
    console.log(`💻 本地访问: http://localhost:${port}`);
    console.log(`📱 移动端访问: http://192.168.10.36:${port}`);
});
//# sourceMappingURL=index.js.map