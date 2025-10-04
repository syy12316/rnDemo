import express = require('express');
import cors = require('cors');
import dotenv = require('dotenv');
import { chatRoutes } from './src/chatRoute';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '8000', 10);

// 中间件 - 分开配置以确保CORS正确工作
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/chat', chatRoutes);
app.get('/', (req, res) => res.json({ message: '服务器运行正常' }));

// 错误处理
app.use((req, res) => res.status(404).json({ error: '路由不存在' }));
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`服务器运行中: http://192.168.10.36:${port}`);
});