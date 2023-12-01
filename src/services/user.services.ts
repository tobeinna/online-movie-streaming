import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { database } from "../configs/firebaseConfig";
import { User } from "../types/user.types";

export const getUser = async (uid: string) => {
  try {
    const userRef = doc(database, `users/${uid}`);
    const userSnapshot = await getDoc(userRef);
    return { uid: userSnapshot.id, ...userSnapshot.data() } as User;
  } catch (error) {
    toast.error(`${error}`);
  }
};
