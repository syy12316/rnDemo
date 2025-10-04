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
