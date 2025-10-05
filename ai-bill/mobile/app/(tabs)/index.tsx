import DateTimePicker from '@react-native-community/datetimepicker';
import { useState, useEffect } from 'react';
import { Pressable, ScrollView, Text, View, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecordCard from '../../components/RecordCard';
import AddRecordDialog from '../../components/AddRecordDialog';
import { useAuth } from '../_layout'
import { create } from 'zustand'
import axios from 'axios';
import { useRouter } from 'expo-router';

// 日期格式化函数
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从0开始，需要+1
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

// 修改useRecord store
export const useRecord = create((set, get) => ({
  records:[],
  loading: false,
  error: null,
  
  fetchRecords: async (date:Date,session:any) => {
    if(!session?.user?.id) return;
    
    set({loading: true, error: null});

    const headers = {
      'Authorization': `Bearer ${session?.access_token}`,
    } 
    
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/record`,{
        user_id: session?.user?.id,
        date: date.toISOString().split('T')[0],
      },{headers});
      
      set({
        records: response.data.records || [],
        loading: false,
        error: null,
        lastUpdate: Date.now() // 更新最后更新时间
      });
    } catch (error) {
      console.error('获取记录失败:', error);
      set({
        records: [],
        loading: false,
        error: '获取记录失败'
      });
    }
  },

  // 修改删除记录的函数为POST请求
  deleteRecord: async (recordId: number, session: any) => {
    if(!session?.user?.id) return;
    
    const headers = {
      'Authorization': `Bearer ${session?.access_token}`,
    };

    try {
      await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/record/delete`,
        {
          id: recordId,
          user_id: session?.user?.id
        },
        { headers }
      )}catch(error){
        console.error('删除记录失败:', error);
      }
  },
}))

export default function HomeScreen(){
  const [date,setDate] = useState(new Date());
  const [showDatePicker,setShowDatePicker] = useState(false);
  const [isDialogVisible,setIsDialogVisible] = useState(false);

  const session = useAuth((state:any) => state.session);
  const records = useRecord((state:any) => state.records);
  const fetchRecords = useRecord((state:any) => state.fetchRecords);
  const deleteRecord = useRecord((state:any) => state.deleteRecord);
  const router = useRouter();

  const total = records.reduce((acc:number, cur:any)=>{
    if(cur.amount){
      return acc + Number(cur.amount)
    }
    return acc
  },0);

  const handleDelete = async(recordId:number, session:any)=>{
      await deleteRecord(recordId, session);
      fetchRecords(date, session);
  }

  useEffect(()=>{
    if(!session?.user?.id) return;
    fetchRecords(date, session)
  },[date, fetchRecords, session])

  return (
    <SafeAreaView className='flex-1 flex gap-4 mx-4'>
      <View className='flex flex-row justify-between'>
        <Text className='font-bold'>{formatDate(date)}</Text>
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
        <View className='flex-1 bg-green-50 p-4 rounded-lg shadow-sm'>
          <View className='flex flex-row justify-between items-center'>
            <Text className='font-bold'>收入</Text>
            {session?.user?.id ? (
              <Text className='text-green-500'>{records.reduce((acc:number, cur:any)=>{
                if(cur.amount && Number(cur.amount) >= 0){
                  return acc + Number(cur.amount)
                }
                return acc
              },0)}</Text>
            ):(
              <Text className='text-green-500'>0</Text>
            )}
          </View>
        </View>
        <View className='flex-1 bg-red-50 p-4 rounded-lg shadow-sm'>
          <View className='flex flex-row justify-between items-center'>
            <Text className='font-bold'>支出</Text>
            {session?.user?.id ? (
              <Text className='text-red-500'>{records.reduce((acc:number, cur:any)=>{
                if(cur.amount && Number(cur.amount) < 0){
                  return acc + Number(cur.amount)
                }
                return acc
              },0)}</Text>
            ):(
              <Text className='text-red-500'>0</Text>
            )}
          </View>
        </View>
      </View>
      {/* 添加按钮 */}
      <View>
        <Button 
          title='添加记录'
          onPress={()=>{
            //出现弹窗
            setIsDialogVisible(true)
          }}/>
      </View>
      {/* 详细记录 */}
      <View className='py-4 rounded-lg flex-1'>
        <Text className='text-gray-500'>详细记录</Text>
        {session?.user?.id ? (
          <ScrollView >
          {records.map((record:any)=>{
            return (
              <View key={record.id} className='flex flex-row justify-between items-center'>
                <RecordCard record={record}></RecordCard> 
                <Pressable 
                  className='mt-3 p-4 rounded-md flex items-center justify-center'
                  onPress={()=>{
                    handleDelete(record.id, session)
                  }}>
                  <Text className='text-red-500 font-bold'>删除</Text>
                </Pressable>
              </View>
            )           
          })}
        </ScrollView>
        ):(
          <Pressable 
            onPress={()=>{
              router.push('/profile');
            }}>
            <Text className='text-center text-gray-500'>请先登录</Text>
          </Pressable>
        )}
      </View>
      {/* 总消费 */}
      <View className='rounded-lg box-shadow-sm'>
        <Text className='text-gray-500'>总消费</Text>
        <View className='flex flex-row justify-between items-center '>
          <Text className='font-bold text-lg'>{formatDate(date)}</Text>
          {session?.user?.id && (
            <Text className={`font-bold text-lg ${total >= 0?'text-green-500':'text-red-500'}`}>
              {total.toFixed(2)}
            </Text>
          )}
        </View>
      </View>
      {/* 添加记录弹窗 */}
      <AddRecordDialog
        date={date}
        isVisible={isDialogVisible}
        onClose={()=>{
          setIsDialogVisible(false)
        }}
      />
    </SafeAreaView>
  )

}