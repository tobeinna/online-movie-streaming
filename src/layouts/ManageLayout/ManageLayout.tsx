import { Navigate, Outlet, useLocation } from "react-router-dom";

import ManageSideNav from "../../components/ManageSideNav/ManageSideNav";

const ManageLayout = () => {
  const location = useLocation();

  if (location.pathname === "/manage") {
    return <Navigate to={"/manage/movies"} replace />;
  }

  return (
    <>
      <header>Header</header>
      <div className="container">
        <ManageSideNav />
        <Outlet />
      </div>
    </>
  );
};

export default ManageLayout;
