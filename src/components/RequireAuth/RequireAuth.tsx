import { Navigate, Outlet, useLocation } from "react-router";

import useAuth from "../../hooks/useAuth";

interface RequireAuthType {
  allowedRole: string;
}

const RequireAuth: React.FC<RequireAuthType> = ({ allowedRole }) => {
  const { authState } = useAuth();
  const location = useLocation();

  if (authState === null || (authState && authState !== null && authState.role !== allowedRole)) {
    return <Navigate to={"/not-found"} state={{ from: location }} replace />;
  } else {
    return <Outlet />;
  }
};

export default RequireAuth;
