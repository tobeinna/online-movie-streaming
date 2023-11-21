import React, {
  createContext,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import { signOut } from "firebase/auth";

import { AuthType } from "../types/auth.types";
import { auth } from "../configs/firebaseConfig";

type AuthContextType = {
  authState: AuthType | null;
  logOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(
  null as unknown as AuthContextType
);

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [authState, setAuthState] = useState<AuthType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logOut = () => {
    setAuthState(null);
    return signOut(auth);
  };

  const setCredentialUserForApp = useCallback((user: AuthType | null): void => {
    setAuthState(user);
    setIsLoading(false);
  }, []);

  useLayoutEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCredentialUserForApp(
        user
          ? {
              id: user.uid as string,
              email: user.email as string,
              displayName: user.displayName as string,
              photoUrl: user.photoURL as string,
              role: "user",
            }
          : null
      );
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return null;
  } else {
    return (
      <AuthContext.Provider value={{ authState, logOut }}>
        {children}
      </AuthContext.Provider>
    );
  }
};
