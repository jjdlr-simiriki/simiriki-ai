// Basic PDF generation implemented. Template injection & design pending.


import { NextRequest } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
  const data = await req.json();

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new'
  });
  const page = await browser.newPage();

  const html = `<html><body><h1>${data.title || 'Guía de Automatización'}</h1></body></html>`;
  await page.setContent(html);

  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();

  // Convert Buffer to Uint8Array for Response body
  const pdfArray = new Uint8Array(pdfBuffer);

  return new Response(pdfArray, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=simiriki-guide.pdf',
  },
});
}

