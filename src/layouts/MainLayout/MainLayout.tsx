import { Outlet } from "react-router-dom";

import HeaderSlider from "../../components/HeaderSlider/HeaderSlider";
import { FloatButton } from "antd";

const MainLayout = () => {
  return (
    <div className="w-full">
      <HeaderSlider />
      <Outlet />
      <footer>Footer</footer>
      <FloatButton.BackTop />
    </div>
  );
};

export default MainLayout;
