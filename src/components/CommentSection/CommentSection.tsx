import { Link } from "react-router-dom";
import { IoSend } from "react-icons/io5";

import useAuth from "../../hooks/useAuth";
import MainButton from "../Buttons/MainButton/MainButton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createComment } from "../../services/movie.services";
import CommentList from "../CommentList/CommentList";

const CommentSection: React.FC<{ movie_id: string }> = ({ movie_id }) => {
  const [currentMovieId, setCurrentMovieId] = useState<string>("");
  const [commentInput, setCommentInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReloadCommentList, setIsReloadCommentList] =
    useState<boolean>(false);

  const { authState } = useAuth();

  useEffect(() => {
    setCurrentMovieId(movie_id);
  }, [movie_id]);

  const handleComment = async () => {
    if (!commentInput) {
      toast.error("Your comment cannot be empty!");
      setIsLoading(false);
      return;
    }

    if (!authState?.id) {
      toast.error("You have to login to comment!");
      setIsLoading(false);

      return;
    }

    try {
      await createComment(authState?.id, currentMovieId, commentInput);
      setCommentInput("");
      setIsReloadCommentList((prev) => !prev);
    } catch (error) {
      toast.error(`${error}`);
    }
    setIsLoading(false);
  };

  if (movie_id) {
    return (
      <div className="comment-section w-full h-fit my-6">
        <h3 className="text-slate-50 w-full text-lg mb-4">Comments</h3>
        {authState?.id ? (
          <div className="comment-input flex gap-4">
            <img
              src={authState?.photoUrl}
              alt=""
              className="w-12 h-12 rounded-full"
            />
            <textarea
              name="content"
              id="content"
              rows={3}
              placeholder="Share your thoughts about the movie"
              className="rounded-md border-2 border-slate-300 w-full p-4 resize-none"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            ></textarea>
            <MainButton
              type="filled"
              text="Send"
              icon={<IoSend />}
              isDisabled={isLoading}
              onClick={() => {
                setIsLoading(true);
                handleComment();
              }}
            />
          </div>
        ) : (
          <span className="text-slate-200">
            You have to{" "}
            <Link to={"/auth/login"} className="underline hover:text-white">
              login
            </Link>{" "}
            to comment
          </span>
        )}
        <CommentList movie_id={currentMovieId} isReload={isReloadCommentList} />
      </div>
    );
  }
};
export default CommentSection;
