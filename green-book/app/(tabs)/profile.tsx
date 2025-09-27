import { Link } from 'expo-router'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const profile = () => {
  return (
    <SafeAreaView className={'flex-1 bg-myBackGround'}>
      <View className='flex-1 flex-col items-center'>

        <View className='flex-row gap-2 justify-center items-center'>
          <Text className='text-2xl font-bold'>profile</Text>
        </View>
        <Link href='/sign_in' className=' p-4 rounded-lg w-full'>
          <Text className='text-center font-semibold text-lg'>
            登录
          </Text>
        </Link>
        <Link href='/sign_up' className=' w-full rounded-lg p-4'>
          <Text className='text-semibold text-center text-lg'>
            注册
          </Text>
        </Link>
        <Pressable className='w-full rounded-lg p-4'>
          <Text className='text-semibold text-center text-lg'>
            退出登录
          </Text>
        </Pressable>
      </View>
      
    </SafeAreaView>
  )
}

export default profile