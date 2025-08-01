'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Simiriki
        </Link>
        <nav className="space-x-4">
          <Link href="/" className="text-gray-700 hover:text-gray-900">Home</Link>
          <Link href="/faq" className="text-gray-700 hover:text-gray-900">FAQ</Link>
          <Link href="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
