import React from "react";
import { BsFillPlayCircleFill } from "react-icons/bs";

import MainButton from "../../../components/Buttons/MainButton/MainButton";
import JustReleaseSlider from "../../../components/JustReleaseSlider/JustReleaseSlider";
import HomeMovieList from "../../../components/HomeMovieList/HomeMovieList";

const Home: React.FC = () => {
  return (
    <div className="">
      <JustReleaseSlider />
      <HomeMovieList />
    </div>
  );
};

export default Home;
