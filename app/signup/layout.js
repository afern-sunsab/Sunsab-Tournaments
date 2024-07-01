'use client';

import { Inter } from "next/font/google";
import {AuthContextProvider} from "../_utils/auth_context";

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
