import React, { createContext, useState, useCallback, useEffect } from "react";
import { User, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { AuthType } from "../types/auth.types";
import { auth, database } from "../configs/firebaseConfig";
import Spinner from "../components/Spinner/Spinner";

type AuthContextType = {
  authState: AuthType | null | undefined;
  logOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(
  null as unknown as AuthContextType
);

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [authState, setAuthState] = useState<AuthType | null | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const logOut = () => {
    setAuthState(undefined);
    return signOut(auth);
  };

  const setCredentialUserForApp = useCallback((user: AuthType | null): void => {
    setAuthState(user);
    setIsLoading(false);
  }, []);

  const setUserData = async (user: User | null) => {
    if (!user) return;

    try {
      const userRef = doc(database, `users/${user.uid}`);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        if (userSnapshot.data().status === false) {
          setIsLoading(false);
        } else {
          setCredentialUserForApp({
            id: user.uid as string,
            email: user.email as string,
            displayName: userSnapshot.data().displayName as string,
            photoUrl: user.photoURL as string,
            role: userSnapshot.data().role as string,
            status: userSnapshot.data().status as boolean,
          });
        }
      } else {
        setCredentialUserForApp({
          id: user.uid as string,
          email: user.email as string,
          displayName: user.displayName as string,
          photoUrl: user.photoURL as string,
          role: "user",
          status: true,
        });
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserData(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Spinner className="w-10 h-10" />
      </span>
    );
  } else {
    return (
      <AuthContext.Provider value={{ authState, logOut }}>
        {children}
      </AuthContext.Provider>
    );
  }
};
