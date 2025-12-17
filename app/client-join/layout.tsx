import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import SignupForm from '../../components/SignupForm';
import Navbar from '../_components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TravYotei - Sign In & Sign Up Form',
  description: 'Booking a trip has never been this easy',
};

export default function ClientJoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full">
        
        {children}
      </div>
    </div>
  );
}