import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "../../../../lib/auth";
import { suggestionSchema } from "../../../../lib/validation";
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "AI suggestions are disabled. Add OPENAI_API_KEY to enable them." }, { status: 503 });
  const { goal } = await req.json();
  if (typeof goal !== "string" || goal.trim().length < 5 || goal.length > 500) return NextResponse.json({ error: "Enter a goal between 5 and 500 characters." }, { status: 400 });
  try {
    const result = await new OpenAI().chat.completions.create({ model: "gpt-4o-mini", response_format: { type: "json_object" }, messages: [{ role: "system", content: "Return JSON exactly as {suggestions:[{title,description,priority,dueDate}]} with 3-6 actionable tasks. priority is LOW, MEDIUM, or HIGH; dueDate is null or YYYY-MM-DD." }, { role: "user", content: goal }] });
    const parsed = suggestionSchema.safeParse(JSON.parse(result.choices[0].message.content || "{}"));
    if (!parsed.success) throw new Error("invalid response");
    return NextResponse.json(parsed.data);
  } catch { return NextResponse.json({ error: "The suggestion service is temporarily unavailable." }, { status: 502 }); }
}
