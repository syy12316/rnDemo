// 记录卡片
import React from 'react';
import { Text, View } from 'react-native';
type Record = {
  id: number;
  title: string;
  amount: number;
  createAt: string;
}

const RecordCard = ({record}:{record:Record}) => {
  return (
    <View className='mt-3 bg-white p-4 rounded-lg shadow-sm'>
      <View className='flex flex-row justify-between items-center'>
        <Text className='text-lg font-semibold'>{record.title}</Text>
        <Text className={`font-bold ${record.amount > 0 ? 'text-green-500':'text-red-500'}`} >{record.amount}</Text>
      </View>
    </View>
  )
}

export default RecordCard