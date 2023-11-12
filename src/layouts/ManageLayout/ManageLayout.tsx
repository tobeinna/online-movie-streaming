import { Outlet } from "react-router-dom";

import ManageSideNav from "../../components/ManageSideNav/ManageSideNav"

const ManageLayout = () => {
  return (
    <>
    <header>Header</header>
    <div className="container">
        <ManageSideNav />
        <Outlet />
    </div>
    </>
  )
}

export default ManageLayout