"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";

// Geist Fonts
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

// Chakra UI Theme Override (optional, here we set system mode)
const theme = extendTheme({
  config: {
    initialColorMode: "system",
    useSystemColorMode: true,
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Inject Chakra UI color mode script for SSR hydration */}
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <ChakraProvider theme={theme}>
          <AuthProvider>
            <main className="min-h-screen flex flex-col">{children}</main>
          </AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
