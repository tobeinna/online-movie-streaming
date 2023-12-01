import { Navigate, Outlet, useLocation } from "react-router-dom";

import HeaderNav from "../../components/HeaderNav/HeaderNav";
import { FloatButton } from "antd";

const MovieLayout = () => {
  const location = useLocation();
  if (location.pathname === "/movie" || location.pathname === "/movie/") {
    return <Navigate to={`/movie/search`} state={{ from: location }} replace />;
  }

  return (
    <>
      <HeaderNav />
      <Outlet />
      <footer>Footer</footer>
      <FloatButton.BackTop />
    </>
  );
};

export default MovieLayout;
