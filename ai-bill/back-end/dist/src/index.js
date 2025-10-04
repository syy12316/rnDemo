"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecords = exports.createRecord = void 0;
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const dotenv_1 = __importDefault(require("dotenv"));
const schema_1 = require("./db/schema");
const drizzle_orm_1 = require("drizzle-orm");
dotenv_1.default.config();
const client = (0, postgres_1.default)(process.env.DATABASE_URL);
const db = (0, postgres_js_1.drizzle)({ client });
exports.default = db;
//插入数据的api
const createRecord = async (userId, amount, title, date) => {
    const dateObj = new Date(date);
    const amountInCents = amount * 100;
    try {
        const record = await db.insert(schema_1.recordTable).values({
            userId,
            amount: amountInCents,
            title,
            date: dateObj,
        });
        return record;
    }
    catch (error) {
        console.log(error);
        return;
    }
};
exports.createRecord = createRecord;
//查询数据的api
const getRecords = async (userId, date) => {
    const dateObj = new Date(date);
    try {
        const records = await db.select().from(schema_1.recordTable).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.recordTable.userId, userId), (0, drizzle_orm_1.eq)(schema_1.recordTable.date, dateObj)));
        //将amount转换为元
        records.forEach((record) => {
            record.amount = record.amount / 100;
        });
        return records;
    }
    catch (error) {
        console.log(error);
        return;
    }
};
exports.getRecords = getRecords;
//# sourceMappingURL=index.js.map