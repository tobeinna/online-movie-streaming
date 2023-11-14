import MovieCardVertical from "../MovieCardVertical/MovieCardVertical";

import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/swiper-bundle.css"; // Import the Swiper styles
import { useCallback, useEffect, useRef, useState } from "react";

SwiperCore.use([Pagination, FreeMode]);

const JustReleaseSlider = () => {
  const movies_id = [
    "ororYwNrXaxhbnzfPRrO",
    "ororYwNrXaxhbnzfPRrO",
    "ororYwNrXaxhbnzfPRrO",
    "ororYwNrXaxhbnzfPRrO",
    "ororYwNrXaxhbnzfPRrO",
    "ororYwNrXaxhbnzfPRrO",
    "ororYwNrXaxhbnzfPRrO",
  ];

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
    <div className="w-5/6 mx-auto pt-3">
      <h1 className="text-2xl font-bold text-slate-200 mb-4">Just Release</h1>
      <Swiper
        ref={sliderRef}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        spaceBetween={30}
        freeMode={true}
        slidesPerView={"auto"}
        onReachBeginning={() => setIsDisplayedPrev(false)}
        onReachEnd={() => setIsDisplayedNext(false)}
        onSlideNextTransitionStart={() => setIsDisplayedPrev(true)}
        onSlidePrevTransitionStart={() => setIsDisplayedNext(true)}
      >
        {movies_id.map((item, index) => {
          return (
            <SwiperSlide className="w-auto" key={index}>
              <MovieCardVertical movie_id={item} />
            </SwiperSlide>
          );
        })}
        {isDisplayedPrev && (
          <div
            onClick={handlePrev}
            className="swiper-button-prev h-full w-fit top-[22px] left-0 bg-gradient-to-l from-transparent to-[#0D0C0F] after:text-transparent"
          >
            <img src="/src/assets/left-circle-1-svgrepo-com.svg" className="w-8 h-8 mx-2"/>
          </div>
        )}
        {isDisplayedNext && (
          <div
            onClick={handleNext}
            className="swiper-button-next h-full w-fit top-[22px] right-0 bg-gradient-to-r from-transparent to-[#0D0C0F] after:text-transparent"
          >
            <img src="/src/assets/right-circle-svgrepo-com.svg"  className="w-8 h-8 mx-2"/>
          </div>
        )}
      </Swiper>
    </div>
  );
};

export default JustReleaseSlider;
