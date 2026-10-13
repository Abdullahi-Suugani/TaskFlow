import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { mongoClient, mongoDb } from "./db";
export const auth = betterAuth({ database: mongodbAdapter(mongoDb, { client: mongoClient, transaction: false }), baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000", secret: process.env.BETTER_AUTH_SECRET, emailAndPassword: { enabled: true }, socialProviders: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } } : undefined, trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"] });
