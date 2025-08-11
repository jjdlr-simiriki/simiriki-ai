// DONE: Basic PDF generation implemented. Template injection & design pending.


import { NextRequest } from 'next/server';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Load HTML template
  const templatePath = path.join(process.cwd(), 'templates', 'guide-template.html');
  const templateSrc = await fs.readFile(templatePath, 'utf-8');

  // Render template using Handlebars
  const template = Handlebars.compile(templateSrc);
  const html = template(data);

  // Render PDF with Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

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

