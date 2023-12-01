import { Outlet } from "react-router-dom";

import HeaderSlider from "../../components/HeaderSlider/HeaderSlider";
import { FloatButton } from "antd";
import Footer from "../../components/Footer/Footer";

const MainLayout = () => {
  return (
    <div className="w-full">
      <HeaderSlider />
      <Outlet />
      <Footer />
      <FloatButton.BackTop />
    </div>
  );
};

export default MainLayout;
