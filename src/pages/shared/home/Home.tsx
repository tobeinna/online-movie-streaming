import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { BsFillPlayCircleFill } from "react-icons/bs";

import MovieCardVertical from "../../../components/MovieCardVertical/MovieCardVertical";
import { database } from "../../../configs/firebaseConfig";
import MainButton from "../../../components/Buttons/MainButton/MainButton";
import HeaderNav from "../../../components/HeaderNav/HeaderNav";
import JustReleaseSlider from "../../../components/JustReleaseSlider/JustReleaseSlider";
import HomeMovieList from "../../../components/HomeMovieList/HomeMovieList";

//Movie interface

interface Movie {
  id: string;
  // Define the properties of your movie document here
  // For example:
  title: string;
  releaseYear: number;
}

interface VotesItem {
  id: string;
  // Define the properties of your votes document here
  // For example:
  actorName: string;
  characterName: string;
}

interface CombinedMovieData extends Movie {
  votesData: VotesItem[];
}

const Home: React.FC = () => {
  // get all movies data

  const [moviesData, setMoviesData] = useState<CombinedMovieData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesCollectionRef = collection(database, "movies");
        const moviesSnapshot = await getDocs(moviesCollectionRef);

        const combinedDataArray: CombinedMovieData[] = [];

        // Process movies collection documents
        for (const doc of moviesSnapshot.docs) {
          const movieDocData: any = {
            id: doc.id,
            ...doc.data(),
          };

          // Process votes
          const votesRef = collection(database, `movies/${doc.id}/votes`); // Replace with your votes name
          const votesSnapshot = await getDocs(votesRef);

          const votesDataArray: any = votesSnapshot.docs.map((subDoc) => ({
            ...subDoc.data(),
          }));

          // Combine movie doc data with votes data
          const combinedMovieData: CombinedMovieData = {
            ...movieDocData,
            votes: votesDataArray,
          };
          combinedDataArray.push(combinedMovieData);
        }

        setMoviesData(combinedDataArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once on mount

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
