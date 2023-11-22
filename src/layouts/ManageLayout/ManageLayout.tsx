import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import ManageSideNav from "../../components/ManageSideNav/ManageSideNav";
import { Layout } from "antd";

const { Content, Footer } = Layout;

const ManageLayout = () => {
  const location = useLocation();
  if (location.pathname === "/manage") {
    return (
      <Navigate to={"/manage/movies"} state={{ from: location }} replace />
    );
  }
  return (
    <Layout hasSider className="min-h-screen">
      <ManageSideNav />
      <Layout>
        <Content className="bg-white">
          <Outlet />
        </Content>
        <Footer className="bg-white text-right">
          <span className="text-slate-800">Saint Stream ©2023</span>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ManageLayout;
