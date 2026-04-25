import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tapcrush – Your AI Crush, One Tap Away",
  description:
    "Discover your perfect AI companion. Sexy, smart, and always available.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geist.variable} font-sans bg-zinc-950 text-zinc-100 antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
