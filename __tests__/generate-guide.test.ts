/** @jest-environment node */

import { NextRequest } from 'next/server';
import puppeteer from 'puppeteer';
import { POST } from '../app/api/generate-guide/route';

jest.mock('puppeteer', () => ({
  launch: jest.fn(),
}));

describe('POST /api/generate-guide', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns a PDF', async () => {
    const pdfBuffer = Buffer.from('pdf');
    (puppeteer.launch as jest.Mock).mockResolvedValue({
      newPage: async () => ({
        setContent: async () => {},
        pdf: async () => pdfBuffer,
      }),
      close: async () => {},
    });

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test' }),
    });

    const res = await POST(req);
    expect(res.headers.get('Content-Type')).toBe('application/pdf');
    const arrayBuffer = await res.arrayBuffer();
    expect(Buffer.from(arrayBuffer)).toEqual(pdfBuffer);
  });

  it('throws if puppeteer launch fails', async () => {
    (puppeteer.launch as jest.Mock).mockRejectedValue(new Error('fail'));
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    await expect(POST(req)).rejects.toThrow('fail');
  });
});
