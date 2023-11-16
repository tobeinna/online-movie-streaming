import { Navigate, Outlet, useLocation } from "react-router-dom";

import HeaderNav from "../../components/HeaderNav/HeaderNav";

const MovieLayout = () => {
  const location = useLocation();
  if (location.pathname === "/movie" || location.pathname === "/movie/") {
    return <Navigate to={`/`} state={{ from: location }} replace />;
  }

  return (
    <>
      <header>
        <HeaderNav />
      </header>
      <Outlet />
      <footer>Footer</footer>
    </>
  );
};

export default MovieLayout;
