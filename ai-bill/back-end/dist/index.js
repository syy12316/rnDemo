"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const chatRoute_1 = require("./src/chatRoute");
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
//解决跨域问题
app.use(cors());
//解析请求体为json格式
app.use(express.json());
app.use('/chat', chatRoute_1.chatRoutes);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map