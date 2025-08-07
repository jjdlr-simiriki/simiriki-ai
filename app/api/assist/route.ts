import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'API key missing' }, { status: 500 });
  }
  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { userMessage } = await req.json();
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: userMessage }],
  });
  return NextResponse.json({ reply: response.choices[0].message.content });
}
