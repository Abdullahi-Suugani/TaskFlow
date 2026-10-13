import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "../../lib/auth";
import { tasks } from "../../lib/db";
export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  if (!user) redirect("/login");
  const taskList = await tasks.find({ userId: user.id }).sort({ createdAt: -1 }).toArray();
  const pending = taskList.filter(t => t.status === "TODO").length;
  const active = taskList.filter(t => t.status === "IN_PROGRESS").length;
  const completed = taskList.filter(t => t.status === "COMPLETED").length;
  return <main className="min-h-screen max-w-6xl mx-auto p-6"><header className="flex justify-between items-center"><div><p className="text-indigo-600 font-bold">TASKFLOW</p><h1 className="text-3xl font-bold mt-2">Good to see you, {user.name || user.email}</h1></div><form action="/api/auth/sign-out" method="post"><button className="btn border">Log out</button></form></header><section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">{[["Total", taskList.length], ["Pending", pending], ["In progress", active], ["Completed", completed]].map(([label, value]) => <div className="card p-5" key={label}><p className="muted">{label}</p><p className="text-3xl font-bold mt-2">{value}</p></div>)}</section><section className="card p-6 mt-8"><h2 className="text-xl font-bold">Your tasks</h2>{taskList.length === 0 ? <p className="muted py-12 text-center">You’re ready to make progress. Create your first task.</p> : <div className="divide-y mt-4">{taskList.map(t => <div className="py-4 flex justify-between" key={t._id.toHexString()}><div><p className="font-semibold">{t.title}</p><p className="muted text-sm">{t.description || "No description"}</p></div><span className="text-sm">{t.status.replace("_", " ")} · {t.priority}</span></div>)}</div>}</section></main>;
}
