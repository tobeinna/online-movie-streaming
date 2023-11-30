import { useEffect, useLayoutEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";

import { Comment } from "../../types/movie.types";
import { getComments } from "../../services/movie.services";

const CommentList: React.FC<{ movie_id: string; isReload: boolean }> = ({
  movie_id,
  isReload,
}) => {
  const [currentMovieId, setCurrentMovieId] = useState<string>("");
  const [list, setList] = useState<Comment[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData>();

  useEffect(() => {
    setCurrentMovieId(movie_id)
  }, [movie_id])

  const getCommentsData = async () => {
    if (lastDoc) {
      const respond = await getComments(currentMovieId, 4, lastDoc);
      if (respond) {
        setList(respond.result);
        setLastDoc(respond.lastDoc);
      } else {
        setList([]);
        setLastDoc(undefined);
      }
    } else {
      const respond = await getComments(currentMovieId, 4);
      if (respond) {
        setList(respond.result);
        setLastDoc(respond.lastDoc);
      } else {
        setList([]);
        setLastDoc(undefined);
      }
    }
  };

  useLayoutEffect(() => {
    // if (currentMovieId) {
    getCommentsData();
    // }
  }, []);

  useLayoutEffect(() => {
    // if (currentMovieId) {
    getCommentsData();
    // }
  }, [currentMovieId]);

  useLayoutEffect(() => {
    setList([]);
    setLastDoc(undefined);
    getCommentsData();
  }, [currentMovieId, isReload]);

  if (movie_id) {
    return (
      <div className="comment-list-container w-full mt-10">
        {list ? (
          list.map((item) => (
            <div key={item.id} className="mt-4">
              <div className="w-full flex gap-4">
                <img src={""} alt="" className="w-12 h-12 rounded-full" />

                <div className="comment bg-gray-600 p-2 rounded-md w-full">
                  <p className="text-slate-200">{item.content}</p>
                </div>
              </div>
              <div className="w-full text-right">
                <span className="text-slate-400 w-fit text-xs italic">
                  {new Date(item.created_date.seconds * 1000).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <span className="text-slate-300">No comment</span>
        )}
      </div>
    );
  }
};

export default CommentList;
