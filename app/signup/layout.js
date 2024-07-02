'use client';

import { Inter } from "next/font/google";
import {AuthContextProvider} from "@utils/auth-context.js";
import Navbar from "@components/Navbar";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children }) {
  return (
    <AuthContextProvider>
      <html lang="en">
        <body className={inter.className}>
          <div><Navbar /></div>
          {children}</body>
      </html>
    </AuthContextProvider>
  );
}
