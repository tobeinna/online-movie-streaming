import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { AiFillStar } from "react-icons/ai";
import ReactStars from "react-stars";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { database } from "../../../configs/firebaseConfig";
import { Category, Movie } from "../../../types/movie.types";
import RecommendedMoviesSidebar from "../../../components/RecommendedMoviesSidebar/RecommendedMoviesSidebar";
import useAuth from "../../../hooks/useAuth";
import MovieHeadContent from "../../../components/MovieHeadContent/MovieHeadContent";
import Spinner from "../../../components/Spinner/Spinner";
import CommentSection from "../../../components/CommentSection/CommentSection";

const MovieDetail = () => {
  const movieParam = useParams();
  const [data, setData] = useState<Movie>();
  const [categoriesData, setCategoriesData] = useState<Category[]>();

  const { authState, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (data) {
      const calculateVotes = () => {
        if (
          Array.isArray(data?.votes) &&
          (data.votes as { uid: string; voted: number }[]).length !== 0 &&
          !data.hasOwnProperty("averageVote")
        ) {
          const sum = data?.votes.reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.voted);
          }, 0);

          return {
            ...data,
            averageVote: Number((sum / data.votes.length).toFixed(1)),
          };
        } else {
          return data;
        }
      };

      if (JSON.stringify(calculateVotes) !== JSON.stringify(data)) {
        setData(calculateVotes);
      }
    }
  }, [data]);

  const getMovie = async () => {
    const movieRef = doc(database, `movies/${movieParam.movie_id}`);
    const movieSnapshot = await getDoc(movieRef);

    if (movieSnapshot.exists() && movieSnapshot.data().status === true) {
      setData({ ...(movieSnapshot.data() as Movie), id: movieSnapshot.id });
    } else {
      navigate("/movie/search", { replace: true, state: { from: location } });
    }
  };

  async function getCategories() {
    const collectionRef = collection(database, "categories");
    const querySnapshot = await getDocs(collectionRef);

    try {
      let categories: Category[] = [];
      querySnapshot.docs.map((doc: DocumentData) => {
        categories.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategoriesData(categories);
    } catch (error) {

    }
  }

  useLayoutEffect(() => {
    getMovie();
  }, []);

  useLayoutEffect(() => {
    getMovie();
  }, [movieParam]);

  useLayoutEffect(() => {
    getCategories();
  }, []);

  const handleRatingChange = async (newRating: number) => {
    if (authState && authState.status === false) {
      logOut();
      navigate("/auth/login");
      toast.error("Your account is disabled");
      return;
    }

    const votes = data?.votes ? [...data.votes] : [];
    const filteredVotes = votes.filter((item) => item.uid !== authState?.id);
    const movieRef = doc(database, `movies/${data?.id}`);

    // Update the 'votes' field in the Firestore document
    try {
      await toast.promise(
        updateDoc(movieRef, {
          votes: [...filteredVotes, { uid: authState?.id, voted: newRating }],
        }),
        {
          pending: "Submitting your vote...",
          success: "Voted successfully!",
          error: "Error submitting your vote. Please try again.",
        }
      );
      getMovie();
    } catch (error) {
      getMovie();
    }
  };

  if (data) {
    return (
      <div>
        <MovieHeadContent data={data} categories_data={categoriesData || []} />
        <div className="body-container w-5/6 mx-auto mt-4 flex justify-between gap-8 max-md:flex-col">
          <div className="body-left w-full mr-6 flex flex-col gap-2">
            <h4 className="text-slate-50 w-full text-lg">Description</h4>
            <p className="w-full text-slate-400 text-sm font-normal mb-5">
              {data?.description}
            </p>
            <div className="vote-container w-full flex max-lg:flex-col justify-between gap-4 items-center">
              <div className="current-votes flex">
                <span className="text-slate-50 text-lg max-sm:text-base h-fit my-auto">
                  Rating:
                </span>
                <AiFillStar className="my-auto ml-3 mr-1 text-lg text-yellow-400" />
                <span className="my-auto text-sm font-semibold text-white star">
                  {data.averageVote
                    ? `${data.averageVote} (${data.votes?.length} votes)`
                    : "Not voted"}
                </span>
              </div>
              <div className="my-vote flex items-center">
                {authState ? (
                  <>
                    <span className="text-slate-50 text-lg mr-2">
                      Your vote:
                    </span>

                    <ReactStars
                      count={5}
                      value={
                        data.votes?.filter(
                          (vote) => vote.uid === authState?.id
                        )[0]
                          ? Number(
                              data.votes?.filter(
                                (vote) => vote.uid === authState?.id
                              )[0].voted
                            )
                          : 0
                      }
                      size={24}
                      color2={"#ffd700"} // selected stars color
                      onChange={handleRatingChange}
                    />
                  </>
                ) : (
                  <span className="text-slate-200">
                    You have to{" "}
                    <Link
                      to="/auth/login"
                      replace
                      className="underline hover:text-white"
                    >
                      login
                    </Link>{" "}
                    to vote.
                  </span>
                )}
              </div>
            </div>
            <div className="comments-container">
              <CommentSection movie_id={data.id} />
            </div>
          </div>
          <div className="body-right w-fit max-md:w-auto">
            <RecommendedMoviesSidebar original_movie_data={data} />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-screen h-screen flex flex-col justify-center">
        <Spinner className="w-10 h-10 mx-auto my-auto" />
      </div>
    );
  }
};

export default MovieDetail;
