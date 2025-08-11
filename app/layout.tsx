/* eslint-disable @next/next/no-page-custom-font */
// app/layout.tsx
import { ReactNode } from "react";
import ChatWidget from "./components/ChatWidget";

export const metadata = {
  title: "Simiriki",
  description: "Automatiza. Escala. Transforma.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Load Google Fonts via <link> instead of next/font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "Roboto, sans-serif" }}>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
