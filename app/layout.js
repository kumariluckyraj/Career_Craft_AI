import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Placement",
  description: "This website is for placement preparation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <Navbar />
          <div > 
            <br/>
            <br/>
            <br/>
            <br/>
            {children}
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}



