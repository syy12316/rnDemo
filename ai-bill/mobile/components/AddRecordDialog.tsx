import { View, TextInput } from 'react-native';
import { useState } from 'react';
import { Dialog } from '@rneui/themed';
import { useRecord } from '../app/(tabs)/index'
import { useAuth } from '../app/_layout';
import axios from 'axios';
interface RecordForm {
  user_id:string,
  title:string,
  amount:string,
  date:string,
}

export default function AddRecordDialog({isVisible,onClose,date}:{isVisible:boolean,onClose:()=>void,date:Date}){
  const fetchRecords = useRecord((state:any) => state.fetchRecords);
  const session = useAuth((state:any) => state.session);
  const [form,setForm] = useState<RecordForm>({
    user_id: session?.user?.id || '',
    title: '',
    amount: '',
    date: date.toISOString().split('T')[0],
  })
  const headers = {
    'Authorization': `Bearer ${session?.access_token}`,
  }
  // 重置表单函数
  const resetForm = () => {
    setForm({
      user_id: session?.user?.id || '',
      title: '',
      amount: '',
      date: date.toISOString().split('T')[0],
    });
  };
  const cancle = () => {
    resetForm();
    onClose();
  }
  const add = async (record:any) => {
    // 先添加记录
    try{
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/record/create`,{
        user_id: session?.user?.id,
        title: form.title,
        amount: Number(form.amount),
        date: form.date,
      },{headers})
      if(response.status === 200){
        //获取更新后的记录
        fetchRecords(date,session);
        resetForm();
        onClose();
      }
    }catch(error){
      console.error('添加记录失败:', error);
    }
  }
  return (
    <View>
      <Dialog isVisible={isVisible}>
        <Dialog.Title title="添加消费记录"></Dialog.Title>
        <View className='flex flex-col gap-4'>
          <TextInput 
            placeholder="请输入标题" 
            value={form.title}
            onChangeText={(text)=>setForm({...form,title:text})}
            className="border border-gray-300 rounded-md p-2" 
          />
          <TextInput 
          placeholder="请输入金额"
          value={form.amount}
          onChangeText={(text)=>setForm({...form,amount:text})}
          keyboardType="numeric" 
          className="border border-gray-300 rounded-md p-2"/>
        </View>
        <Dialog.Actions>
          <Dialog.Button title="取消" onPress={cancle} />
          <Dialog.Button title="确定" onPress={add} />
        </Dialog.Actions>
      </Dialog>
    </View>
  )
}