import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 });
    }

    const assistantId = 'asst_BLh6iZegnIO0L7rXl91gk4j';
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    // 1. Create a thread
    const threadRes = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({ assistant_id: assistantId }),
    });

    if (!threadRes.ok) {
      const err = await threadRes.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const thread = await threadRes.json();
    const threadId = thread.id;

    // 2. Add user message
    await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({ role: 'user', content: message }),
    });

    // 3. Run assistant
    const runRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({ assistant_id: assistantId, model: 'gpt-4o' }),
    });

    if (!runRes.ok) {
      const err = await runRes.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const run = await runRes.json();
    const runId = run.id;

    // 4. Poll for completion
    let status = run.status;
    while (status === 'queued' || status === 'in_progress') {
      await new Promise((res) => setTimeout(res, 1500));
      const runStatusRes = await fetch(
        `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v2',
          },
        }
      );
      const runStatus = await runStatusRes.json();
      status = runStatus.status;
    }

    if (status !== 'completed') {
      return NextResponse.json({ error: 'Run failed' }, { status: 500 });
    }

    // 5. Retrieve messages
    const messagesRes = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      }
    );

    const messagesData = await messagesRes.json();
    const assistantReply = messagesData.data
      .filter((m: any) => m.role === 'assistant')
      .pop()?.content?.[0]?.text ?? '';

    return NextResponse.json({ reply: assistantReply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 });
  }
}
