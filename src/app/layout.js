import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Digital Life Lessons | Meaningful Life Insights & Wisdom",
  description:
    "A platform where users can create, store, and share meaningful life lessons, personal growth insights, and wisdom gathered over time.",
  icons: {
    icon: [
      { url: "/logo_central.jpg" },
      { url: "/logo_central.jpg", type: "image/jpeg" },
    ],
    shortcut: "/logo_central.jpg",
    apple: "/logo_central.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-amber-50/30 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-amber-200 selection:text-amber-900 transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
                background: "#fff",
                color: "#1c1917",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                fontSize: "14px",
              },
            }}
          />
          <Suspense fallback={<div className="h-20 w-full bg-amber-50/80 dark:bg-zinc-900/80" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
