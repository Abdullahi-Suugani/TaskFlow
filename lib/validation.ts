import { z } from "zod";
export const taskSchema = z.object({ title: z.string().trim().min(1).max(120), description: z.string().max(2000).optional().nullable(), status: z.enum(["TODO","IN_PROGRESS","COMPLETED"]).default("TODO"), priority: z.enum(["LOW","MEDIUM","HIGH"]).default("MEDIUM"), dueDate: z.string().optional().nullable() });
export const suggestionSchema = z.object({ suggestions: z.array(z.object({ title:z.string().min(1).max(120), description:z.string().max(1000), priority:z.enum(["LOW","MEDIUM","HIGH"]), dueDate:z.string().nullable().optional() })).max(10) });
