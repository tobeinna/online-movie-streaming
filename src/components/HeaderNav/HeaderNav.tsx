import { Link } from "react-router-dom";
import { HiOutlineSearch } from "react-icons/hi";

import { headerNavLinks } from "./HeaderNav.constants.js";
import MainButton from "../Buttons/MainButton/MainButton.js";

const HeaderNav = () => {
  return (
    <header className="flex justify-between w-5/6 mx-auto">
      <Link to={"/"}>
        <img
          src="/src/assets/saint_stream_logo.png"
          alt="Logo"
          className="object-cover w-max h-auto my-auto"
        />
      </Link>
      <nav className="my-auto">
        {headerNavLinks.map((item, index) => (
          <Link to={item.link} key={index} className="mx-3">
            <span className="text-slate-400 hover:text-white font-medium">
              {item.text}
            </span>
          </Link>
        ))}
      </nav>
      <div className="nav-button-group flex justify-between gap-2 my-auto">
        <MainButton type="icon-only" icon={<HiOutlineSearch />} />
        <MainButton type="outlined" text="Sign up" />
        <MainButton type="filled" text="Login" />
      </div>
    </header>
  );
};

export default HeaderNav;
