import React, { useEffect, useState } from "react";
import { Comment } from "../../types/movie.types";
import { User } from "../../types/user.types";
import { getUser } from "../../services/user.services";

interface ICommentcurrentCommentProp {
  comment: Comment;
}

const CommentItem: React.FC<ICommentcurrentCommentProp> = ({ comment }) => {
  const [currentComment, setCurrentComment] = useState<Comment>();
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  const getCurrentUser = async () => {
    if (currentComment) {
      const user = await getUser(currentComment.uid);
      setCurrentUser(user);
    }
  };

  useEffect(() => {
    setCurrentComment(comment);
  }, [comment]);

  useEffect(() => {
    getCurrentUser();
  }, [currentComment]);

  if (currentComment) {
    return (
      <div key={currentComment.id} className="mt-4">
        <div className="w-full flex gap-4">
          <img
            src={
              currentUser?.photoURL
                ? currentUser.photoURL
                : "/default-avatar.jpg"
            }
            alt=""
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col gap-2 w-full">
            {currentUser?.displayName ? (
              <p className="font-semibold text-slate-100">
                {currentUser?.displayName}
              </p>
            ) : (
              <div className="h-6 w-36 bg-slate-500 animate-pulse rounded-xl"></div>
            )}

            <div className="comment bg-gray-600 p-2 rounded-md w-full">
              <p className="text-slate-200">{currentComment.content}</p>
            </div>
          </div>
        </div>
        <div className="w-full text-right">
          <span className="text-slate-400 w-fit text-xs italic">
            {new Date(
              currentComment.created_date.seconds * 1000
            ).toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
};

export default CommentItem;
