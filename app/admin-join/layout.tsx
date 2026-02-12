
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'TravYotei Admin - Sign In & Sign Up',
    description: 'Administration Portal',
};

export default function AdminJoinLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${inter.className} flex min-h-screen items-center justify-center bg-gray-100`}>
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}
