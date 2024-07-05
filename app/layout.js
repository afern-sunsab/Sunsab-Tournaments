import { AuthContextProvider } from "@utils/auth-context";
import { Inter } from "next/font/google";
import "./globals.css";
import SideBar from "./navbar/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <AuthContextProvider>
      <html lang="en">
        <body className={inter.className} style={{ display: 'flex' }}>
          <SideBar />
          <main style={{ flexGrow: 1,}}>
            {children}
          </main>
        </body>
      </html>
    </AuthContextProvider>
  );
}
