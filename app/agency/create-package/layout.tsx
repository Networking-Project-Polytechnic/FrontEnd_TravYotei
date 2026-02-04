import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import '@/app/_fix/global.css';


// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TravYotei - Package Registration Form',
  description: 'Registering packages has never been this easy',
};

export default function AgencyPackageCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`font-sans flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50`}>
      <div className="w-full">

        {children}
      </div>
    </div>
  );
}