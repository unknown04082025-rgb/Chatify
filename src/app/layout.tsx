import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chatify — Secure Real-Time Communication",
  description: "End-to-end encrypted messaging, calls, stories, and more. Your privacy is our priority.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
