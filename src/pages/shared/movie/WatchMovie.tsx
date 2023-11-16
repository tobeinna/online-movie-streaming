import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { database } from "../../../configs/firebaseConfig";
import { Movie } from "../../../types/movie.types";
import RecommendedMoviesSidebar from "../../../components/RecommendedMoviesSidebar/RecommendedMoviesSidebar";

const WatchMovie = () => {
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
      <>
        <div className="nav-temp-overlay fixed bg-black w-full h-[70px] z-10"></div>
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
                className="w-full h-full aspect-object-cover"
              />
            </div>
          </div>

          <div className="body-right w-fit max-md:w-auto">
            <RecommendedMoviesSidebar original_movie_data={data} />
          </div>
        </div>
      </>
    );
  } else {
    return <span className="text-white">cannot load data</span>;
  }
};

export default WatchMovie;
