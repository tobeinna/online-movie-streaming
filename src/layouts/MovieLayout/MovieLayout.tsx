import { Outlet } from "react-router-dom";
import RecommendedMoviesSidebar from "../../components/RecommendedMoviesSidebar/RecommendedMoviesSidebar";

const MovieLayout = () => {
  return (
    <>
    <Outlet />
    <RecommendedMoviesSidebar />
    </>
  )
}

export default MovieLayout