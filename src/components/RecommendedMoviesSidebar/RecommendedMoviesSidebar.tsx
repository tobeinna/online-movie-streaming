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

import { Category, Movie } from "../../types/movie.types";
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
  const [categoriesData, setCategoriesData] = useState<Category[]>();

  // Get all movies data
  async function getMovies() {
    const collectionRef = collection(database, "movies");

    const q = query(
      collectionRef,
      where(
        "categoriesId",
        "array-contains-any",
        original_movie_data.categoriesId
      ),
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

  async function getCategories() {
    const collectionRef = collection(database, "categories");
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);

    try {
      let data: Category[] = [];
      querySnapshot.docs.map((doc: DocumentData) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategoriesData(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCategories();
    getMovies();
  }, []);

  useEffect(() => {
    getMovies();
  }, [original_movie_data]);

  useEffect(() => {
    getCategories()
  }, [moviesData])

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

  if (moviesData && categoriesData) {
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
                  <MovieCard
                    movie_data={item}
                    categories_data={categoriesData as Category[]}
                    key={index}
                  />
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
                      <MovieCard
                        movie_data={item}
                        categories_data={categoriesData as Category[]}
                      />
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
  }
};

export default RecommendedMoviesSidebar;
