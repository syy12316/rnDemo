import cors = require('cors');
import express = require('express');
const app = express();
const port = process.env.PORT || 8000;
//解决跨域问题
app.use(cors());
//解析请求体为json格式
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
