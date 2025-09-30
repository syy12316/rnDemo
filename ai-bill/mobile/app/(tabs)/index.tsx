import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecordCard from '../../components/RecordCard';
export default function HomeScreen(){
  const [date,setDate] = useState(new Date());
  const [showDatePicker,setShowDatePicker] = useState(false);

  return (
    <SafeAreaView className='flex-1 flex gap-4 mx-4'>
      <View className='flex flex-row justify-between'>
        <Text className='font-bold'>{date.toLocaleDateString()}</Text>
        <Pressable 
          onPress={()=>{
            setShowDatePicker(true)
          }}>
          <Text className='text-gray-500'>选择日期</Text>
        </Pressable>
      </View>
      {/* 日期选择 */}
      <View>
        {showDatePicker &&(
          <DateTimePicker
            value={date}
            mode="date"
            display='inline'
            onChange={(event, selectedDate)=>{
              if(selectedDate){
                setDate(selectedDate)
                setShowDatePicker(false)
              }
            }}
          />
        )}
      </View>
      {/* 收入支出总额 */}
      <View className='flex flex-row gap-4'>
        <View className='flex-1 bg-green-50 p-4 rounded-lg'>
          <View className='flex flex-row justify-between items-center'>
            <Text className='font-bold'>收入</Text>
            <Text className='text-green-500'>100</Text>
          </View>
        </View>
        <View className='flex-1 bg-red-50 p-4 rounded-lg'>
          <View className='flex flex-row justify-between items-center'>
            <Text className='font-bold'>支出</Text>
            <Text className='text-red-500'>100</Text>
          </View>
        </View>
      </View>
      {/* 详细记录 */}
      <View className='py-4 rounded-lg flex-1'>
        <Text className='text-gray-500'>详细记录</Text>
        <ScrollView >
          <RecordCard record={{
            id:1,
            title:'收入',
            amount:-100,
            createAt:'2023-01-01',
          }}></RecordCard>
        </ScrollView>
      </View>

    </SafeAreaView>
  )

}