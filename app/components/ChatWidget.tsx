'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error('Request failed');

      const data = await res.json();
      const assistantMessage: ChatMessage = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Lo siento, ocurrió un error.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-lg flex flex-col z-50">
      <div className="p-2 border-b font-semibold bg-gray-100">Simiriki AI</div>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-2 space-y-2 text-sm max-h-96"
      >
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span
              className={
                m.role === 'user'
                  ? 'inline-block bg-blue-500 text-white px-2 py-1 rounded'
                  : 'inline-block bg-gray-200 text-gray-900 px-2 py-1 rounded'
              }
            >
              {m.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-gray-400">...</div>}
      </div>
      <div className="p-2 border-t flex">
        <input
          className="flex-1 border rounded px-2 py-1 text-sm"
          placeholder="Escribe tu mensaje…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="ml-2 bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
