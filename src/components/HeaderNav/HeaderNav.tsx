import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { IoMdClose } from "react-icons/io";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Select, { MultiValue } from "react-select";
import makeAnimated from "react-select/animated";
import { ConfigProvider, Modal } from "antd";

import MainButton from "../Buttons/MainButton/MainButton.js";
import useAuth from "../../hooks/useAuth.js";
import { Category } from "../../types/movie.types.js";
import { collection, getDocs } from "firebase/firestore";
import { database } from "../../configs/firebaseConfig.js";
import { toast } from "react-toastify";
import LogoutModal from "../Modal/LogoutModal.js";

const animatedComponents = makeAnimated();

interface ISelectItem {
  value: string;
  label: string;
}

const HeaderNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolling, setScrolling] = useState(false);
  const [displayModal, setDisplayModal] = useState("none");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [titleInput, setTitleInput] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoriesSelectItem, setCategoriesSelectItem] = useState<
    ISelectItem[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const sideNavRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const { authState } = useAuth();

  const getCategories = async () => {
    const categoriesRef = collection(database, "categories");
    const catagoriesSnapshot = await getDocs(categoriesRef);

    try {
      let result: Category[] = [];
      catagoriesSnapshot.forEach((doc) =>
        result.push({ id: doc.id, name: doc.data().name })
      );
      setCategories(result);
    } catch (error) {
      toast("Error while get category list!", { type: "error" });
    }
  };

  useLayoutEffect(() => {
    getCategories();
  }, []);

  const handleDisplayModal = () => {
    setDisplayModal("block");
  };

  const handleHideModal = () => {
    setDisplayModal("none");
  };

  const handleDisplayTooltip = () => {
    setTooltipVisible(true);
  };

  const handleOutFocusModal = (e: MouseEvent) => {
    e.stopPropagation();
    if (sideNavRef.current && !sideNavRef.current.contains(e.target as Node)) {
      setDisplayModal("none");
    }
  };

  const handleOutFocusModalDocumentMouseDown: EventListener = (e) => {
    handleOutFocusModal(e as unknown as MouseEvent);
  };

  const handleOutFocusTooltip = (e: MouseEvent) => {
    e.stopPropagation();
    if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
      setTooltipVisible(false);
    }
  };

  const handleOutFocusTooltipDocumentMouseDown: EventListener = (e) => {
    handleOutFocusTooltip(e as unknown as MouseEvent);
  };

  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setDisplayModal("none");
    }
    if (window.innerWidth < 1024) {
      setTooltipVisible(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    // Add event listener to the document object
    document.addEventListener(
      "mousedown",
      handleOutFocusModalDocumentMouseDown
    );
    document.addEventListener(
      "mousedown",
      handleOutFocusTooltipDocumentMouseDown
    );

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener(
        "mousedown",
        handleOutFocusModalDocumentMouseDown
      );
      document.removeEventListener(
        "mousedown",
        handleOutFocusTooltipDocumentMouseDown
      );
    };
  }, []);

  return (
    <header
      className={`fixed z-50 w-full transition-all duration-300 ${
        scrolling ? "bg-black" : "bg-transparent"
      }`}
    >
      <div className=" flex justify-between w-11/12 lg:w-5/6 mx-auto">
        <Link to={"/"} className="flex flex-col justify-center max-md:w-1/2">
          <img
            src="/src/assets/saint_stream_logo.png"
            alt="Logo"
            className="object-cover w-max h-auto my-auto"
          />
        </Link>
        {/* <nav className="my-auto hidden lg:block">
          {headerNavLinks.map((item, index) => (
            <Link to={item.link} key={index} className="">
              <span className="transition-colors duration-500 hover:bg-white hover:bg-opacity-20 px-5 py-2 rounded-md text-slate-200 hover:text-white font-medium">
                {item.text}
              </span>
            </Link>
          ))}
        </nav> */}
        <div className="nav-button-group flex justify-between gap-2 my-auto">
          {location.pathname !== "/movie/search" && (
            <MainButton
              type="icon-only"
              icon={<HiOutlineSearch />}
              onClick={() => setIsSearchModalOpen(true)}
            />
          )}
          <MainButton
            type="icon-only"
            icon={<SlMenu />}
            onClick={handleDisplayModal}
            className="lg:hidden"
          />
          <div
            className="modal z-20 bg-black bg-opacity-40 fixed top-0 left-0 w-screen h-screen"
            style={{ display: displayModal }}
          ></div>
          <div
            id="myContent"
            className={`modal-content z-30 w-[250px] float-right h-full bg-slate-50 fixed top-0 transition-all duration-300 overflow-hidden ${
              displayModal === "block"
                ? "opacity-100 right-0"
                : "opacity-0 right-[-250px] "
            }`}
            ref={sideNavRef}
          >
            <MainButton
              type="icon-only"
              icon={<IoMdClose />}
              className="text-[black] z-10 absolute float-right top-4 right-4 border-none w-9 h-9 p-0"
              onClick={handleHideModal}
            />
            {authState && authState.displayName && (
              <div className="user-info flex flex-col gap-1">
                <p className="user-text mt-7 mb-2 ml-5 w-[184px]">
                  Hello <strong>{authState.displayName}</strong>!
                </p>
                {authState.role === "admin" && (
                  <Link
                    to={"/manage"}
                    replace
                    state={{ from: location }}
                    className="font-semibold mx-5 transition-colors duration-300 hover:bg-slate-300"
                  >
                    Manage
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsLogoutModalOpen(true);
                  }}
                  className="text-[#dd2b0e] font-semibold w-fit mx-5"
                >
                  Log out
                </button>
              </div>
            )}
            {/* <ul className="mt-5 flex flex-col gap-5 h-max">
              {headerNavLinks.map((item, index) => {
                return (
                  <li key={index} className="mx-5">
                    <Link to={item.link}>{item.text}</Link>
                  </li>
                );
              })}
            </ul> */}
            {!authState && (
              <div className="flex w-[210px] mx-[20px] justify-between absolute bottom-2">
                <Link to={"/auth/register"}>
                  <MainButton
                    type="outlined"
                    text="Sign up"
                    className="w-[100px] text-slate-800 border-slate-800"
                  />
                </Link>
                <Link to={"/auth/login"}>
                  <MainButton
                    type="filled"
                    text="Login"
                    className="w-[100px]"
                  />
                </Link>
              </div>
            )}
          </div>
          {!authState ? (
            <>
              <Link to={"/auth/register"} className="max-lg:hidden">
                <MainButton type="outlined" text="Sign up" />
              </Link>
              <Link to={"/auth/login"} className="max-lg:hidden">
                <MainButton type="filled" text="Login" />
              </Link>
            </>
          ) : (
            <div className="tooltip-container">
              <img
                className="avatar max-lg:hidden cursor-pointer w-10 h-10 rounded-[21px]"
                src={
                  (authState.photoUrl !== "undefined" && authState.photoUrl) ||
                  "/src/assets/default-avatar.jpg"
                }
                alt=""
                onClick={handleDisplayTooltip}
              />
              {tooltipVisible && (
                <>
                  <div
                    className="modal z-0 fixed top-0 left-0 w-screen h-screen"
                    style={{ display: tooltipVisible ? "block" : "none" }}
                  ></div>
                  <div
                    className="tooltip absolute translate-x-[-35%] translate-y-2 bg-white rounded-md pb-3 z-10"
                    ref={tooltipRef}
                  >
                    <div className="user-info flex flex-col gap-4">
                      <p className="user-text mt-3 mb-2 mx-2">
                        Hello <strong>{authState.displayName}</strong>!
                      </p>
                      {authState.role === "admin" && (
                        <Link
                          to={"manage"}
                          replace
                          state={{ from: location }}
                          onClick={() => {}}
                          className="mx-2 font-semibold"
                        >
                          Manage
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsLogoutModalOpen(true);
                        }}
                        className="mx-2 text-[#dd2b0e] font-semibold w-fit"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <ConfigProvider>
        <LogoutModal open={isLogoutModalOpen} setOpen={setIsLogoutModalOpen} />
        <Modal
          title="Search for your movies"
          style={{ top: 20 }}
          open={isSearchModalOpen}
          okButtonProps={{ className: "text-slate-600" }}
          okText="Search"
          onOk={() => {
            navigate(
              `/movie/search?title=${titleInput}&categories=${JSON.stringify(
                selectedCategories
              )}`
            );
            setIsSearchModalOpen(false);
          }}
          onCancel={() => {
            setIsSearchModalOpen(false);
          }}
        >
          <div className="filter w-full flex flex-col gap-4">
            <div className="title-input flex flex-col gap-2">
              <span className="text-slate-800 text-lg">
                Enter movie's title
              </span>
              <input
                type="text"
                name="title"
                id="title"
                value={titleInput || ""}
                className="block px-2.5 py-2 w-full text-sm rounded-md border-2 border-[#28262D] transition-colors duration-300 focus:border-gray-300 focus:outline-none"
                placeholder="Title"
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(
                      `/movie/search?title=${titleInput}&categories=${JSON.stringify(
                        selectedCategories
                      )}`
                    );
                  }
                }}
              />
            </div>
            <div className="category-input flex flex-col gap-2">
              <span className="text-slate-800 text-lg">
                Select movie's category
              </span>
              <div className="category-list mt-2 flex flex-wrap gap-2">
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  value={categoriesSelectItem}
                  options={categories.map((item) => {
                    return { value: item.id, label: item.name };
                  })}
                  className="w-full z-20"
                  placeholder=""
                  onChange={(newValue: MultiValue<unknown> | ISelectItem[]) => {
                    // Ensure that selectedValues is an array
                    const selectedItems = newValue as ISelectItem[];

                    setCategoriesSelectItem(selectedItems);

                    const tempCategories = (
                      newValue as { value: string; label: string }[]
                    ).map((item) => item.value);

                    setSelectedCategories(tempCategories);
                  }}
                />
              </div>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </header>
  );
};

export default HeaderNav;
