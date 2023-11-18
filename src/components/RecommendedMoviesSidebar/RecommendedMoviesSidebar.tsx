import { useCallback, useEffect, useRef, useState } from "react";
import {
  DocumentData,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";

import { Movie } from "../../types/movie.types";
import { database } from "../../configs/firebaseConfig";
import MovieCard from "../MovieCard/MovieCard";

SwiperCore.use([Pagination, FreeMode]);

interface RecommendedMoviesSidebarProp {
  original_movie_data: Movie;
}

const RecommendedMoviesSidebar: React.FC<RecommendedMoviesSidebarProp> = ({
  original_movie_data,
}) => {
  const [moviesData, setMoviesData] = useState<Movie[]>();

  // Get all movies data
  async function getMovies() {
    const collectionRef = collection(database, "movies");

    const q = query(
      collectionRef,
      where("categories", "array-contains-any", original_movie_data.categories),
      orderBy("release_date", "desc"),
      limit(5)
    );
    const querySnapshot = await getDocs(q);

    try {
      let data: Movie[] = [];
      querySnapshot.docs.map((doc: DocumentData) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(data);

      setMoviesData(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    getMovies();
  }, [original_movie_data]);

  useEffect(() => {
    if (moviesData) {
      const calculatedVotesMoviesData: Movie[] = moviesData.map((item) => {
        if (
          Array.isArray(item?.votes) &&
          (item.votes as { uid: string; voted: number }[]).length !== 0 &&
          !item.hasOwnProperty("averageVote")
        ) {
          const sum = item?.votes.reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.voted);
          }, 0);

          return {
            ...item,
            averageVote: Number((sum / item.votes.length).toFixed(1)),
          };
        } else {
          return item;
        }
      });

      if (
        JSON.stringify(calculatedVotesMoviesData) !== JSON.stringify(moviesData)
      ) {
        // setMoviesData(calculatedVotesMoviesData);
        setMoviesData(
          calculatedVotesMoviesData.sort((a, b) => {
            if (!a.averageVote) return 1;
            if (!b.averageVote) return -1;

            return b.averageVote - a.averageVote;
          })
        );
      }
    }
  }, [moviesData]);

  // Control slider actions
  const [isDisplayedPrev, setIsDisplayedPrev] = useState<boolean>(false);
  const [isDisplayedNext, setIsDisplayedNext] = useState<boolean>(true);
  const sliderRef = useRef<any>(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <>
      {/* When md */}
      <div className="vertical-list hidden md:block">
        <h1 className="text-xl font-bold text-slate-200 mb-4">
          Recommended movies
        </h1>
        <div className="list flex flex-col gap-6">
          {moviesData?.map(
            (item, index) =>
              item.id !== original_movie_data.id && (
                <MovieCard movie_data={item} key={index} />
              )
          )}
        </div>
      </div>
      {/* When max-md */}
      <div className="vertical-list max-md:block hidden w-full overflow-hidden mx-auto">
        <h1 className="text-xl font-bold text-slate-200 my-4">
          Recommended movies
        </h1>
        {moviesData && (
          <Swiper
            ref={sliderRef}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            spaceBetween={30}
            freeMode={true}
            allowTouchMove={false}
            slidesPerView={"auto"}
            onSlidePrevTransitionStart={() => setIsDisplayedNext(true)}
            onSlidePrevTransitionEnd={() => setIsDisplayedNext(true)}
            onReachBeginning={() => {
              setIsDisplayedPrev(false);
              setIsDisplayedNext(true);
            }}
            onSlideNextTransitionStart={() => setIsDisplayedPrev(true)}
            onSlideNextTransitionEnd={() => setIsDisplayedPrev(true)}
            onReachEnd={() => {
              setIsDisplayedNext(false);
              setIsDisplayedPrev(true);
            }}
          >
            {moviesData?.map(
              (item, index) =>
                item.id !== original_movie_data.id && (
                  <SwiperSlide className="w-auto" key={index}>
                    <MovieCard movie_data={item} />
                  </SwiperSlide>
                )
            )}
            {isDisplayedPrev && (
              <div
                onClick={handlePrev}
                className="swiper-button-prev h-full w-fit top-[22px] left-0 bg-gradient-to-l from-transparent to-[#0D0C0F] after:text-transparent"
              >
                <img
                  src="/src/assets/left-circle-1-svgrepo-com.svg"
                  className="w-8 h-8 mx-2"
                />
              </div>
            )}
            {isDisplayedNext && (
              <div
                onClick={handleNext}
                className="swiper-button-next h-full w-fit top-[22px] right-0 bg-gradient-to-r from-transparent to-[#0D0C0F] after:text-transparent"
              >
                <img
                  src="/src/assets/right-circle-svgrepo-com.svg"
                  className="w-8 h-8 mx-2"
                />
              </div>
            )}
          </Swiper>
        )}
      </div>
    </>
  );
};

export default RecommendedMoviesSidebar;
