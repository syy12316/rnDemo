import { useGlobalContext } from '@/context/GlobalContext';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { register } from '../../lib/appwrite';

const SignUp = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [username,setUsername] = useState('');
  const [loading,setLoading] = useState(false);
  const { refreshUser } = useGlobalContext();
  const handleSignUp = async () => {
    try{
      setLoading(true);
      await register(email,password,username);
      setLoading(false);
      router.push('/');
      refreshUser();
    }catch(error){
      console.log(error);
      Alert.alert('注册失败，请检查邮箱和密码');
      throw error;
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-myBackGround'>
      <View className='flex-1 flex-col mx-2'>
        <Text className='text-2xl font-bold text-myGreen text-center mt-20'>注册</Text>
        <TextInput 
          placeholder='请输入邮箱'
          value={email}
          onChangeText={setEmail}
          className='border border-myGreen rounded-lg p-2 mt-10 h-15'
        />
        <TextInput 
          placeholder='请输入用户名'
          value={username}
          onChangeText={setUsername}
          className='border border-myGreen rounded-lg p-2 mt-6 h-15'
        />
        <TextInput 
          placeholder='请输入密码'
          value={password}
          onChangeText={setPassword}
          className='border border-myGreen rounded-lg p-2 mt-6 h-15'
          secureTextEntry={true}
        />
        <Pressable
          className='bg-myGreen p-2 h-15 rounded-lg mt-6'
          onPress={handleSignUp}
        >
          <Text className='text-white text-xl text-bold text-center'>{loading?'注册中':'注册'}</Text>
        </Pressable>
        <View className='flex-row justify-center mt-3'>

          <Text className='text-semiBold'>已有帐号？ </Text>
          <Link href='/sign_in' className='text-myGreen'>去登陆</Link>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SignUp