import { useState } from 'react';
import { View, TextInput, ScrollView, Text, Button } from 'react-native';
import { useAuth } from '../_layout'
import RecordCard from '@/components/RecordCard';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function App() {
  const session = useAuth((state:any) => state.session);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: input }],
          user_id: session?.user?.id, // 替换为实际用户ID
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // 添加AI回复
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('发送消息错误:', error);
    }

    setInput('');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ScrollView style={{ flex: 1 }}>
        {messages.map(m => (
          <View key={m.id} style={{ marginVertical: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>
              {m.role === 'user' ? '你' : 'AI'}:
            </Text>
            {/* 修复条件渲染 */}
          {(() => {
            try {
              const parsed = JSON.parse(m.content);
              if (typeof parsed === 'object' && parsed !== null) {
                return <RecordCard record={parsed} />;
              }
            } catch (error) {
              console.error('解析JSON错误:', error);
              return <Text>{m.content}</Text>;
            }    
          })()}
          </View>
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        <TextInput
          style={{ 
            flex: 1, 
            borderWidth: 1, 
            borderColor: '#ccc', 
            padding: 8,
            marginRight: 8
          }}
          placeholder="输入消费记录..."
          value={input}
          onChangeText={setInput}
        />
        <Button title="发送" onPress={sendMessage} />
      </View>
    </View>
  );
}