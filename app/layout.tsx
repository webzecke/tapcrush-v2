import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://tapcrush.app"),
  title: {
    default: "Tapcrush – Your AI Crush, One Tap Away",
    template: "%s | Tapcrush",
  },
  description:
    "Discover AI companions that actually listen. Romantic, playful, deep, or bold – one tap away.",
  openGraph: {
    siteName: "Tapcrush",
    type: "website",
  },
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
