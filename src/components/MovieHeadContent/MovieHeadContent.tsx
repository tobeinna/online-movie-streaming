import React from "react";
import { LuDot } from "react-icons/lu";
import { MdArrowBackIosNew } from "react-icons/md";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router";

import { Movie } from "../../types/movie.types";
import {
  CopyURLToClipboardButton,
  FacebookShareButton,
} from "../Buttons/ShareButtons/ShareButtons";
import {
  minutesToHoursAndMinutes,
  timestampToYear,
} from "../../utils/timeUtils";
import MainButton from "../Buttons/MainButton/MainButton";

interface MovieHeadContentProp {
  data: Movie;
}

const MovieHeadContent: React.FC<MovieHeadContentProp> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="bg-center bg-cover bg-no-repeat overflow-hidden w-full h-[572px]"
        style={{
          backgroundImage: `url(${data?.poster})`,
        }}
      >
        <div className="overlay flex justify-end w-full h-[572px] z-10 bg-gradient-to-b from-transparent to-[#0D0C0F]">
          <div className="content-container z-20 w-5/6 mx-auto mb-16 mt-auto relative">
            <div className="share-buttons-container w-fit flex justify-between gap-4 absolute right-0">
              <CopyURLToClipboardButton />
              <FacebookShareButton />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-4 font-bold w-2/3">
              {data?.title}
            </h2>
            <div className="text-xs md:text-sm flex 2/3 flex-wrap text-gray-500 font-medium mb-4">
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
            <div className="header-slider-button-group w-fit max-sm:w-full flex justify-between gap-5">
              <MainButton
                type="outlined"
                text="Back"
                icon={<MdArrowBackIosNew />}
                onClick={() => navigate(-1)}
                className="max-sm:w-full"
              />
              <MainButton
                type="filled"
                text="Watch"
                icon={<BsFillPlayCircleFill />}
                onClick={() => navigate(`/movie/${data.id}/watch`)}
                className="max-sm:w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieHeadContent;
