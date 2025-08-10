// app/layout.tsx
import { ReactNode } from "react";
import './globals.css';

export const metadata = {
  title: "Simiriki - Automatiza, Escala, Transforma",
  description: "Transforma tu negocio con soluciones de automatización inteligente. Simiriki te ayuda a automatizar procesos, escalar operaciones y transformar tu empresa.",
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
        {/* Import global styles from public folder */}
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body style={{ fontFamily: "Roboto, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
