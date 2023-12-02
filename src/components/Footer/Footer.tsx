import { Link } from "react-router-dom";
import { FaFacebookSquare, FaTwitterSquare } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="h-fit my-12 border-t-[0.5px] border-t-slate-600 border-opacity-30">
  <div className="container mx-auto mt-10 mb-6 w-[85%] flex max-sm:flex-col gap-4 h-max">
    <div className="left flex-1 flex-shrink-0 flex flex-col gap-4">
      <h1 className="text-3xl text-slate-100 font-semibold">
        Our platform is trusted by millions & features the best updated movies
        all around the world.
      </h1>
      <div className="footer-link-container">
        <span className="text-slate-100">
          <Link className="mr-1.5 hover:underline hover:text-white" to={"/"}>
            Home
          </Link>
          /
          <Link className="mx-1.5 hover:underline hover:text-white" to={"/movie/search"}>
            Movies
          </Link>
          /
          <Link className="ml-1.5 hover:underline hover:text-white" to={"/auth/login"}>
            Start exploring
          </Link>
        </span>
      </div>
    </div>
    <div className="right flex flex-col justify-between flex-1 sm:items-end gap-4">
      <div className="social-button-container flex gap-3">
        <Link
          className="transition-colors duration-300 text-slate-100 hover:text-[#0866FF]"
          to={""}
        >
          <FaFacebookSquare />
        </Link>
        <Link
          className="transition-colors duration-300 text-slate-100 hover:text-[#4DA6E9]"
          to={""}
        >
          <FaTwitterSquare />
        </Link>
      </div>
      <p className="text-slate-100 w-max">© 2023</p>
    </div>
  </div>
</footer>

  );
};

export default Footer;
