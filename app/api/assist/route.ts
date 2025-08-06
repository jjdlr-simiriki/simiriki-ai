import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  const { userMessage } = await req.json();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: userMessage }],
  });
  return NextResponse.json({ reply: response.choices[0].message.content });
}
