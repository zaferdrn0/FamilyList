import { fetchBackendGET, fetchBackendPOST } from '@/utils/backendFetch';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface User {
  userId: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetchBackendGET('/check-auth');
        const data = await response.json();
        if (data.isLoggedIn) {
          setCurrentUser({ userId: data.userId });
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Auth check failed', error);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const loginData = {
        username:username,
        password:password
    }
    const response = await fetchBackendPOST('/user-login',loginData)
    const data = await response.json();
    if (data.session) {
      setCurrentUser({ userId: data.session.userId });
    }
  };

  const logout = async () => {
   const response = await fetchBackendGET('/logout');
   if(response.ok){
    setCurrentUser(null);
   }
   else{
    console.error("Logout fail")
   }
  };

  const value = { currentUser, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
