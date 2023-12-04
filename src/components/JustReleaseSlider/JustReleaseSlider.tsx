import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, FreeMode } from "swiper/modules";
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

import { database } from "../../configs/firebaseConfig";
import { Category, Movie } from "../../types/movie.types";
import MovieCardVertical from "../MovieCardVertical/MovieCardVertical";
import "swiper/css";
import "swiper/swiper-bundle.css"; // Import the Swiper styles

SwiperCore.use([Pagination, FreeMode]);

const JustReleaseSlider = () => {
  const [moviesData, setMoviesData] = useState<Movie[]>();
  const [categoriesData, setCategoriesData] = useState<Category[]>();

  async function getMovies() {
    const collectionRef = collection(database, "movies");
    const q = query(collectionRef, where("status", "==", true), orderBy("release_date", "desc"), limit(10));
    const querySnapshot = await getDocs(q);

    try {
      let data: Movie[] = [];
      querySnapshot.docs.map((doc: DocumentData) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setMoviesData(data);
    } catch (error) {

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

    }
  }

  // Get all movies data
  useEffect(() => {
    getMovies();
    getCategories();
  }, []);

  useEffect(() => {
    getCategories();
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
    <div className="w-11/12 ml-auto mr-4 max-md:mr-1 pt-3">
      <h1 className="text-2xl font-bold text-slate-200 mb-4">Just Release</h1>
      {moviesData?.length ? (
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
          {moviesData?.map((item, index) => {
            return (
              <SwiperSlide className="w-auto" key={index}>
                <MovieCardVertical
                  movie_data={item}
                  categories_data={categoriesData as Category[]}
                />
              </SwiperSlide>
            );
          })}
          {isDisplayedPrev && (
            <div
              onClick={handlePrev}
              className="swiper-button-prev h-full w-fit top-[22px] left-0 bg-gradient-to-l from-transparent to-[#0D0C0F] after:text-transparent"
            >
              <img
                src="/left-circle-1-svgrepo-com.svg"
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
                src="/right-circle-svgrepo-com.svg"
                className="w-8 h-8 mx-2"
              />
            </div>
          )}
        </Swiper>
      ) : (
        <div className="w-auto rounded-md h-[370px] bg-gray-500 animate-pulse"></div>
      )}
    </div>
  );
};

export default JustReleaseSlider;
