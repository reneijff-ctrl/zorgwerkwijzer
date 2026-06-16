'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '@/types/auth';
import { login as apiLogin, register as apiRegister } from '@/lib/api/auth';

const TOKEN_KEY = 'zww_access_token';
const USER_KEY = 'zww_user';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<{ success: true; user: AuthUser | null; data: AuthResponse } | { success: false; error: string }>;
  register: (data: RegisterRequest) => Promise<{ success: true } | { success: false; error: string; fieldErrors?: Record<string, string> }>;
  loginWithResponse: (response: AuthResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Herstel sessie bij mount vanuit localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as AuthUser);
      } else {
        // Verlopen of corrupt — opruimen
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const result = await apiLogin(data);
    if (!result.success) {
      return { success: false as const, error: result.error };
    }
    // Bij 2FA flow: geen accessToken opslaan — wacht op TOTP verificatie
    if (result.data.requiresTwoFactor) {
      return { success: true as const, user: null, data: result.data };
    }
    if (result.data.accessToken) {
      localStorage.setItem(TOKEN_KEY, result.data.accessToken);
      setToken(result.data.accessToken);
    }
    if (result.data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(result.data.user));
      setUser(result.data.user);
    }
    return { success: true as const, user: result.data.user, data: result.data };
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const result = await apiRegister(data);
    if (!result.success) {
      return { success: false as const, error: result.error, fieldErrors: result.fieldErrors };
    }
    if (result.data.accessToken) {
      localStorage.setItem(TOKEN_KEY, result.data.accessToken);
      setToken(result.data.accessToken);
    }
    if (result.data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(result.data.user));
      setUser(result.data.user);
    }
    return { success: true as const };
  }, []);

  const loginWithResponse = useCallback((response: AuthResponse) => {
    if (response.accessToken) {
      localStorage.setItem(TOKEN_KEY, response.accessToken);
      setToken(response.accessToken);
    }
    if (response.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      setUser(response.user);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Verwijder ook de oude localStorage keys van de tijdelijke profiel-flow
    localStorage.removeItem('zww_profile_id');
    localStorage.removeItem('zww_profile_data');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: user !== null && token !== null,
        login,
        register,
        loginWithResponse,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext moet binnen een <AuthProvider> gebruikt worden.');
  }
  return ctx;
}
