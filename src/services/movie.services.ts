import { toast } from "react-toastify";
import {
  DocumentData,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  limit,
  startAfter,
  orderBy,
  getCountFromServer,
} from "firebase/firestore";
import { database } from "../configs/firebaseConfig";
import { Comment } from "../types/movie.types";

export const createComment = async (
  uid: string,
  movie_id: string,
  content: string
) => {
  const commentsRef = collection(database, "comments");

  try {
    await addDoc(commentsRef, {
      uid,
      movie_id,
      content,
      created_date: new Date(),
    });

    toast.success("Comment sent!");
  } catch (error) {
    toast.error(`${error}`);
  }
};

export const getComments = async (movie_id: string, commentLimit: number) => {
  const commentsRef = collection(database, "comments");
  let q = query(
    commentsRef,
    where("movie_id", "==", movie_id),
    limit(commentLimit),
    orderBy("created_date", "desc")
  );

  let countQuery = query(commentsRef, where("movie_id", "==", movie_id));

  try {
    const commentsSnapshot = await getDocs(q);

    const commentsCount = (await getCountFromServer(countQuery)).data().count;
    if (!commentsSnapshot.empty) {
      const result: Comment[] = [];
      commentsSnapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() } as Comment);
      });
      return {
        result,
        commentsCount,
        lastDoc: commentsSnapshot.docs[commentsSnapshot.docs.length - 1],
      };
    } else {
      return { result: [], commentsCount, lastDoc: undefined };
    }
  } catch (error) {
    toast.error(`${error}`);
    console.log(error);
  }
};

export const getNextComments = async (
  movie_id: string,
  commentLimit: number,
  lastDoc?: DocumentData
) => {
  const commentsRef = collection(database, "comments");
  let q = query(
    commentsRef,
    where("movie_id", "==", movie_id),
    orderBy("created_date", "desc"),
    startAfter(lastDoc),
    limit(commentLimit)
  );

  let countQuery = query(commentsRef, where("movie_id", "==", movie_id));

  try {
    const commentsSnapshot = await getDocs(q);

    const commentsCount = (await getCountFromServer(countQuery)).data().count;

    if (!commentsSnapshot.empty) {
      const result: Comment[] = [];
      commentsSnapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() } as Comment);
      });
      return {
        result,
        commentsCount,
        lastDoc: commentsSnapshot.docs[commentsSnapshot.docs.length - 1],
      };
    } else {
      return { result: [], commentsCount, lastDoc: lastDoc };
    }
  } catch (error) {
    toast.error(`${error}`);
    console.log(error);
  }
};
