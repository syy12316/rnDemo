"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.recordTable = (0, pg_core_1.pgTable)("records", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id", { length: 255 }).notNull(),
    amount: (0, pg_core_1.integer)("amount").notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    date: (0, pg_core_1.timestamp)("date").notNull(),
    createAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
//# sourceMappingURL=schema.js.map