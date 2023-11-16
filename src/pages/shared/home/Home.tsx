import React, { useEffect, useState } from "react";
import { DocumentData, collection, getDocs, orderBy, query } from "firebase/firestore";
import { BsFillPlayCircleFill } from "react-icons/bs";

import { database } from "../../../configs/firebaseConfig";
import MainButton from "../../../components/Buttons/MainButton/MainButton";
import JustReleaseSlider from "../../../components/JustReleaseSlider/JustReleaseSlider";
import HomeMovieList from "../../../components/HomeMovieList/HomeMovieList";
import { Movie } from "../../../types/movie.types";

const Home: React.FC = () => {
  return (
    <div className="">
      <JustReleaseSlider />
      <HomeMovieList />
      <MainButton type="filled" text="Text" />
      <MainButton type="filled" text="Text" icon={<BsFillPlayCircleFill />} />
      <MainButton type="outlined" text="Text" />
      <MainButton type="outlined" text="Text" icon={<BsFillPlayCircleFill />} />
      <MainButton type="auth" text="Text" />
      <MainButton type="auth" text="Text" icon={<BsFillPlayCircleFill />} />
      <MainButton type="icon-only" icon={<BsFillPlayCircleFill />} />
    </div>
  );
};

export default Home;
