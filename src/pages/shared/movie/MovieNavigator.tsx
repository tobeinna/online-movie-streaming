import { Navigate, Outlet, useLocation, useParams } from "react-router";

const MovieNavigator = () => {
  // const movieParam = useParams();
  // const location = useLocation();
  // if (location.pathname === `/movie/${movieParam.movie_id}`) {
  //   return (
  //     <Navigate
  //       to={`/movie/${movieParam.movie_id}/detail`}
  //       state={{ from: location }}
  //       replace
  //     />
  //   );
  // }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default MovieNavigator;
