import { LuDot } from "react-icons/lu";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router";

import { Movie } from "../../types/movie.types";
import { minutesToHoursAndMinutes, timestampToYear } from "../../utils/timeUtils";
import MainButton from "../Buttons/MainButton/MainButton";

interface SwiperSlideContentProp {
  slide_data: Movie;
}

const SwiperSlideContent: React.FC<SwiperSlideContentProp> = ({
  slide_data,
}) => {
  const navigate = useNavigate()

  return (
    <div
      className="bg-center bg-cover bg-no-repeat flex overflow-hidden w-screen h-[572px]"
      style={{
        backgroundImage: `url(${slide_data?.poster})`,
      }}
    >
      <div className="overlay block w-full h-[572px] fixed z-10 bg-gradient-to-b from-transparent to-[#0D0C0F]"></div>
      <div className="slider-content-container z-20 w-5/12 max-sm:w-5/6 mx-[8.333333%] mb-16 mt-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-4 font-bold">
          {slide_data?.title}
        </h2>
        <div className="text-xs md:text-sm flex w-54 flex-wrap text-gray-500 font-medium mb-4">
          <span className="duration">
            {minutesToHoursAndMinutes(slide_data?.duration)}
          </span>
          <LuDot className="mt-auto mb-0.5" />
          <span className="year">{timestampToYear(slide_data.release_date.seconds)}</span>
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
        <p className="text-sm md:text-md w-full text-slate-200 font-normal mb-5">
          {slide_data?.description}
        </p>
        <div className="header-slider-button-group w-fit max-sm:w-full flex justify-between gap-5">
          <MainButton
            type="filled"
            text="Watch"
            icon={<BsFillPlayCircleFill />}
            onClick={() => navigate(`/movie/${slide_data.id}/watch`)}
            className="max-sm:w-full"
          />
          <MainButton
            type="outlined"
            text="Detail"
            onClick={() => navigate(`/movie/${slide_data.id}/detail`)}
            className="max-sm:w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SwiperSlideContent;
