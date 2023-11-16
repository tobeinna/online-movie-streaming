import { LuDot } from "react-icons/lu";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { useEffect, useState } from "react";

import { Movie } from "../../types/movie.types";
import { minutesToHoursAndMinutes } from "../../utils/timeUtils";
import MainButton from "../Buttons/MainButton/MainButton";

interface SwiperSlideContentProp {
  slide_data: Movie;
}

const SwiperSlideContent: React.FC<SwiperSlideContentProp> = ({
  slide_data,
}) => {
  const [year, setYear] = useState<number>();

  useEffect(() => {
    if (slide_data?.release_date) {
      const date = new Date(slide_data.release_date.seconds * 1000);

      setYear(date.getFullYear());
    }
  }, [slide_data]);

  return (
    <div
      className="bg-center bg-cover bg-no-repeat flex overflow-hidden h-[572px]"
      style={{
        backgroundImage: `url(${slide_data?.poster})`,
      }}
    >
      <div className="overlay block w-full h-full fixed z-10  bg-gradient-to-b from-transparent to-[#0D0C0F]"></div>
      <div className="slider-content-container z-20 w-5/6 mx-auto mb-16 mt-auto">
        <h2 className="text-4xl text-white mb-4 font-bold">
          {slide_data?.title}
        </h2>
        <div className="flex w-54 flex-wrap text-gray-500 text-sm font-medium mb-4">
          <span className="duration">
            {minutesToHoursAndMinutes(slide_data?.duration)}
          </span>
          <LuDot className="mt-auto mb-0.5" />
          <span className="year">{year}</span>
          <LuDot className="mt-auto mb-0.5" />
          <div className="flex flex-wrap movie-categories">
            {slide_data?.categories &&
              slide_data?.categories.map(
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
          {slide_data?.description}
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
    </div>
  );
};

export default SwiperSlideContent;
