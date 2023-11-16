import React, { createContext, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { User, signOut } from "firebase/auth";

import { AuthType } from "../types/auth.types";
import { auth, database } from "../configs/firebaseConfig";

type AuthContextType = {
  authState: AuthType | undefined;
  logOut: () => Promise<void>;
  // setAuthState: React.Dispatch<React.SetStateAction<AuthType | undefined>>;
};

export const AuthContext = createContext<AuthContextType>(
  null as unknown as AuthContextType
);

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [authState, setAuthState] = useState<AuthType | undefined>(undefined);

  const logOut = () => {
    setAuthState(undefined);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      // This function is called whenever the authentication state changes
      if (user) {
        getCurrentUser(user.uid);
      }
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, []);

  const getCurrentUser = async (uid: string) => {
    const userDocRef = doc(database, `users/${uid}`);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const currentAuth = {
        displayName: String(userSnapshot.data()?.displayName),
        photoUrl: String(userSnapshot.data()?.photoURL),
        role: String(userSnapshot.data()?.role),
      };

      console.log(currentAuth);

      setAuthState(currentAuth);
    }
  };

  return (
    // <AuthContext.Provider value={{ authState, logOut, setAuthState }}>
    <AuthContext.Provider value={{ authState, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
