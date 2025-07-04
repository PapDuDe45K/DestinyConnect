"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "next-themes"; // your current theme provider
import { ChakraProvider } from "@chakra-ui/react";
 // import Chakra UI

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ChakraProvider>
            <AuthProvider>
              <main className="min-h-screen flex flex-col">{children}</main>
            </AuthProvider>
          </ChakraProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
