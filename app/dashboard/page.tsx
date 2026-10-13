import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "../../lib/auth";
import { tasks, taskResponse } from "../../lib/db";
import LogoutButton from "./LogoutButton";
import TaskManager from "./TaskManager";

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  if (!user) redirect("/login");
  const taskList = await tasks.find({ userId: user.id }).sort({ createdAt: -1 }).toArray();
  const initialTasks = taskList.map(task => { const item = taskResponse(task); return { ...item, dueDate: item.dueDate?.toISOString() || null, createdAt: item.createdAt.toISOString() }; });
  return <main className="min-h-screen max-w-6xl mx-auto p-6"><header className="flex justify-between items-center"><div><p className="text-indigo-600 font-bold">TASKFLOW</p><h1 className="text-3xl font-bold mt-2">Good to see you, {user.name || user.email}</h1></div><LogoutButton /></header><TaskManager initialTasks={initialTasks} /></main>;
}
