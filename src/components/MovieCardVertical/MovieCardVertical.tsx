import { DocumentData, collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { LuDot } from "react-icons/lu";
import { RxDividerVertical } from "react-icons/rx";
import { AiFillStar } from "react-icons/ai";

import { database } from "../../configs/firebaseConfig";
import "./styles.scss";
import clsx from "clsx";
import { minutesToHoursAndMinutes } from "../../utils/timeUtils";

interface IMovieCardProps {
  movie_id: string;
}

interface IVote {
  uid: string,
  voted: number
}

const MovieCardVertical: React.FC<IMovieCardProps> = ({ movie_id }) => {
  const [data, setData] = useState<DocumentData>();
  const [votes, setVotes] = useState<IVote[]>([]);

  useEffect(() => {
    async function getMovie(id: string) {
      const docRef = doc(database, `movies/${id}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    }

    async function getVotes(id: string) {
      const collectionRef = collection(database, `movies/${id}/votes`);
      await getDocs(collectionRef)
      .then(snapshot => {
        let tempVotes: any = [];
        snapshot.forEach(doc => {
          tempVotes.push(doc.data())
        });
        setVotes(tempVotes)
      })
      .catch(err => {
        console.error('Error getting documents', err);
      });
    }

    getMovie(movie_id);
    getVotes(movie_id);
  }, []);

  const [averageVote, setAverageVote] = useState<number>(0);

  useEffect(() => {
    const sum = [...votes].reduce((accumulator, currentValue) => {
      return accumulator + currentValue.voted;
    }, 0);
    
    setAverageVote(sum / [...votes].length);
  }, [votes])

  useEffect(() => {
    const getCategoriesFromIdList = async () => {
      const promises = await data?.category_id.map((id: string) => {
        const docRef = doc(database, `categories/${id}`);
        return getDoc(docRef);
      });

      try {
        const snapshots = await Promise.all(promises);
        const documentsData: DocumentData[] = snapshots.map(
          (snapshot) => snapshot.data() as DocumentData
        );
        setData((prevState) => ({ ...prevState, categories: documentsData }));
      } catch (error) {
        console.log(error);
      }
    };

    if (data?.category_id) {
      getCategoriesFromIdList();
    }
  }, [data?.category_id]);

  console.log(data);

  return (
    <div 
      className={`movie-card mx-auto h-80 bg-center bg-cover bg-no-repeat rounded-2xl flex flex-col justify-end`}
      style={{
        backgroundImage: `url(${data?.poster})`,
      }}
    >
      <div className="movie-content-container rounded-bl-2xl rounded-br-2xl">
        <div className="mx-5 mb-4 movie-content">
          <div className="flex justify-between">
          <h4 className="text-lg font-semibold text-white title">
            {data?.title}
          </h4>
          <span className="text-gray-200">{minutesToHoursAndMinutes(data?.duration)}</span>
          </div>
          <div className="flex content-bottom">
            <div className="flex w-auto voted">
              <AiFillStar className="mt-auto mb-0 mr-1 text-lg text-yellow-400" />
              <span className="text-sm font-semibold text-white star">{averageVote}({[...votes].length})</span>
            </div>
            <RxDividerVertical className="mt-auto text-xl text-gray-500" />
            <div className="flex text-gray-500 movie-categories">
              {data?.categories &&
                data.categories.map((item: { name: string }, index: number) => {
                  return (
                    <div key={index}>
                      {index !== 0 && <LuDot className="mt-auto mb-0.5" />}
                      <span
                        key={index}
                        className="text-sm font-medium category"
                      >
                        {item.name}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCardVertical;
