import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CareerCraft AI",
  description: "This website is a career companion for students, powered by AI.",
  icons: {
    icon: "/logo.png", 
  },
};
//
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <Navbar />
          <div > 
           
            {children}
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}



