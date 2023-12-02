import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { FaLightbulb, FaRegLightbulb } from "react-icons/fa6";
import clsx from "clsx";

import { database } from "../../../configs/firebaseConfig";
import { Movie } from "../../../types/movie.types";
import RecommendedMoviesSidebar from "../../../components/RecommendedMoviesSidebar/RecommendedMoviesSidebar";
import {
  CopyURLToClipboardButton,
  FacebookShareButton,
} from "../../../components/Buttons/ShareButtons/ShareButtons";
import MainButton from "../../../components/Buttons/MainButton/MainButton";
import CommentSection from "../../../components/CommentSection/CommentSection";
import Spinner from "../../../components/Spinner/Spinner";

const WatchMovie = () => {
  const movieParam = useParams();
  const [data, setData] = useState<Movie>();
  const [isLightOff, setIsLightOff] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (data) {
      const calculateVotes = () => {
        if (
          Array.isArray(data?.votes) &&
          (data.votes as { uid: string; voted: number }[]).length !== 0 &&
          !data.hasOwnProperty("averageVote")
        ) {
          const sum = data?.votes.reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.voted);
          }, 0);

          return {
            ...data,
            averageVote: Number((sum / data.votes.length).toFixed(1)),
          };
        } else {
          return data;
        }
      };

      if (JSON.stringify(calculateVotes) !== JSON.stringify(data)) {
        setData(calculateVotes);
      }
    }
  }, [data]);

  useEffect(() => {
    const getMovie = async () => {
      const movieRef = doc(database, `movies/${movieParam.movie_id}`);
      const movieSnapshot = await getDoc(movieRef);

      if (movieSnapshot.exists() && movieSnapshot.data().status === true) {
        setData({ ...(movieSnapshot.data() as Movie), id: movieSnapshot.id });
      } else {
        navigate("/movie/search", { replace: true, state: { from: location } });
      }
    };

    getMovie();
  }, [movieParam]);

  if (data) {
    return (
      <>
        <button
          className={clsx(
            "nav-temp-overlay fixed bg-black w-full h-[70px] z-30"
          )}
        ></button>
        <div className="body-container w-5/6 mx-auto flex max-md:flex-col pt-20">
          <div className="body-left w-full mr-6 flex flex-col gap-2">
            <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-4 font-bold">
              {data?.title}
            </h4>
            <div className="aspect-video">
              <iframe
                src={data?.video}
                title={data?.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full aspect-object-cover relative z-20"
              />
            </div>
            <div className="body-container mx-auto mt-4 flex max-lg:flex-col w-full gap-4">
              <div className="body-left w-fit mr-6 flex flex-col gap-2">
                <h4 className="text-slate-50 w-full text-lg">Description</h4>
                <p className="w-full text-slate-400 text-sm font-normal mb-5">
                  {data?.description}
                </p>
              </div>
              <div className="share-button flex justify-between gap-3 max-md:gap-4 w-fit h-fit ml-auto mr-0 max-lg:mx-auto">
                <MainButton
                  // ref={lightButtonRef}
                  type="outlined"
                  text={isLightOff ? "Lights on" : "Lights off"}
                  icon={isLightOff ? <FaLightbulb /> : <FaRegLightbulb />}
                  className={clsx(
                    "my-auto relative z-20",
                    isLightOff &&
                      "bg-slate-200 hover:bg-white hover:bg-opacity-100 text-slate-900 hover:text-black"
                  )}
                  onClick={() => setIsLightOff(!isLightOff)}
                />
                <CopyURLToClipboardButton />
                <FacebookShareButton />
              </div>
            </div>
            <div className="comments-container">
              <CommentSection movie_id={data.id} />
            </div>
          </div>
          <div className="body-right w-fit max-md:w-auto">
            <RecommendedMoviesSidebar original_movie_data={data} />
          </div>
        </div>
        <div
          className={clsx(
            "transition-all duration-300 bg-opacity-90 fixed top-0 left-0 w-screen h-screen",
            isLightOff ? "z-10 bg-black" : "-z-10"
          )}
          onClick={() => setIsLightOff(false)}
        ></div>
      </>
    );
  } else {
    return (
      <div className="w-screen h-screen flex flex-col justify-center">
        <Spinner className="w-10 h-10 mx-auto my-auto" />
      </div>
    );
  }
};

export default WatchMovie;
