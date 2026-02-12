'use client';

import { usePathname } from 'next/navigation';
import NavBar from './Navbar2';

// Routes where navbar should be hidden
const hideNavbarRoutes = [
  '/client-join',
  '/agency-join',
  '/Dashboard',
  '/agency/create-package',
  '/',
  '/login',
  '/register',
  '/admin-join'
];

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Check if current route should hide navbar
  const shouldHideNavbar = hideNavbarRoutes.some(route =>
    pathname === route || (route !== '/' && pathname?.startsWith(route))
  );

  if (shouldHideNavbar) {
    return null;
  }

  return <NavBar />;
}