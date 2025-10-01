import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../_layout';
export default function App() {
  const session = useAuth((state:any) => state.session);
  const [input, setInput] = useState('');
  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: `${process.env.EXPO_PUBLIC_API_URL}/chat`,
      body: {user_id : session?.user?.id},
    }),
    onError: error => console.error(error, 'ERROR'),
    //streamProtocol:'text',
    // body:{
    //   user_id:session?.user?.id,
    // },
  });

  if (error) return <Text>{error.message}</Text>;

  // useEffect(() => {
    
  // })

  return (
    <SafeAreaView className='flex-1'>
      <View
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingHorizontal: 8,
        }}
      >
        <ScrollView style={{ flex: 1 }}>
          {messages.map(m => (
            <View key={m.id} style={{ marginVertical: 8 }}>
              <View>
                <Text style={{ fontWeight: 700 }}>{m.role}</Text>
                {m.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return <Text key={`${m.id}-${i}`}>{part.text}</Text>;
                  }
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={{ marginTop: 8 }}>
          <TextInput
            className='border border-gray-300 bg-white rounded-lg p-2 mb-2'
            placeholder="请输入内容"
            value={input}
            onChange={e => setInput(e.nativeEvent.text)}
            onSubmitEditing={e => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput('');
            }}
            autoFocus={true}
          />
        </View>
      </View>    
    </SafeAreaView>
  );
}