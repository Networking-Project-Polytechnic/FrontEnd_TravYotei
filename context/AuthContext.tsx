// app/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UUID } from 'crypto';

type UserRole = 'CLIENT' | 'AGENCY' | 'ADMIN';

interface User {
  id: UUID;
  firstName: string;
  lastName: string
  email: string;
  userName: string;
  role: UserRole;
  phoneNumber?: string;
  profileImageUrl?: string;
  address?: string;
  licenseNumber?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userName: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check for saved session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Protect routes based on authentication
  useEffect(() => {
    if (!loading) {
      const publicRoutes = ['/client-join', '/agency-join', '/', '/agencies', '/agencies/1', '/services', '/contact', '/Dashboard/00000000-0000-0000-0000-000000000000'];
      const isPublicRoute = publicRoutes.includes(pathname) ||
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/');

      if (!user && !isPublicRoute) {
        router.push('/client-join');
      } else if (user && (pathname === '/client-join' || pathname === '/signup')) {
        // Redirect to appropriate dashboard based on role
        redirectToDashboard(user.role);
      }
    }
  }, [user, loading, pathname, router]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Validate token with backend
        const response = await fetch('/api/auth/validate', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }
      } else {
        // Check for stored user data
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const redirectToDashboard = (role: UserRole) => {
    switch (role) {
      case 'CLIENT':
        router.push('/userDashboard');
        break;
      case 'AGENCY':
        router.push('/agency-dashboard');
        break;
      case 'ADMIN':
        router.push('/admin-dashboard');
        break;
      default:
        router.push('/dashboard');
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // Store token and user data
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));

      setUser(data.user);

      // Redirect based on role
      redirectToDashboard(data.user.role);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();

      // Store token and user data
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));

      setUser(data.user);

      // Redirect based on role
      redirectToDashboard(data.user.role);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    router.push('/login');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}