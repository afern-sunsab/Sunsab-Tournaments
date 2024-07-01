'use client';

import { Inter } from "next/font/google";
import {AuthContextProvider} from "@utils/auth-context.js";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children }) {
  return (
    <AuthContextProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </AuthContextProvider>
  );
}
