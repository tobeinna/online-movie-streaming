import React, { useEffect, useLayoutEffect, useState } from "react";
import { LuDot } from "react-icons/lu";
import { RxDividerVertical } from "react-icons/rx";
import { AiFillStar } from "react-icons/ai";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router";

import "./styles.scss";
import { minutesToHoursAndMinutes } from "../../utils/timeUtils";
import MainButton from "../Buttons/MainButton/MainButton";
import { Category, Movie } from "../../types/movie.types";

interface IMovieCardProps {
  movie_data: Movie;
  categories_data: Category[];
  className?: string;
}

const MovieCardVertical: React.FC<IMovieCardProps> = ({
  movie_data,
  categories_data,
  className,
}) => {
  const navigate = useNavigate();

  const [data, setData] = useState<Movie>();

  const setCategoryToMovie = () => {
    setData({
      ...data,
      categories: data?.categoriesId?.map((id: string) => ({
        id: id,
        name: categories_data?.find((category: Category) => category.id === id)
          ?.name,
      })) as Category[],
    } as Movie);
  };

  useLayoutEffect(() => {
    if (
      Array.isArray(movie_data?.votes) &&
      (movie_data.votes as { uid: string; voted: number }[]).length !== 0 &&
      !movie_data.hasOwnProperty("averageVote")
    ) {
      const sum = movie_data?.votes.reduce((accumulator, currentValue) => {
        return accumulator + Number(currentValue.voted);
      }, 0);

      setData({
        ...movie_data,
        averageVote: Number((sum / movie_data.votes.length).toFixed(1)),
      });
    } else {
      setData(movie_data);
    }
  }, [movie_data]);

  useEffect(() => {
    if (data && categories_data) {
      setCategoryToMovie();
    }
  }, [categories_data]);

  return (
    <div
      className={`movie-card-vertical relative mx-auto bg-center bg-cover bg-no-repeat rounded-2xl flex flex-col justify-end overflow-hidden group ${
        className && className
      }`}
      style={{
        backgroundImage: `url(${data?.poster})`,
      }}
    >
      <div className="movie-content-container rounded-bl-2xl rounded-br-2xl z-20">
        <div className="mx-5 mb-4 movie-content w-54 flex flex-col">
          <div className="flex justify-between mb-3 gap-2">
            <h4 className="text-lg font-semibold text-white title">
              {data?.title}
            </h4>
            <span className="text-gray-200 h-fit mt-auto">
              {minutesToHoursAndMinutes(data?.duration as number)}
            </span>
          </div>
          <div className="flex w-54">
            <div className="flex voted">
              <AiFillStar className="my-auto mr-1 text-lg text-yellow-400" />
              <span className="my-auto w-min text-sm font-semibold text-white star">
                {data?.averageVote ? data.averageVote : "Not voted"}
              </span>
            </div>
            <RxDividerVertical className="my-auto text-xl text-gray-500" />
            <div className="flex flex-wrap text-gray-500 movie-categories">
              {data?.categories &&
                data.categories.map(
                  (item: { id: string; name: string }, index: number) => {
                    return (
                      <div className="flex" key={index}>
                        {index !== 0 && <LuDot className="my-auto" />}
                        <span className="my-auto text-sm font-medium whitespace-nowrap overflow-hidden break-words category">
                          {item.name}
                        </span>
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        </div>
      </div>
      <div className="overlay absolute inset-0 group-hover:bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
        <div className="button-container absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <MainButton
            type="filled"
            text="Watch"
            icon={<BsFillPlayCircleFill />}
            className="mr-0.5"
            onClick={() => navigate(`/movie/${data?.id}/watch`)}
          />
          <MainButton
            type="outlined"
            text="Details"
            className="ml-0.5"
            onClick={() => navigate(`/movie/${data?.id}/detail`)}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieCardVertical;
