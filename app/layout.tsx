import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "../components/NavbarWrapper";
// import { AuthProvider } from "@/context/AuthContext";


// Pages where navbar should be hidden


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travyotei - Your Travel Companion",
  description: "Digital platform connecting travelers with top travel agencies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavbarWrapper />
        {children}
        {/* <AuthProvider>
          <NavbarWrapper />
          {children}
        </AuthProvider> */}
        
      </body>
    </html>
  );
}
