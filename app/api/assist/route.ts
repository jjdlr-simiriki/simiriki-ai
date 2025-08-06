-import { NextRequest, NextResponse } from 'next/server';
-import OpenAI from 'openai';
-
-const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
+import { NextRequest, NextResponse } from 'next/server';
+import OpenAI from 'openai';

 export async function POST(req: NextRequest) {
-  const { userMessage } = await req.json();
-  const response = await openai.chat.completions.create({
-    model: 'gpt-4o',
-    messages: [{ role: 'user', content: userMessage }]
-  });
-  return NextResponse.json({ reply: response.choices[0].message.content });
+  // Guard against missing key during static export
+  if (!process.env.OPENAI_API_KEY) {
+    return NextResponse.json(
+      { error: "OPENAI_API_KEY not set" },
+      { status: 500 }
+    );
+  }
+
+  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
+  const { userMessage } = await req.json();
+  const response = await openai.chat.completions.create({
+    model: 'gpt-4o',
+    messages: [{ role: 'user', content: userMessage }]
+  });
+  return NextResponse.json({
+    reply: response.choices[0].message.content
+  });
 }

