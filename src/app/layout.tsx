import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HomeService Admin",
  description: "Platform admin dashboard for HomeService — companies, independents, workers, clients, bookings.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // Browser extensions (password managers, dark-mode/theme extensions,
      // Grammarly, ad blockers) routinely inject attributes into <html>/
      // <body> and form inputs before React hydrates — that's an
      // externally-caused, attribute-only mismatch, not a bug in this tree,
      // and matches Next.js's own documented reason for this prop
      // (https://nextjs.org/docs/messages/react-hydration-error).
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
