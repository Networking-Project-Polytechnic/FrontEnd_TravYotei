'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

// Routes where navbar should be hidden
const hideNavbarRoutes = [
  '/client-join', 
  '/agency-join'
];

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Check if current route should hide navbar
  const shouldHideNavbar = hideNavbarRoutes.some(route => 
    pathname?.startsWith(route)
  );
  
  if (shouldHideNavbar) {
    return null;
  }
  
  return <Navbar />;
}