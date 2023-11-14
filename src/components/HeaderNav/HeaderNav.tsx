import { Link } from "react-router-dom";
import { HiOutlineSearch } from "react-icons/hi";
import { useEffect, useState } from "react";

import { headerNavLinks } from "./HeaderNav.constants.js";
import MainButton from "../Buttons/MainButton/MainButton.js";

const HeaderNav = () => {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed z-50 w-full transition-all duration-300 ${
        scrolling ? "bg-black" : "bg-transparent"
      }`}
    >
      <div className=" flex justify-between w-5/6 mx-auto">
        <Link to={"/"}>
          <img
            src="/src/assets/saint_stream_logo.png"
            alt="Logo"
            className="object-cover w-max h-auto my-auto"
          />
        </Link>
        <nav className="my-auto">
          {headerNavLinks.map((item, index) => (
            <Link to={item.link} key={index} className="">
              <span className="transition-colors duration-500 hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-slate-200 hover:text-white font-medium">
                {item.text}
              </span>
            </Link>
          ))}
        </nav>
        <div className="nav-button-group flex justify-between gap-2 my-auto">
          <MainButton type="icon-only" icon={<HiOutlineSearch />} />
          <Link to={"/auth/register"}>
            <MainButton type="outlined" text="Sign up" />
          </Link>
          <Link to={"/auth/login"}>
            <MainButton type="filled" text="Login" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderNav;
