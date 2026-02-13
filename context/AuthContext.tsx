// app/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import * as api from '@/lib/api';

type UserRole = 'CLIENT' | 'AGENCY' | 'ADMIN' | 'ROLE_CLIENT' | 'ROLE_AGENCY' | 'ROLE_ADMIN';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  role: UserRole;
  phoneNumber?: string;
  profileImageUrl?: string;
  address?: string;
  licenseNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  pricingPlan?: string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userName: string, password: string, isAdmin?: boolean) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  signupAdmin: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshProfile: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isLoggingOut = useRef(false);

  // Refresh profile data from backend
  const refreshProfile = async (): Promise<User> => {
    try {
      console.log('🔄 Refreshing user profile...');
      const userProfile = await api.fetchUserProfile();
      console.log('✅ Profile refreshed:', userProfile);

      setUser(userProfile);
      localStorage.setItem('user_data', JSON.stringify(userProfile));
      return userProfile;
    } catch (error: any) {
      console.error('❌ Failed to refresh profile:', error);

      // Check specific error types
      if (error.message === 'SESSION_EXPIRED' || error.message === 'USER_NOT_FOUND') {
        // Clear storage on session expiry or user not found
        clearStorage();
        setUser(null);
        throw error;
      }

      // For other errors, throw but keep current user
      throw error;
    }
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Route protection
  useEffect(() => {
    if (!loading) {
      const publicRoutes = ['/client-join', '/pricing', '/agency-join', '/admin-join', '/', '/agencies', '/agencies/00000000-0000-0000-0000-000000000000', '/services', '/contact', '/Dashboard/00000000-0000-0000-0000-000123456789', '/search'];

      const isPublicRoute = publicRoutes.includes(pathname) ||
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/agencies');

      // If we have successfully navigated to a public route, we can lower the logout flag
      if (isPublicRoute && isLoggingOut.current) {
        console.log('🔓 [AuthContext] Landed on public route, resetting logout flag');
        isLoggingOut.current = false;
      }

      console.log('🛡️ [AuthContext] Protection Check:', {
        pathname,
        user: user ? { userName: user.userName, role: user.role } : 'NULL',
        loading,
        isPublicRoute
      });

      // Check for a flag to suppress automatic redirection (e.g., during onboarding)
      const skipRedirect = typeof window !== 'undefined' && sessionStorage.getItem('skip_auth_redirect') === 'true';

      if (!user && !isPublicRoute && !isLoggingOut.current) {
        const returnUrl = encodeURIComponent(pathname);
        console.log('🔒 [AuthContext] Access Denied: Redirecting to login. Return URL:', returnUrl);

        // Determine correct login/signup page based on the route they were trying to access
        const lowerPath = pathname.toLowerCase();
        if (lowerPath.startsWith('/dashboard') || lowerPath.startsWith('/agency')) {
          router.push(`/agency-join?returnUrl=${returnUrl}&mode=signup`);
        } else if (lowerPath.startsWith('/admin')) {
          router.push(`/admin-join?returnUrl=${returnUrl}&mode=signup`);
        } else {
          router.push(`/client-join?returnUrl=${returnUrl}&mode=signup`);
        }
      } else if (user && !skipRedirect && (pathname === '/client-join' || pathname === '/agency-join' || pathname === '/admin-join' || pathname === '/login')) {
        console.log('✅ [AuthContext] Already Authenticated: Redirecting to dashboard...');
        redirectToDashboard(user.role);
      }
    }
  }, [user, loading, pathname, router]);

  const checkAuth = async () => {
    try {
      console.log('🔐 [AuthContext] checkAuth: Started');
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user_data');

      if (!token) {
        console.log('❌ [AuthContext] checkAuth: No token found in localStorage');
        setUser(null);
        setLoading(false);
        return;
      }

      console.log('🔑 [AuthContext] checkAuth: Token found, fetching profile...');
      try {
        const userProfile = await api.fetchUserProfile();
        console.log('✅ [AuthContext] checkAuth: Profile fetch SUCCESS:', userProfile);

        if (!userProfile.role) {
          console.warn('⚠️ [AuthContext] checkAuth: Profile missing "role" property. Searching localStorage...');
          const storedRole = localStorage.getItem('user_role');
          if (storedRole) {
            userProfile.role = storedRole as UserRole;
            console.log('📦 [AuthContext] checkAuth: Role recovered from localStorage:', userProfile.role);
          }
        }

        setUser(userProfile);
        localStorage.setItem('user_data', JSON.stringify(userProfile));
      } catch (error: any) {
        console.error('❌ [AuthContext] checkAuth: Profile fetch FAILED:', error.message);

        if (error.message === 'SESSION_EXPIRED' || error.response?.status === 401) {
          console.log('🔓 [AuthContext] checkAuth: Session expired, clearing storage');
          clearStorage();
          setUser(null);
        } else if (error.message === 'USER_NOT_FOUND') {
          console.log('🔍 [AuthContext] checkAuth: User not found, clearing storage');
          clearStorage();
          setUser(null);
        } else if (storedUser) {
          console.log('📦 [AuthContext] checkAuth: Using fallback data from localStorage');
          const parsedUser = JSON.parse(storedUser);
          console.log('📦 [AuthContext] checkAuth: Fallback user contents:', parsedUser);
          setUser(parsedUser);
        } else {
          console.log('🚫 [AuthContext] checkAuth: No fallback data available');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('❌ [AuthContext] checkAuth: Critical failure:', error);
      setUser(null);
    } finally {
      console.log('🏁 [AuthContext] checkAuth: Finished (loading=false)');
      setLoading(false);
    }
  };

  const clearStorage = () => {
    console.log('🗑️ Clearing auth storage');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
  };

  const redirectToDashboard = (role: UserRole | string) => {
    // Check for a flag to suppress automatic redirection (e.g., during onboarding)
    const skipRedirect = typeof window !== 'undefined' && sessionStorage.getItem('skip_auth_redirect') === 'true';
    if (skipRedirect) {
      console.log('⏸️ [AuthContext] Redirection suppressed by skip_auth_redirect flag for role:', role);
      return;
    }

    console.log('🚀 Redirecting to dashboard for role:', role);
    const normalizedRole = role?.toUpperCase();

    // Check for returnUrl in query params
    if (typeof window !== 'undefined') {
      const searchParams = new URL(window.location.href).searchParams;
      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl) {
        console.log('🔄 Redirecting to returnUrl:', returnUrl);
        router.push(decodeURIComponent(returnUrl));
        return;
      }
    }

    switch (normalizedRole) {
      case 'CLIENT':
      case 'ROLE_CLIENT':
        router.push('/userDashboard');
        break;
      case 'AGENCY':
      case 'ROLE_AGENCY':
        // Check agency status
        if (user?.status === 'PENDING') {
          router.push('/agency/pending');
          return;
        } else if (user?.status === 'REJECTED') {
          router.push('/agency/rejected');
          return;
        }

        // Try to redirect to specific agency dashboard if we have the ID
        if (typeof user === 'object' && user?.id) {
          router.push(`/Dashboard/${user.id}`);
        } else {
          // Fallback if user object isn't fully loaded yet (though it should be)
          // or if we just have the role string
          const storedUser = localStorage.getItem('user_data');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              if (parsedUser.status === 'PENDING') {
                router.push('/agency/pending');
                return;
              }
              if (parsedUser.status === 'REJECTED') {
                router.push('/agency/rejected');
                return;
              }
              if (parsedUser.id) {
                router.push(`/Dashboard/${parsedUser.id}`);
                return;
              }
            } catch (e) {
              console.error('Error parsing stored user for redirect', e);
            }
          }
          router.push('/Dashboard');
        }
        break;
      case 'ADMIN':
      case 'ROLE_ADMIN':
        console.log('👉 Redirecting to Admin Dashboard');
        router.push('/adminDashboard');
        break;
      default:
        console.warn('⚠️ Unknown role in redirectToDashboard:', role, 'Normalized:', normalizedRole);
        // If it's an agency but role string is weird, try to rescue it
        if (role?.toLowerCase().includes('agency')) {
          console.log('Rescuing agency redirect based on string inclusion');
          if (user?.id) router.push(`/Dashboard/${user.id}`);
          else router.push('/Dashboard');
        } else {
          console.warn('Going home');
          router.push('/');
        }
    }
  };

  const login = async (userName: string, password: string, isAdmin?: boolean) => {
    isLoggingOut.current = false;
    setLoading(true);
    console.log('🔑 Attempting login for user:', userName, 'isAdmin:', isAdmin);

    try {
      // 1. Login and get JWT token
      let loginData;
      if (isAdmin) {
        loginData = await api.login_admin(userName, password);
      } else {
        loginData = await api.login(userName, password);
      }
      console.log('✅ Login successful, token received');

      // 2. Fetch profile with the new token
      try {
        let userProfile;
        if (isAdmin) {
          const adminProfile: any = await api.fetchAdminProfile();
          // Map admin profile
          userProfile = {
            id: adminProfile.id || 'admin',
            firstName: userName,
            lastName: '',
            email: adminProfile.email || '',
            userName: userName,
            role: 'ADMIN',
          };
        } else {
          userProfile = await api.fetchUserProfile();
        }

        console.log('✅ Profile fetched after login:', userProfile);

        localStorage.setItem('user_data', JSON.stringify(userProfile));
        setUser(userProfile as User);

        // 3. Redirect to dashboard
        redirectToDashboard(loginData.role || (isAdmin ? 'ADMIN' : 'USER'));
      } catch (profileError: any) {
        console.error('❌ Profile fetch failed after login:', profileError);

        if (profileError.message === 'USER_NOT_FOUND') {
          // User exists in token but not in DB - this shouldn't happen
          console.error('User in token not found in database');
          clearStorage();
          throw new Error('Account data corrupted. Please contact support.');
        } else {
          // Other error
          throw profileError;
        }
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setLoading(true);
    console.log('📝 Attempting signup for:', userData.userName);

    try {
      const isAgency = userData.licenseNumber !== undefined;
      let signupData;

      // 1. Register
      if (isAgency) {
        signupData = await api.signup_agency(userData);
        console.log('✅ Agency registration successful, response:', signupData);
      } else {
        signupData = await api.signup_client(userData);
        console.log('✅ Client registration successful, response:', signupData);
      }

      // 2. Auto-login if registration didn't return a token
      // This is necessary because some registration endpoints only return a success message
      const hasToken = signupData && typeof signupData === 'object' && signupData.token;

      if (!hasToken) {
        console.log('🔄 No token in registration response (type:', typeof signupData, '), performing auto-login...');
        try {
          const loginData = await api.login(userData.userName, userData.password);
          console.log('✅ Auto-login after signup successful');
          // Merge login data into signupData so role and token are available for the rest of the flow
          signupData = { ...(typeof signupData === 'object' ? signupData : { message: signupData }), ...loginData };
        } catch (loginError) {
          console.error('❌ Auto-login after signup failed:', loginError);
          throw loginError;
        }
      }

      // 2. Fetch actual profile from backend (now includes ID and all data)
      try {
        const userProfile = await api.fetchUserProfile();
        console.log('✅ Profile fetched after signup:', userProfile);

        localStorage.setItem('user_data', JSON.stringify(userProfile));
        setUser(userProfile);
      } catch (profileError: any) {
        console.error('❌ Profile fetch failed after signup:', profileError);

        // Create user object from form data as fallback
        const initialUser: User = {
          id: '', // Will be empty until profile is fetched
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          userName: userData.userName,
          role: signupData.role,
          phoneNumber: userData.phoneNumber?.toString(),
          address: userData.address,
          licenseNumber: userData.licenseNumber
        };

        localStorage.setItem('user_data', JSON.stringify(initialUser));
        setUser(initialUser);
        console.log('📦 Using form data as fallback');
      }

      // 3. Redirect to dashboard
      redirectToDashboard(signupData.role);
    } catch (error) {
      console.error('❌ Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signupAdmin = async (userData: { name: string; email: string; password: string }) => {
    setLoading(true);
    console.log('📝 Attempting Admin signup for:', userData.name);

    try {
      // 1. Register (Admin)
      await api.signup_admin(userData);
      console.log('✅ Admin registration successful');

      // 2. Login (Admin) to get token
      const loginData = await api.login_admin(userData.name, userData.password);
      console.log('✅ Admin login successful, token received');

      // 3. Fetch Profile (Admin)
      try {
        const userProfile: any = await api.fetchAdminProfile(); // Use any as structure might differ
        // Map admin profile to User interface if needed
        const mappedUser: User = {
          id: userProfile.id || 'admin',
          firstName: userData.name, // Mapping 'name' to firstName for context
          lastName: '',
          email: userData.email,
          userName: userData.name,
          role: 'ADMIN',
          // Add other fields as optional/undefined
        };

        console.log('✅ Admin Profile fetched:', mappedUser);
        localStorage.setItem('user_data', JSON.stringify(mappedUser));
        setUser(mappedUser);

        // 4. Redirect
        redirectToDashboard('ADMIN');

      } catch (profileError: any) {
        console.error('❌ Admin profile fetch failed:', profileError);
        throw profileError;
      }

    } catch (error) {
      console.error('❌ Admin Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log('👋 Logging out...');
    isLoggingOut.current = true;

    // Prevent route protection from triggering user undefined redirect while we navigate
    setLoading(true);

    // No backend logout endpoint available, so we just clear frontend storage
    clearStorage();
    setUser(null);

    // Redirect to home page as requested
    router.push('/');

    // Short timeout to ensure navigation starts before we re-enable checks
    setTimeout(() => {
      setLoading(false);
      // Do NOT reset isLoggingOut here. It will be reset when we hit a public route.
      console.log('✅ Logout complete');
    }, 2000);
  };

  const updateUser = (userData: Partial<User>) => {
    console.log('✏️ Updating user data:', userData);
    setUser((prevUser) => {
      if (!prevUser) {
        console.warn('⚠️ Cannot update - no current user');
        return null;
      }
      const updatedUser = { ...prevUser, ...userData };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      console.log('✅ User updated');
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      signupAdmin,
      logout,
      updateUser,
      refreshProfile
    }}>
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