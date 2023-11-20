import { LuDot } from "react-icons/lu";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router";

import { Category, Movie } from "../../types/movie.types";
import {
  minutesToHoursAndMinutes,
  timestampToYear,
} from "../../utils/timeUtils";
import MainButton from "../Buttons/MainButton/MainButton";
import { useEffect, useState } from "react";

interface SwiperSlideContentProp {
  slide_data: Movie;
  categories_data: Category[];
}

const SwiperSlideContent: React.FC<SwiperSlideContentProp> = ({
  slide_data,
  categories_data,
}) => {
  const navigate = useNavigate();
  const [data, setData] = useState<Movie>(slide_data);

  const setCategoryToMovie = () => {
    setData({
      ...data,
      categories: data.categoriesId?.map((id: string) => ({
        id: id,
        name: categories_data?.find((category: Category) => category.id === id)
          ?.name,
      })) as Category[],
    });
  };

  useEffect(() => {
    if (
      Array.isArray(data?.votes) &&
      (data.votes as { uid: string; voted: number }[]).length !== 0 &&
      !data.hasOwnProperty("averageVote")
    ) {
      const sum = data?.votes.reduce((accumulator, currentValue) => {
        return accumulator + Number(currentValue.voted);
      }, 0);

      setData({
        ...data,
        averageVote: Number((sum / data.votes.length).toFixed(1)),
      });
    } else {
      setData(data);
    }

    setCategoryToMovie();
  }, [slide_data]);

  useEffect(() => {
    setCategoryToMovie();
  }, [categories_data]);

  return (
    <div
      className="bg-center bg-cover bg-no-repeat flex overflow-hidden w-screen h-[572px]"
      style={{
        backgroundImage: `url(${data?.poster})`,
      }}
    >
      <div className="overlay block w-full h-[572px] fixed z-10 bg-gradient-to-b from-transparent to-[#0D0C0F]"></div>
      <div className="slider-content-container z-20 w-5/12 max-sm:w-5/6 mx-[8.333333%] mb-16 mt-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-4 font-bold">
          {data?.title}
        </h2>
        <div className="text-xs md:text-sm flex w-54 flex-wrap text-gray-500 font-medium mb-4">
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
        <p className="text-sm md:text-md w-full text-slate-200 font-normal mb-5 line-clamp-4">
          {data?.description}
        </p>
        <div className="header-slider-button-group w-fit max-sm:w-full flex justify-between gap-5">
          <MainButton
            type="filled"
            text="Watch"
            icon={<BsFillPlayCircleFill />}
            onClick={() => navigate(`/movie/${data.id}/watch`)}
            className="max-sm:w-full"
          />
          <MainButton
            type="outlined"
            text="Details"
            onClick={() => navigate(`/movie/${data.id}/detail`)}
            className="max-sm:w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SwiperSlideContent;
