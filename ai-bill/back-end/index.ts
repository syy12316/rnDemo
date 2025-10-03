import cors = require('cors');
import express = require('express');
import dotenv = require('dotenv');
import { chatRoutes } from './src/chatRoute';

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

app.use('/api/chat', chatRoutes);
app.use('/chat', chatRoutes);

// 修复：现在 port 是数字类型，不会出现类型错误
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 服务器运行在 http://0.0.0.0:${port}`);
  console.log(`💻 本地访问: http://localhost:${port}`);
  console.log(`📱 移动端访问: http://192.168.10.36:${port}`);
  console.log(`🔧 健康检查: http://192.168.10.36:${port}/api/chat/health`);
});