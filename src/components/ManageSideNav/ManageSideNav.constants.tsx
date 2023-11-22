import { MenuProps } from "antd";
import { BiSolidMoviePlay } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { MdOutlineCategory } from "react-icons/md";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export const items: MenuItem[] = [
  getItem("Manage movies", "/manage/movies", <BiSolidMoviePlay />),
  getItem("Manage categories", "/manage/categories", <MdOutlineCategory />),
  getItem("Manage users", "/manage/users", <FiUser />),
];