"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      router.push("/dashboard");
      return;
    }

    const data = await response.json().catch(() => null);
    setError(data?.message || data?.error || `Account creation failed (${response.status}).`);
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-[#fbfcff] text-[#172033]">
      <aside className="hidden lg:flex flex-col items-center justify-center border-r border-[#e7ebf3] px-12 text-center">
        <div className="max-w-xl"><Brand /><h1 className="mt-10 text-5xl font-bold tracking-tight">Turn plans into progress</h1><p className="mt-6 text-xl leading-relaxed text-[#66758b]">A simple and focused workspace for organizing your tasks, priorities, and goals.</p><div className="mt-11 flex justify-center gap-4"><LinkButton href="/register" primary>Get started</LinkButton><LinkButton href="/login">Sign in</LinkButton></div></div>
      </aside>
      <section className="flex items-center justify-center px-5 py-10 sm:py-16">
        <form onSubmit={submit} className="card w-full max-w-[640px] p-7 sm:p-12">
          <div className="text-center"><Brand /><h1 className="mt-9 text-3xl font-bold">Create your account</h1><p className="mt-3 text-lg text-[#66758b]">Start organizing your tasks today.</p></div>
          <div className="mt-10 space-y-6">
            <Field label="Name"><input className="field" placeholder="Your name" required value={name} onChange={e => setName(e.target.value)} /></Field>
            <Field label="Email"><input className="field" type="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} /></Field>
            <Field label="Password"><input className="field" type="password" minLength={8} placeholder="Create a password" required value={password} onChange={e => setPassword(e.target.value)} /></Field>
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <button className="btn primary mt-8 w-full py-4 text-lg">Create account</button>
          <p className="mt-7 text-center text-[#66758b]">Already have an account? <a className="font-semibold text-[#3730a3] underline" href="/login">Sign in</a></p>
        </form>
      </section>
    </main>
  );
}

function Brand() { return <div className="text-3xl font-bold tracking-tight">Task<span className="text-[#5146e5]">Flow</span></div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block font-semibold">{label}</span>{children}</label>; }
function LinkButton({ href, primary, children }: { href: string; primary?: boolean; children: React.ReactNode }) { return <a href={href} className={`btn w-52 py-4 text-lg text-center ${primary ? "primary" : "border shadow-sm"}`}>{children}</a>; }
