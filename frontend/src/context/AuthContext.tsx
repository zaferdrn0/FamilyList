import { fetchBackendGET, fetchBackendPOST } from '@/utils/backendFetch';
import { Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  currentUser: User | null | "loading";
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface invites {
  createdAt:string;
  groupId:{
    name:string;
    _id:string;
  };
  invitedBy:{
    username:string;
    _id:string;
  };
  status:string;
  updatedAt:string;
  _id:string;
}

interface User {
  _id: string;
  username: string;
  groups: string[];
  invites: invites[];
}

interface AuthProviderProps {
  children: ReactNode;
}

const LoadingScreen = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null | "loading">("loading");

  const isAuthPage = (pathname: string) => {
    const authPages = ['/login', '/register'];

    return authPages.includes(pathname);
  };

  const GetCurrentUser = async ()=>{
    const response = await fetchBackendGET('/user/current');
    if(response.ok){
      const data = await response.json()
      setCurrentUser(data)
    }else{
      setCurrentUser(null)
    }
  }

  const checkAuth = async () => {
    try {
      const response = await fetchBackendGET('/user/check-auth');
      const data = await response.json();
      if (data.isLoggedIn) {
        GetCurrentUser()

        if (isAuthPage(router.pathname)) {
                  router.push('/dashboard');
                } 
      } else {
        await router.push("/login")
      }
    } catch (error) {
      console.error('Auth check failed', error);
    }
  };

  useEffect(() => {
    if(isAuthPage(router.pathname)) {
      setCurrentUser(null)
    }else {
      checkAuth();
    }
  }, []);

  useEffect(()=>{
    if(router.pathname === "/login"){
      setCurrentUser(null)
    }
  }, [router.pathname]);

  const login = async (username: string, password: string) => {
    const loginData = {
        username:username,
        password:password
    }
    const response = await fetchBackendPOST('/user/login',loginData)
    const data = await response.json();
    if (data.session && response.ok) {
      GetCurrentUser()
      router.push("/dashboard")
    }
  };

  const logout = async () => {
   const response = await fetchBackendGET('/user/logout');
   if(response.ok){
    setCurrentUser(null);
   }
   else{
    console.error("Logout fail")
   }
  };

  const value = { currentUser, login, logout };


  if(currentUser === "loading"){
  return  <LoadingScreen/>
 }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
