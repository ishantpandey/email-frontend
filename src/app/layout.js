"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import "primereact/resources/themes/lara-light-cyan/theme.css";

import ReduxProvider from "../providers/ReduxProvider";
import GoogleAuthProvider from "../providers/GoogleAuthProvider";
import { PrimeReactProvider } from "primereact/api";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#f97316" />
        <title>Email App</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PrimeReactProvider value={{ ripple: true, locale: "en" }}>
          <GoogleAuthProvider>
            <ReduxProvider>
              <main>
                {children}
              </main>
            </ReduxProvider>
          </GoogleAuthProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
