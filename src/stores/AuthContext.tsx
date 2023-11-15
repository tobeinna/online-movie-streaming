import React, { createContext, useState, useEffect } from 'react';
import { AuthType } from '../types/auth.types';

type AuthContextType = {
  auth: AuthType;
  setAuth: React.Dispatch<React.SetStateAction<AuthType>>;
};

export const AuthContext = createContext<AuthContextType>(
  null as unknown as AuthContextType,
);

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [auth, setAuth] = useState({displayName: "", role: ""});
  const value = {
    auth,
    setAuth,
  };

  useEffect(() => {
    console.log("auth", auth);
  }, [auth])

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};