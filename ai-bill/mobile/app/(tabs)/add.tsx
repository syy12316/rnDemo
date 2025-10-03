import { useState } from 'react';
import { ScrollView, Text, TextInput, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../_layout';

export default function App() {
  const session = useAuth((state: any) => state.session);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{id: string, role: string, content: string, createdAt: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    // 添加用户消息到界面
    const userMessage = {
      id: Date.now().toString() + '-user',
      role: 'user',
      content: content,
      createdAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch(`${API_URL}/api/chat/simple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: content }]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // 添加 AI 回复到界面
      const aiMessage = {
        id: Date.now().toString() + '-ai',
        role: 'assistant',
        content: data.content,
        createdAt: data.createdAt || new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (err: any) {
      console.error('发送消息失败:', err);
      setError(err.message || '发送消息失败');
      Alert.alert('错误', err.message || '发送消息失败');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center'>
        <Text className='text-red-500'>错误: {error}</Text>
        <Text className='text-gray-500 mt-2'>API URL: {API_URL}</Text>
        <Text 
          className='text-blue-500 mt-4 underline'
          onPress={() => setError(null)}
        >
          重试
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View className='flex-1 p-4'>
        {/* 调试信息 */}
        <View className='bg-blue-100 p-2 rounded mb-4'>
          <Text className='text-blue-800 text-sm'>
            调试信息: API_URL = {API_URL}
          </Text>
          <Text className='text-blue-800 text-sm'>
            消息数量: {messages.length}
          </Text>
        </View>
        
        {/* 消息列表 */}
        <ScrollView className='flex-1 mb-4'>
          {messages.length === 0 ? (
            <View className='flex-1 justify-center items-center py-8'>
              <Text className='text-gray-500 text-lg'>开始与 AI 对话吧！</Text>
            </View>
          ) : (
            messages.map((message) => (
              <View 
                key={message.id} 
                className={`mb-4 p-3 rounded-lg max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-blue-500 self-end' 
                    : 'bg-gray-200 self-start'
                }`}
              >
                <Text 
                  className={`${
                    message.role === 'user' ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {message.content}
                </Text>
                <Text className='text-xs text-gray-400 mt-1'>
                  {message.role === 'user' ? '你' : 'AI'} • {new Date(message.createdAt).toLocaleTimeString()}
                </Text>
              </View>
            ))
          )}
          
          {isLoading && (
            <View className='bg-gray-200 self-start p-3 rounded-lg max-w-[80%] mb-4'>
              <Text className='text-gray-600'>AI 正在思考...</Text>
            </View>
          )}
        </ScrollView>

        {/* 输入框 */}
        <View className='border-t border-gray-200 pt-4'>
          <TextInput
            className='border border-gray-300 bg-white rounded-lg p-4 text-base'
            placeholder="请输入您的问题..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => {
              if (input.trim() && !isLoading) {
                sendMessage(input);
                setInput('');
              }
            }}
            editable={!isLoading}
            returnKeyType="send"
          />
          
          <Text className='text-xs text-gray-500 mt-2 text-center'>
            按回车键发送消息
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}