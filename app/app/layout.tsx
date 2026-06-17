import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Man vs Machine | MedHub.AI",
  description: "CVIT 2026 — Beat the AI on FFR prediction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
