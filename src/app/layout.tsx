import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "800"],
});

export const metadata: Metadata = {
  title: "Rbx Latam Store: Robux e ítems de Roblox",
  description: "Robux, armas MM2, Limiteds e ítems in-game al mejor precio de LATAM, con +140.000 pedidos entregados.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${dmSans.variable} ${sora.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#050914] text-[#E6EAF2]">
        {children}
      </body>
    </html>
  );
}