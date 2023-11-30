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

export const getComments = async (
  movie_id: string,
  commentLimit: number,
  lastDoc?: DocumentData
) => {
  const commentsRef = collection(database, "comments");
  let q = query(
    commentsRef,
    where("movie_id", "==", movie_id),
    limit(commentLimit),
    orderBy("created_date", "desc")
  );

//   if (lastDoc) {
//     q = query(q, startAfter(lastDoc));
//   }

  try {
    const commentsSnapshot = await getDocs(q);
    if (!commentsSnapshot.empty) {
      const result: Comment[] = [];
      commentsSnapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() } as Comment);
      });
      return {
        result,
        lastDoc: commentsSnapshot.docs[commentsSnapshot.docs.length - 1],
      };
    } else {
      return { result: [], lastDoc: lastDoc };
    }
  } catch (error) {
    toast.error(`${error}`);
    console.log(error);
  }
};
