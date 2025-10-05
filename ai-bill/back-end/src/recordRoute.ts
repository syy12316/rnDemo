import express from 'express'
import { getRecords, createRecord, deleteRecord } from './index';
import { authMiddleware } from './auth.middleware';

export const recordRoute = express.Router();

recordRoute.post('/', authMiddleware, async(req, res) => {
  const {user_id, date} = req.body;
  try{
    const records = await getRecords(user_id, date);
    res.status(200).json({records:records || []});

  }catch(error){
    console.log(error)
    res.status(500).json({error:'Internal server error'});
  }
})

recordRoute.post('/create',authMiddleware,async(req,res) => {
  const {user_id,amount,title,date} = req.body;
  try{
    const record = await createRecord(user_id,amount,title,date);
    res.status(200).json({record});
  }catch(error){
    console.log(error)
    res.status(500).json({error:'Internal server error'});
  }
})

// 将删除接口改为POST方法
recordRoute.post('/delete', authMiddleware, async(req, res) => {
  const { id, user_id } = req.body;
  
  try {
    if (!id) {
      return res.status(400).json({ error: '记录ID不能为空' });
    }

    const result = await deleteRecord(parseInt(id), user_id);
    
    if (result) {
      res.status(200).json({ 
        success: true, 
        message: '记录删除成功' 
      });
    } else {
      res.status(404).json({ 
        error: '记录不存在或无权删除' 
      });
    }
  } catch(error) {
    console.error('删除记录错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
})