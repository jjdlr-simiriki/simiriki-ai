import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.goto('https://simiriki.com');
  const title = await page.title();
  await browser.close();
  return NextResponse.json({ title });
}
