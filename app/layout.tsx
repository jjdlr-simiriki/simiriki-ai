// app/layout.tsx
import { ReactNode } from "react";
import { Roboto } from "next/font/google";
// ✅ ES-module import of your font
const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Simiriki",
  description: "Automatiza. Escala. Transforma.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={roboto.className}>
        {children}
      </body>
    </html>
  );
}
