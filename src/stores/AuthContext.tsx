import React, {
  createContext,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import { User, signOut } from "firebase/auth";

import { AuthType } from "../types/auth.types";
import { auth, database } from "../configs/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

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

  const setUserData = async (user: User | null) => {
    if (!user) return;
    try {
      const userRef = doc(database, `users/${user.uid}`);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        setCredentialUserForApp(
          user
            ? {
                id: user.uid as string,
                email: user.email as string,
                displayName: user.displayName as string,
                photoUrl: user.photoURL as string,
                role: userSnapshot.data().role as string,
              }
            : null
        );
      }
    } catch (error) {
      toast.error(`Error: ${error}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useLayoutEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserData(user ? user : null);
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
