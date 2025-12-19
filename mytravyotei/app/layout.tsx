import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-[#1b1f3b] text-white flex flex-col m-0 p-0 overflow-x-hidden">
        
        {/* HEADER : gap-32 pour un espacement horizontal massif */}
        <header className="w-full py-4 px-20 flex justify-between items-center bg-[#1b1f3b]/95 backdrop-blur-xl border-b border-white/10 fixed top-0 left-0 right-0 z-50">
          <h1 className="text-3xl font-extrabold neon-text">
            Trav<span className="text-blue-400">Yotei</span>
          </h1>

          <nav className="flex items-center gap-32">
            <Link href="/agencies" className="text-xl hover:text-blue-400 transition font-bold tracking-widest">AGENCIES</Link>
            <Link href="/about" className="text-xl hover:text-blue-400 transition font-bold tracking-widest">ABOUT US</Link>
            <Link href="/login" className="bg-blue-600 px-10 py-3 rounded-full hover:bg-blue-700 transition font-black shadow-lg shadow-blue-500/40">
              LOGIN
            </Link>
          </nav>
        </header>

        <main className="flex-grow flex flex-col bg-gradient-to-br from-[#1b1f3b] via-[#2a2f55] to-[#1b1f3b] bg-fixed">
          {children}
        </main>

        <footer className="w-full py-6 text-center bg-[#1b1f3b] border-t border-white/10">
          <p className="text-gray-400">© 4GI 2025 TravYotei .</p>
        </footer>
      </body>
    </html>
  );
}