'use client'

import localFont from "next/font/local";
import {Poppins} from 'next/font/google';
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";
import { Provider } from 'react-redux';
import store from "@/redux/store";
import Head from "next/head";

// import type { Metadata } from "next";

const poppins = Poppins({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <Provider store={store}>
    <html lang="en">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
        <body
          className={poppins.className}
        >
          {children}
          <Toaster />
          <SonnerToaster />
          <Analytics />
        </body>
    </html>
    </Provider>

  );
}
