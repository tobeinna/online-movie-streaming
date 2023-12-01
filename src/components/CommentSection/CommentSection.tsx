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
    const trimmedValue = commentInput.trim();
    if (trimmedValue === "" || trimmedValue === "\n") {
      toast.error("Your comment cannot be empty!");
      setCommentInput("");
      setIsLoading(false);
      return;
    }

    if (!authState?.id) {
      toast.error("You have to login to comment!");
      setIsLoading(false);

      return;
    }

    try {
      setCommentInput("");

      await createComment(authState?.id, currentMovieId, trimmedValue);
      setIsReloadCommentList((prev) => !prev);
    } catch (error) {
      toast.error(`${error}`);
    }
    setIsLoading(false);
  };

  if (movie_id) {
    return (
      <div className="comment-section w-full h-fit my-6">
        {authState?.id ? (
          <div className="flex flex-col gap-4">
            <div className="comment-input flex gap-4">
              <img
                src={authState?.photoUrl ? authState.photoUrl : "/default-avatar.jpg"}
                alt=""
                className="w-12 h-12 rounded-full"
              />
              <input
                type="text"
                name="content"
                id="content"
                placeholder="Share your thoughts"
                className="rounded-md border-2 border-slate-300 w-full p-4 disabled:bg-slate-100"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                disabled={isLoading}
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setIsLoading(true);
                    handleComment();
                  }
                }}
              ></input>
              <MainButton
                type="filled"
                text="Send"
                icon={<IoSend />}
                isDisabled={isLoading}
                className="max-md:hidden"
                onClick={() => {
                  setIsLoading(true);
                  handleComment();
                }}
              />
            </div>
            <MainButton
              type="filled"
              text="Send"
              icon={<IoSend />}
              isDisabled={isLoading}
              className="w-full hidden max-md:flex"
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
        {currentMovieId && (
          <CommentList
            movie_id={currentMovieId}
            isReload={isReloadCommentList}
          />
        )}
      </div>
    );
  }
};
export default CommentSection;
