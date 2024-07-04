'use client';

import { Inter } from "next/font/google";
import {AuthContextProvider} from "../../_utils/auth-context.js";
import Navbar from "@components/navbar.jsx";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children }) {
  return (
    <AuthContextProvider>
      <html lang="en">
        <body className={inter.className}>
        <Navbar />
        {children}</body>
      </html>
    </AuthContextProvider>
  );
}
