//使用上下文，可以简单理解为全局数据
import { getCurrentUser } from '@/lib/appwrite';
import { User } from '@/lib/modal';
import { createContext, useContext, useEffect, useState } from 'react';

type GlobalContextType = {
  user:User|null;
  setUser: (user:User) => void;
  refreshUser: ()=> void;
}

export const useGlobalContext = () =>{
  return useContext(GlobalContext);
} 

const GlobalContext = createContext<GlobalContextType>({
  user:{
    userId:'',
    name:'',
    email:'',
    avatar_url:'',
  },
  setUser: () =>{},
  refreshUser: () => {},
})

export const GlobalContextProvider = ({children}: {children:React.ReactNode}) =>{
  const [user,setUser] = useState<User>({
    userId:'',
    name:'',
    email:'',
    avatar_url:'',
  })
  const [refreshCnt,setRefreshCnt] = useState(0);
  const getUserInfo = async() => {
    try{
      //从appwrite获取用户信息
      const user = await getCurrentUser();
      if(user){
        setUser(user);
      } else {
        // 如果获取用户信息失败，设置默认空用户
        setUser({
          userId:'',
          name:'',
          email:'',
          avatar_url:'',
        });
      }
    }catch(error){
      console.log('getUserInfo error:', error);
      // 出错时设置默认空用户
      setUser({
        userId:'',
        name:'',
        email:'',
        avatar_url:'',
      });
    }
  }

  useEffect(()=>{
    getUserInfo();
  },[refreshCnt])

  return (
    <GlobalContext.Provider
    value={
     {
        user,
        setUser,
        refreshUser: () =>{
          setRefreshCnt(pre => pre+1);
      }
     }
    }>
      {children}
    </GlobalContext.Provider>
  )
}