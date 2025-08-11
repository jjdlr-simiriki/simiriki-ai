/** @jest-environment node */

import { NextRequest } from 'next/server';
import { POST } from '../app/api/assistant/route';

describe('POST /api/assistant', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.OPENAI_API_KEY;
  });

  it('returns 400 if message is missing', async () => {
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: 'Missing message' });
  });

  it('returns 500 if API key is missing', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: 'Missing API key' });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns assistant reply on success', async () => {
    process.env.OPENAI_API_KEY = 'test-key';
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hi' }),
    });

    const originalSetTimeout = global.setTimeout;
    // @ts-ignore override for testing
    global.setTimeout = (fn: any) => {
      fn();
      return 0 as any;
    };

    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'thread1' }),
      } as any)
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'run1', status: 'queued' }),
      } as any)
      .mockResolvedValueOnce({ json: async () => ({ status: 'completed' }) } as any)
      .mockResolvedValueOnce({
        json: async () => ({
          data: [
            { role: 'assistant', content: [{ text: 'Hello there' }] },
          ],
        }),
      } as any);

    const res = await POST(req);
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ reply: 'Hello there' });

    fetchMock.mockRestore();
    global.setTimeout = originalSetTimeout;
  });
});
