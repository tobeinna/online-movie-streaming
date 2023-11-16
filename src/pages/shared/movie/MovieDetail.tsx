import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { LuDot } from "react-icons/lu";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { MdArrowBackIosNew } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";

import { database } from "../../../configs/firebaseConfig";
import { Movie } from "../../../types/movie.types";
import {
  minutesToHoursAndMinutes,
  timestampToYear,
} from "../../../utils/timeUtils";
import MainButton from "../../../components/Buttons/MainButton/MainButton";
import RecommendedMoviesSidebar from "../../../components/RecommendedMoviesSidebar/RecommendedMoviesSidebar";
import {
  CopyURLToClipboardButton,
  FacebookShareButton,
} from "../../../components/Buttons/ShareButtons/ShareButtons";

const MovieDetail = () => {
  const movieParam = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<Movie>();

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

      if (movieSnapshot.exists()) {
        setData({ ...(movieSnapshot.data() as Movie), id: movieSnapshot.id });
      } else {
        // navigate("/", { replace: true });
      }
    };

    getMovie();
  }, [movieParam]);

  if (data) {
    return (
      <div>
        <div
          className="bg-center bg-cover bg-no-repeat overflow-hidden w-full h-[572px]"
          style={{
            backgroundImage: `url(${data?.poster})`,
          }}
        >
          <div className="overlay flex justify-end w-full h-[572px] z-10 bg-gradient-to-b from-transparent to-[#0D0C0F]">
            <div className="content-container z-20 w-5/6 mx-auto mb-16 mt-auto relative">
              <div className="share-buttons-container w-fit flex justify-between gap-4 absolute right-0">
                <CopyURLToClipboardButton />
                <FacebookShareButton />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-4 font-bold w-2/3">
                {data?.title}
              </h2>
              <div className="text-xs md:text-sm flex 2/3 flex-wrap text-gray-500 font-medium mb-4">
                <span className="duration">
                  {minutesToHoursAndMinutes(data?.duration)}
                </span>
                <LuDot className="mt-auto mb-0.5" />
                <span className="year">
                  {timestampToYear(data.release_date.seconds)}
                </span>
                <LuDot className="mt-auto mb-0.5" />
                <div className="flex flex-wrap movie-categories">
                  {data?.categories &&
                    data?.categories.map(
                      (item: { id: string; name: string }, index: number) => {
                        return (
                          <div className="flex" key={index}>
                            {index !== 0 && (
                              <LuDot className="mt-auto mb-0.5" />
                            )}
                            <span className="whitespace-nowrap overflow-hidden break-words category">
                              {item?.name}
                            </span>
                          </div>
                        );
                      }
                    )}
                </div>
              </div>
              <div className="header-slider-button-group w-fit max-sm:w-full flex justify-between gap-5">
                <MainButton
                  type="outlined"
                  text="Back"
                  icon={<MdArrowBackIosNew />}
                  onClick={() => navigate(-1)}
                  className="max-sm:w-full"
                />
                <MainButton
                  type="filled"
                  text="Watch"
                  icon={<BsFillPlayCircleFill />}
                  onClick={() => navigate(`/movie/${data.id}/watch`)}
                  className="max-sm:w-full"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="body-container w-5/6 mx-auto mt-4 flex max-md:flex-col">
          <div className="body-left w-fit mr-6 flex flex-col gap-2">
            <h4 className="text-slate-50 w-full text-lg">Description</h4>
            <p className="w-full text-slate-400 text-sm font-normal mb-5">
              {data?.description}
            </p>
            <div className="vote-container flex">
              <span className="text-slate-50 text-lg">Rating:</span>
              <AiFillStar className="my-auto ml-3 mr-1 text-lg text-yellow-400" />
              <span className="my-auto text-sm font-semibold text-white star">
                {data.averageVote
                  ? `${data.averageVote} (${data.votes?.length} votes)`
                  : "Not voted"}
              </span>
            </div>
          </div>
          <div className="body-right w-fit max-md:w-auto">
            <RecommendedMoviesSidebar original_movie_data={data} />
          </div>
        </div>
      </div>
    );
  } else {
    return <span className="text-white">cannot load data</span>;
  }
};

export default MovieDetail;
