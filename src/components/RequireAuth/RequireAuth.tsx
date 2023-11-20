import { Navigate, useLocation } from "react-router";

import useAuth from "../../hooks/useAuth";

interface RequireAuthType {
  children: React.ReactNode;
  allowedRole: string;
}

const RequireAuth: React.FC<RequireAuthType> = ({ children, allowedRole }) => {
  const { authState } = useAuth();
  const location = useLocation();

  if (!authState || authState.role !== allowedRole) {
    return <Navigate to={"/not-found"} state={{ from: location }} replace />;
  } else {
    return children;
  }
};

export default RequireAuth;
