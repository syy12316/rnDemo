
import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';
import { User } from './modal';
const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject('68d65457002ccb8c3b0d');

const databaseId = '68d65538000163e509db';
const collectionUserId = 'user';

const account = new Account(client);
const database = new Databases(client);
const avatar = new Avatars(client);

//登录部分的api
const createUser = async (email:string,name:string,user_id:string,avatar_url:string) =>{
  try {
    // @ts-ignore - createDocument is deprecated but still functional
    const user = await database.createDocument(databaseId,collectionUserId,ID.unique(),{
      email,
      name,
      user_id,
      avatar_url
    })
    return user.$id;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const getUserByUserId = async (user_id:string) => {
  const user = await database.listDocuments(databaseId,collectionUserId,[Query.equal('user_id',user_id)]);
  return user.documents[0];
} 

export const login = async (email:string,password:string) =>{
  try{
    const res = await account.createEmailPasswordSession(email,password);
    return res;

  }catch(error){
    console.log(error);
    throw error;
  }
}

export const logout = async() =>{
  try{
    await account.deleteSession('current');
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const register = async (email:string,password:string,name:string) =>{
  try{
    const user = await account.create(ID.unique(),email,password,name);
    const avatar_url = avatar.getInitials(name);
    const res = await createUser(email,name,user.$id,avatar_url.toString());
    return res;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const getCurrentUser = async () => {
  try {
    const res = await account.get();
    if(res && res.$id){
      const user = await getUserByUserId(res.$id);
      if(user){
        return {
          userId:res.$id,
          email: user.email || '',
          name: user.name || '',
          avatar_url: user.avatar_url || '',
        } as User;
      }
    }
    return null;
  } catch(error) {
    console.log('getCurrentUser error:', error);
    return null;
  }
}