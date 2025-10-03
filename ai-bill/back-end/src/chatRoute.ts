import { createDeepSeek } from '@ai-sdk/deepseek';
import { generateText } from 'ai';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const chatRoutes = express.Router();

const deepSeek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com', 
});

chatRoutes.post('/simple', async (req: Request, res: Response) => {
  try {
    console.log('📨 收到聊天请求:', req.body);
    
    // 检查 API Key
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('❌ API Key 未设置');
      return res.status(401).json({ 
        success: false,
        error: '请设置有效的 DeepSeek API Key'
      });
    }

    const { messages } = req.body;
    
    let userMessage = 'Hello.';
    
    // 处理消息格式
    if (messages && Array.isArray(messages) && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      userMessage = lastMessage.content || 'Hello.';
    }

    console.log('💬 用户消息:', userMessage);
    
    // 调用 AI API
    const result = await generateText({
      model: deepSeek('deepseek-chat'),
      prompt: userMessage,
    });

    console.log('🤖 AI 响应:', result.text);
    
    // 返回响应格式
    res.json({
      id: Date.now().toString(),
      content: result.text,
      role: 'assistant',
      createdAt: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('❌ API 调用错误:', error);
    
    res.status(500).json({
      success: false,
      error: 'API 调用失败: ' + (error?.message || '未知错误')
    });
  }
});

// 健康检查路由
chatRoutes.get('/health', (req: Request, res: Response) => {
  console.log('🔧 健康检查请求');
  res.json({ 
    status: 'ok',
    message: '聊天服务正常运行',
    timestamp: new Date().toISOString(),
    apiKey: process.env.DEEPSEEK_API_KEY ? '已设置' : '未设置'
  });
});