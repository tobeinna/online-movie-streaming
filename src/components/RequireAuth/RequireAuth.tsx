import { Navigate, useLocation } from "react-router";

import useAuth from "../../hooks/useAuth";

interface RequireAuthType {
  children: React.ReactNode;
  allowedRole: string;
}

const RequireAuth: React.FC<RequireAuthType> = ({ children, allowedRole }) => {
  const { authState } = useAuth();
  const location = useLocation();

  if (authState) {
    if (authState.role !== allowedRole) {
      return <Navigate to={"/auth/login"} state={{ from: location }} replace />;
    }

    return children;
  }
};

export default RequireAuth;
