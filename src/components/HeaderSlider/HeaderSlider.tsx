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
import { database } from "../../configs/firebaseConfig";
import { Category, Movie } from "../../types/movie.types";
import SwiperSlideContent from "./SwiperSlideContent";

// Install Swiper modules
SwiperCore.use([Pagination, Autoplay, EffectFade]);

const HeaderSlider: React.FC = () => {
  const [moviesData, setMoviesData] = useState<Movie[]>();
  const [categoriesData, setCategoriesData] = useState<Category[]>();

  async function getMovies() {
    const collectionRef = collection(database, "movies");
    const q = query(collectionRef, limit(4));
    const querySnapshot = await getDocs(q);

    try {
      let data: Movie[] = [];
      querySnapshot.docs.map((doc: DocumentData) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setMoviesData(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getCategories() {
    const collectionRef = collection(database, "categories");
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);

    try {
      let data: Category[] = [];
      querySnapshot.docs.map((doc: DocumentData) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategoriesData(data);
    } catch (error) {
      console.log(error);
    }
  }
  // Get all movies data
  useEffect(() => {
    getMovies();
    getCategories();
  }, []);

  useEffect(() => {
    getCategories();
  }, [moviesData]);

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
              <SwiperSlideContent
                slide_data={item}
                categories_data={categoriesData as Category[]}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    );
  }
};

export default HeaderSlider;
