import React from "react";
import { LuDot } from "react-icons/lu";
import { RxDividerVertical } from "react-icons/rx";
import { AiFillStar } from "react-icons/ai";
import { BsFillPlayCircleFill } from "react-icons/bs";

import "./styles.scss";
import { minutesToHoursAndMinutes } from "../../utils/timeUtils";
import MainButton from "../Buttons/MainButton/MainButton";
import { Movie } from "../../types/movie.types";

interface IMovieCardProps {
  movie_data: Movie;
}

const MovieCard: React.FC<IMovieCardProps> = ({ movie_data }) => {
  return (
    <div className="flex flex-col w-[250px]">
      <div
        className={`movie-card relative mx-auto bg-center bg-cover bg-no-repeat rounded-2xl flex flex-col justify-end overflow-hidden group`}
        style={{
          backgroundImage: `url(${movie_data?.poster})`,
        }}
      >
        <div className="overlay absolute inset-0 group-hover:bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
          <div className="button-container absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <MainButton
              type="filled"
              text="Watch"
              icon={<BsFillPlayCircleFill />}
              className="mr-0.5"
            />
            <MainButton type="outlined" text="Details" className="ml-0.5" />
          </div>
        </div>
      </div>
      <div className="mt-4 movie-content w-54 flex flex-col">
        <div className="flex justify-between mb-3 gap-6">
          <h4 className="text-lg font-semibold text-white title">
            {movie_data?.title}
          </h4>
          <span className="text-gray-200">
            {minutesToHoursAndMinutes(movie_data?.duration)}
          </span>
        </div>
        <div className="flex w-54">
          <div className="flex voted">
            <AiFillStar className="my-auto mr-1 text-lg text-yellow-400" />
            <span className="my-auto text-sm font-semibold text-white star">
              {movie_data.averageVote ? movie_data.averageVote : "Not voted"}
            </span>
          </div>
          <RxDividerVertical className="my-auto text-xl text-gray-500" />
          <div className="flex flex-wrap text-gray-500 movie-categories">
            {movie_data?.categories &&
              movie_data.categories.map(
                (item: { id: string; name: string }, index: number) => {
                  return (
                    <div className="flex" key={index}>
                      {index !== 0 && <LuDot className="mt-auto mb-0.5" />}
                      <span className="text-sm font-medium whitespace-nowrap overflow-hidden break-words category">
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
  );
};

export default MovieCard;
