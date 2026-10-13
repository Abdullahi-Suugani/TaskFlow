import { Db, MongoClient, ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/taskflow";
const dbName = process.env.MONGODB_DB || "taskflow";
const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient; mongoDb?: Db };
export const mongoClient = globalForMongo.mongoClient ?? new MongoClient(uri);
export const mongoDb = globalForMongo.mongoDb ?? mongoClient.db(dbName);
if (process.env.NODE_ENV !== "production") { globalForMongo.mongoClient = mongoClient; globalForMongo.mongoDb = mongoDb; }
export type TaskDocument = { _id: ObjectId; title: string; description?: string | null; status: "TODO" | "IN_PROGRESS" | "COMPLETED"; priority: "LOW" | "MEDIUM" | "HIGH"; dueDate?: Date | null; userId: string; createdAt: Date; updatedAt: Date; };
export const tasks = mongoDb.collection<TaskDocument>("tasks");
export function taskResponse(task: TaskDocument) { const { _id, ...rest } = task; return { ...rest, id: _id.toHexString() }; }
export async function ensureMongoIndexes() { await tasks.createIndex({ userId: 1, status: 1 }); await tasks.createIndex({ userId: 1, priority: 1 }); await tasks.createIndex({ userId: 1, dueDate: 1 }); await tasks.createIndex({ userId: 1, createdAt: -1 }); }
