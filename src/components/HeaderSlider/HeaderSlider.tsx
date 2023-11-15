import HeaderNav from "../HeaderNav/HeaderNav";

import React, { useEffect, useState } from "react";
import { LuDot } from "react-icons/lu";
import { BsFillPlayCircleFill } from "react-icons/bs";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/swiper-bundle.css"; // Import the Swiper styles
import "./styles.scss";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { database } from "../../configs/firebaseConfig";
import { minutesToHoursAndMinutes } from "../../utils/timeUtils";
import MainButton from "../Buttons/MainButton/MainButton";

// Install Swiper modules
SwiperCore.use([Pagination, Autoplay, EffectFade]);

const HeaderSlider: React.FC = () => {
  const [data, setData] = useState<DocumentData>();
  const [year, setYear] = useState<number>();
  // const [votes, setVotes] = useState<IVote[]>([]);

  const movie_id = "ororYwNrXaxhbnzfPRrO";

  useEffect(() => {
    async function getMovie(id: string) {
      const docRef = doc(database, `movies/${id}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
      }
    }

    getMovie(movie_id);
  }, []);

  useEffect(() => {
    if (data?.release_date) {
      const date = new Date(data.release_date.seconds * 1000);

      setYear(date.getFullYear());
    }
  }, [data]);

  return (
    <>
      <HeaderNav />
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        effect={"fade"}
        autoplay={{
          delay: 3000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        }}
        loop={true}
        allowTouchMove={true}
      >
        <SwiperSlide
          className="bg-center bg-cover bg-no-repeat flex overflow-hidden h-[572px]"
          style={{
            backgroundImage: `url(${data?.poster})`,
          }}
        >
          <div className="overlay block w-full h-full fixed z-10  bg-gradient-to-b from-transparent to-[#0D0C0F]">
            aaaaaaaaaaaa
          </div>
          <div className="slider-content-container z-20 w-5/6 mx-auto mb-16 mt-auto">
            <h2 className="text-4xl text-white mb-4 font-bold">
              {data?.title}
            </h2>
            <div className="flex w-54 flex-wrap text-gray-500 text-sm font-medium mb-4">
              <span className="duration">
                {minutesToHoursAndMinutes(data?.duration)}
              </span>
              <LuDot className="mt-auto mb-0.5" />
              <span className="year">{year}</span>
              <LuDot className="mt-auto mb-0.5" />
              <div className="flex flex-wrap movie-categories">
                {data?.categories &&
                  data?.categories.map(
                    (item: { id: string; name: string }, index: number) => {
                      return (
                        <div className="flex" key={index}>
                          {index !== 0 && <LuDot className="mt-auto mb-0.5" />}
                          <span className="whitespace-nowrap overflow-hidden break-words category">
                            {item?.name}
                          </span>
                        </div>
                      );
                    }
                  )}
              </div>
            </div>
            <p className="w-1/2 text-slate-200 text-base font-normal mb-5">
              {data?.description}
            </p>
            <div className="header-slider-button-group w-fit flex justify-between gap-5">
              <MainButton
                type="filled"
                text="Watch"
                icon={<BsFillPlayCircleFill />}
              />
              <MainButton type="outlined" text="Detail" />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide
          className="bg-center bg-cover bg-no-repeat flex overflow-hidden h-[572px]"
          style={{
            backgroundImage: `url(${data?.poster})`,
          }}
        >
          <div className="overlay block w-full h-full fixed z-10  bg-gradient-to-b from-transparent to-[#0D0C0F]">
            aaaaaaaaaaaa
          </div>
          <div className="slider-content-container z-20 w-5/6 mx-auto mb-16 mt-auto">
            <h2 className="text-4xl text-white mb-4 font-bold">
              {data?.title}
            </h2>
            <div className="flex w-54 flex-wrap text-gray-500 text-sm font-medium mb-4">
              <span className="duration">
                {minutesToHoursAndMinutes(data?.duration)}
              </span>
              <LuDot className="mt-auto mb-0.5" />
              <span className="year">{year}</span>
              <LuDot className="mt-auto mb-0.5" />
              <div className="flex flex-wrap movie-categories">
                {data?.categories &&
                  data?.categories.map(
                    (item: { id: string; name: string }, index: number) => {
                      return (
                        <div className="flex" key={index}>
                          {index !== 0 && <LuDot className="mt-auto mb-0.5" />}
                          <span className="whitespace-nowrap overflow-hidden break-words category">
                            {item?.name}
                          </span>
                        </div>
                      );
                    }
                  )}
              </div>
            </div>
            <p className="w-1/2 text-slate-200 text-base font-normal mb-5">
              {data?.description}
            </p>
            <div className="header-slider-button-group w-fit flex justify-between gap-5">
              <MainButton
                type="filled"
                text="Watch"
                icon={<BsFillPlayCircleFill />}
              />
              <MainButton type="outlined" text="Detail" />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide
          className="bg-center bg-cover bg-no-repeat flex overflow-hidden h-[572px]"
          style={{
            backgroundImage: `url(${data?.poster})`,
          }}
        >
          <div className="overlay block w-full h-full fixed z-10  bg-gradient-to-b from-transparent to-[#0D0C0F]">
            aaaaaaaaaaaa
          </div>
          <div className="slider-content-container z-20 w-5/6 mx-auto mb-16 mt-auto">
            <h2 className="text-4xl text-white mb-4 font-bold">
              {data?.title}
            </h2>
            <div className="flex w-54 flex-wrap text-gray-500 text-sm font-medium mb-4">
              <span className="duration">
                {minutesToHoursAndMinutes(data?.duration)}
              </span>
              <LuDot className="mt-auto mb-0.5" />
              <span className="year">{year}</span>
              <LuDot className="mt-auto mb-0.5" />
              <div className="flex flex-wrap movie-categories">
                {data?.categories &&
                  data?.categories.map(
                    (item: { id: string; name: string }, index: number) => {
                      return (
                        <div className="flex" key={index}>
                          {index !== 0 && <LuDot className="mt-auto mb-0.5" />}
                          <span className="whitespace-nowrap overflow-hidden break-words category">
                            {item?.name}
                          </span>
                        </div>
                      );
                    }
                  )}
              </div>
            </div>
            <p className="w-1/2 text-slate-200 text-base font-normal mb-5">
              {data?.description}
            </p>
            <div className="header-slider-button-group w-fit flex justify-between gap-5">
              <MainButton
                type="filled"
                text="Watch"
                icon={<BsFillPlayCircleFill />}
              />
              <MainButton type="outlined" text="Detail" />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide
          className="bg-center bg-cover bg-no-repeat flex overflow-hidden h-[572px]"
          style={{
            backgroundImage: `url(${data?.poster})`,
          }}
        >
          <div className="overlay block w-full h-full fixed z-10  bg-gradient-to-b from-transparent to-[#0D0C0F]">
            aaaaaaaaaaaa
          </div>
          <div className="slider-content-container z-20 w-5/6 mx-auto mb-16 mt-auto">
            <h2 className="text-4xl text-white mb-4 font-bold">
              {data?.title}
            </h2>
            <div className="flex w-54 flex-wrap text-gray-500 text-sm font-medium mb-4">
              <span className="duration">
                {minutesToHoursAndMinutes(data?.duration)}
              </span>
              <LuDot className="mt-auto mb-0.5" />
              <span className="year">{year}</span>
              <LuDot className="mt-auto mb-0.5" />
              <div className="flex flex-wrap movie-categories">
                {data?.categories &&
                  data?.categories.map(
                    (item: { id: string; name: string }, index: number) => {
                      return (
                        <div className="flex" key={index}>
                          {index !== 0 && <LuDot className="mt-auto mb-0.5" />}
                          <span className="whitespace-nowrap overflow-hidden break-words category">
                            {item?.name}
                          </span>
                        </div>
                      );
                    }
                  )}
              </div>
            </div>
            <p className="w-1/2 text-slate-200 text-base font-normal mb-5">
              {data?.description}
            </p>
            <div className="header-slider-button-group w-fit flex justify-between gap-5">
              <MainButton
                type="filled"
                text="Watch"
                icon={<BsFillPlayCircleFill />}
              />
              <MainButton type="outlined" text="Detail" />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default HeaderSlider;
