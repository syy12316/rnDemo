import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core'
export  const recordTable = pgTable("records",{
  id: serial("id").primaryKey(),
  userId: varchar("user_id",{ length: 255 }).notNull(),
  amount: integer("amount").notNull(),
  title: varchar("title",{ length: 255 }).notNull(),
  date: timestamp("date").notNull(),
  createAt: timestamp("created_at").notNull().defaultNow(),
})