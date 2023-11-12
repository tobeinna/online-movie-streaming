import { Outlet } from "react-router-dom";
import HeaderSlider from "../../components/HeaderSlider/HeaderSlider";

const MainLayout = () => {
  return (
    <div className="w-full">
      <HeaderSlider />
      <Outlet />
      <footer>Footer</footer>
    </div>
  );
};

export default MainLayout;
