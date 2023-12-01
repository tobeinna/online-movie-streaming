import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";

import { Comment } from "../../types/movie.types";
import { getComments, getNextComments } from "../../services/movie.services";
import CommentItem from "../CommentItem/CommentItem";
import { toast } from "react-toastify";
import MainButton from "../Buttons/MainButton/MainButton";
import Spinner from "../Spinner/Spinner";

const CommentList: React.FC<{ movie_id: string; isReload: boolean }> = ({
  movie_id,
  isReload,
}) => {
  const [currentMovieId, setCurrentMovieId] = useState<string>("");
  const [list, setList] = useState<Comment[]>([]);
  const [newComments, setNewComments] = useState<Comment[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData>();
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setCurrentMovieId(movie_id);
  }, [movie_id]);

  const getCommentsData = async () => {
    try {
      const respond = await getComments(movie_id, 3);
      setNewComments(respond?.result as Comment[]);
      setLastDoc(respond?.lastDoc);
      setCommentsCount(respond?.commentsCount || 0);
    } catch (error) {
      toast.error(`${error}`);
    }
    setIsLoading(false);
  };

  const getNextCommentsData = async () => {
    try {
      const respond = await getNextComments(currentMovieId, 3, lastDoc);

      setList((prev) => [...prev, ...newComments]);
      setNewComments(respond?.result as Comment[]);
      setLastDoc(respond?.lastDoc);
      setCommentsCount(respond?.commentsCount || 0);
    } catch (error) {
      toast.error(`${error}`);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getCommentsData();
  }, []);

  useEffect(() => {
    setList([]);
    setNewComments([]);
    setCommentsCount(0);
    setLastDoc(undefined);
    setIsLoading(true);
    getCommentsData();
  }, [movie_id, isReload]);

  if (movie_id) {
    return (
      <>
        <h3 className="text-slate-50 w-full text-lg my-4">
          {commentsCount === 0 && !isLoading ? "No" : commentsCount} comments
        </h3>
        <div className="comment-list-container w-full mt-10">
          {list &&
            list.map((item) => <CommentItem comment={item} key={item.id} />)}
          {newComments &&
            newComments.map((item) => (
              <CommentItem comment={item} key={item.id} />
            ))}
          {commentsCount > list.length + newComments.length && (
            <MainButton
              className="w-full mt-4"
              type="outlined"
              text={isLoading ? "" : "Load more"}
              icon={isLoading && <Spinner />}
              onClick={() => {
                setIsLoading(true);
                getNextCommentsData();
              }}
            />
          )}
        </div>
      </>
    );
  }
};

export default CommentList;
