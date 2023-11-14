import { useState } from "react";
import { Link } from "react-router-dom";
import { PiEyeSlashFill, PiEyeFill } from "react-icons/pi";

import MainButton from "../../../components/Buttons/MainButton/MainButton";

const Register = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);

  return (
    <div className="w-[300px] sm:w-[500px] mx-auto flex flex-col gap-3 pt-4 pb-8 bg-[#0D0C0F] rounded-lg">
      <Link to="/">
        <img
          src="/src/assets/saint_stream_logo.png"
          className="w-1/2 sm:w-1/3 h-auto mx-auto"
        />
      </Link>
      <span className="text-xs text-slate-200 text-center mb-3">
        Register to enjoy the features
      </span>
      <form
        className="flex w-5/6 mx-auto flex-col gap-4"
      >
        <div className="relative">
          <input
            type="text"
            id="email"
            name="email"
            className="block px-2.5 pb-1.5 pt-4 w-full text-sm bg-[#08070A] text-gray-300 rounded-md border-2 border-[#28262D] border-[#28262D] transition-colors duration-300 focus:border-gray-300 focus:outline-none peer"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="absolute text-sm text-[#28262D] duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-3 start-1.5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Email
          </label>
        </div>
        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            name="password"
            className="block px-2.5 pb-1.5 pt-4 w-full text-sm bg-[#08070A] text-gray-300 rounded-md border-2 border-[#28262D] transition-colors duration-300 focus:border-gray-300 focus:outline-none peer"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="absolute text-sm text-[#28262D] duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-3 start-1.5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Password
          </label>
          <div
            className="w-fit h-fit cursor-pointer"
            onClick={() => setIsPasswordVisible((prevState) => !prevState)}
          >
            {!isPasswordVisible ? (
              <PiEyeSlashFill className="absolute right-3 top-1/3 text-xl text-[#28262D]" />
            ) : (
              <PiEyeFill className="absolute right-3 top-1/3 text-xl text-gray-300" />
            )}
          </div>
        </div>
        <div className="relative">
          <input
            type={isConfirmPasswordVisible ? "text" : "password"}
            id="confirm-password"
            name="confirm-password"
            className="block px-2.5 pb-1.5 pt-4 w-full text-sm bg-[#08070A] text-gray-300 rounded-md border-2 border-[#28262D] transition-colors duration-300 focus:border-gray-300 focus:outline-none peer"
            placeholder=" "
          />
          <label
            htmlFor="confirm-password"
            className="absolute text-sm text-[#28262D] duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-3 start-1.5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Confirm password
          </label>
          <div
            className="w-fit h-fit cursor-pointer"
            onClick={() => setIsConfirmPasswordVisible((prevState) => !prevState)}
          >
            {!isConfirmPasswordVisible ? (
              <PiEyeSlashFill className="absolute right-3 top-1/3 text-xl text-[#28262D]" />
            ) : (
              <PiEyeFill className="absolute right-3 top-1/3 text-xl text-gray-300" />
            )}
          </div>
        </div>
        <MainButton
          className="w-full"
          type="auth"
          text="Create account"
          isSubmit={true}
        />
      </form>

      <span className="text-[#9CA4AB] text-xs mx-auto">
        Already have an account?{" "}
        <Link to={"/auth/login"} className="text-slate-200 text-[F0F0F0]">
          Login
        </Link>
      </span>
    </div>
  );
};

export default Register;
