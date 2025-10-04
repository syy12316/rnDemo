import postgres from 'postgres';
declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<Record<string, never>> & {
    $client: postgres.Sql<{}>;
};
export default db;
export declare const createRecord: (userId: string, amount: number, title: string, date: Date) => Promise<postgres.RowList<never[]> | undefined>;
export declare const getRecords: (userId: string, date: Date) => Promise<{
    id: number;
    userId: string;
    amount: number;
    title: string;
    date: Date;
    createAt: Date;
}[] | undefined>;
//# sourceMappingURL=index.d.ts.map