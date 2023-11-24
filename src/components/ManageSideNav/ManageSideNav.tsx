import { items } from "./ManageSideNav.constants";

import { ConfigProvider, Menu, Modal } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import MainButton from "../Buttons/MainButton/MainButton";
import { AiOutlineFileSync } from "react-icons/ai";
import { MdLogout } from "react-icons/md";

const ManageSideNav = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const { authState, logOut } = useAuth();

  const navigate = useNavigate();
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className={"fixed top-0 left-0 bottom-0 h-full"}
    >
      <div>
        <Link to={"/manage"} className="overflow-hidden w-max mx-auto">
          {collapsed ? (
            <img
              src="/src/assets/saint_stream_icon.png"
              alt="Logo"
              className="ml-5 w-auto h-9 my-3"
            />
          ) : (
            <img
              src="/src/assets/saint_stream_logo.png"
              alt="Logo"
              className="h-18 w-auto mx-auto"
            />
          )}
        </Link>
        <Menu
          theme="dark"
          defaultSelectedKeys={[location.pathname]}
          mode="inline"
          items={items}
          onClick={(menuItem) => navigate(menuItem.key)}
        />
      </div>
      {authState && authState.displayName && (
        <div className="user-info fixed bottom-14">
          {collapsed ? (
            <div className="flex flex-col w-full gap-1 text-center">
              <img
                className="avatar max-lg:hidden cursor-pointer w-10 h-10 ml-5 rounded-[21px]"
                src={
                  (authState.photoUrl !== "undefined" && authState.photoUrl) ||
                  "/src/assets/default-avatar.jpg"
                }
                alt=""
                onClick={() => setCollapsed(false)}
              />
              {authState.role === "admin" && (
                <MainButton
                  type="icon-only"
                  className="w-full ml-3"
                  icon={<AiOutlineFileSync />}
                  onClick={() => navigate("/")}
                />
              )}
              <div className="">
                <MainButton
                  type="icon-only"
                  className="w-full ml-3"
                  icon={<MdLogout className="text-[#dd2b0e]" />}
                  onClick={() => {
                    setIsLogoutModalOpen(true);
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-[12.5rem] gap-1 text-center">
              <p className="user-text w-max mx-auto">
                <span className="text-slate-200 w-48 line-clamp-3">
                  Hello <strong>{authState.displayName}</strong>!
                </span>
              </p>
              {authState.role === "admin" && (
                <MainButton
                  type="icon-only"
                  text="User homepage"
                  className="w-11/12"
                  icon={<AiOutlineFileSync />}
                  onClick={() => navigate("/")}
                />
              )}
              <div className="">
                <MainButton
                  type="icon-only"
                  text="Logout"
                  className="w-11/12"
                  icon={<MdLogout className="text-[#dd2b0e]" />}
                  onClick={() => {
                    setIsLogoutModalOpen(true);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
      <ConfigProvider>
        <Modal
          open={isLogoutModalOpen}
          onOk={() => {
            logOut();
            navigate("/auth/login");
          }}
          okButtonProps={{ className: "text-[#dd2b0e] hover:text-[#dd2b0e]" }}
          okText="Log out"
          onCancel={() => setIsLogoutModalOpen(false)}
        >
          <p>Are you sure to log out of this account?</p>
        </Modal>
      </ConfigProvider>
    </Sider>
  );
};

export default ManageSideNav;
