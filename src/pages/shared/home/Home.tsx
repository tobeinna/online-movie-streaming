import React from "react";

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
