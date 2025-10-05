import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import dotenv from 'dotenv'
import { recordTable } from './db/schema'
import { eq,and } from 'drizzle-orm';

dotenv.config();


const client = postgres(process.env.DATABASE_URL!)
const db = drizzle({ client });

export default db;

//插入数据的api
export const createRecord = async(userId:string,amount:number,title:string,date:Date) => {
  const dateObj = new Date(date);
  const amountInCents = amount * 100;
  try{
    const record = await db.insert(recordTable).values({
      userId,
      amount:amountInCents,
      title,
      date:dateObj,
    })
    return record;
  }catch(error){
    console.log(error);
    return;
  }
}

//查询数据的api
export const getRecords = async(userId:string,date:Date) => {
  const dateObj = new Date(date);
  try{
    const records = await db.select().from(recordTable).where(
      and(
        eq(recordTable.userId,userId),
        eq(recordTable.date,dateObj),
      )
    )
    //将amount转换为元
    records.forEach((record) => {
      record.amount = record.amount / 100;
    })
    return records;
  }catch(error){
    console.log(error);
    return;
  }
}

//删除数据的api - 修改为根据ID删除
export const deleteRecord = async (id:number,user_id:string) => {
  try{
    const result = await db.delete(recordTable)
      .where(
        and(
          eq(recordTable.id, id),
          eq(recordTable.userId, user_id)
        )
      );
    return result;
  }catch(error){
    console.log(error);
    return ;
  }
}
// export const deleteRecord = async(id: number, userId: string) => {
//   try{
//     // 先验证记录是否存在且属于该用户
//     const record = await db.select()
//       .from(recordTable)
//       .where(
//         and(
//           eq(recordTable.id, id),
//           eq(recordTable.userId, userId)
//         )
//       )
//       .limit(1);

//     if (record.length === 0) {
//       return false; // 记录不存在或无权删除
//     }

//     // 删除记录
//     const result = await db.delete(recordTable)
//       .where(eq(recordTable.id, id));
    
//     return result;
//   }catch(error){
//     console.log(error);
//     return false;
//   }
// }