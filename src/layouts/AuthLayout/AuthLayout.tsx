import { Outlet } from "react-router-dom";

import "./auth-layout.scss";

const AuthLayout = () => {
  return (
      <div className="background">
        <Outlet />
      </div>
  );
};

export default AuthLayout;
