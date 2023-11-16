import React, { useEffect, useState } from "react";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import HeaderNav from "../HeaderNav/HeaderNav";
import {
  DocumentData,
  collection,
  getDocs,
  limit,
  query,
} from "firebase/firestore";

import "swiper/css";
import "swiper/swiper-bundle.css"; // Import the Swiper styles
import "./styles.scss";
import { database } from "../../configs/firebaseConfig";
import { Movie } from "../../types/movie.types";
import SwiperSlideContent from "./SwiperSlideContent";

// Install Swiper modules
SwiperCore.use([Pagination, Autoplay, EffectFade]);

const HeaderSlider: React.FC = () => {
  const [moviesData, setMoviesData] = useState<Movie[]>();

  // Get all movies data
  useEffect(() => {
    async function getMovies() {
      const collectionRef = collection(database, "movies");
      const q = query(collectionRef, limit(4));
      const querySnapshot = await getDocs(q);

      try {
        let data: Movie[] = [];
        querySnapshot.docs.map((doc: DocumentData) => data.push(doc.data()));
        setMoviesData(data);
      } catch (error) {
        console.log(error);
      }
    }

    getMovies();
  }, []);

  if (moviesData) {
    return (
      <>
        <HeaderNav />
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          effect={"fade"}
          autoplay={{
            delay: 5000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}
          loop={true}
          allowTouchMove={true}
        >
          {moviesData?.map((item, index) => (
            <SwiperSlide key={index}>
              <SwiperSlideContent slide_data={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    );
  }
};

export default HeaderSlider;
