import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiEyeSlashFill, PiEyeFill } from "react-icons/pi";
import { User, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";

import MainButton from "../../../components/Buttons/MainButton/MainButton";
import { auth, database } from "../../../configs/firebaseConfig";

const Register = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      "confirm-password": "",
    },
  });
  const navigate = useNavigate();

  const handleCreateUser = async (user: User, name: string) => {
    if (!user) return;

    const userDocRef = doc(database, `users/${user.uid}`);
    setDoc(userDocRef, {
      displayName: name,
      createdAt: new Date(),
      role: "user",
    })
      .then(() => navigate("/auth/login"))
      .catch((error: Error) => {
        setRegisterError(error.message);
      });
  };

  const onSubmit = (data: any) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((res) => {
        handleCreateUser(res.user, data.name);
      })
      .catch((error: Error) => {
        setRegisterError(error.message);
      });
  };

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
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className="error-message text-[#dd2b0e]">{registerError}</p>
        <div className="relative">
          <input
            type="text"
            id="name"
            className="block px-2.5 pb-1.5 pt-4 w-full text-sm bg-[#08070A] text-gray-300 rounded-md border-2 border-[#28262D] border-[#28262D] transition-colors duration-300 focus:border-gray-300 focus:outline-none peer"
            placeholder=" "
            {...register("name", {
              required: "Name is required.",
            })}
          />
          <label
            htmlFor="name"
            className="absolute text-sm text-[#28262D] duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-3 start-1.5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Name
          </label>
        </div>
        <p className="error-message text-[#dd2b0e]">{errors.name?.message}</p>
        <div className="relative">
          <input
            type="text"
            id="email"
            className="block px-2.5 pb-1.5 pt-4 w-full text-sm bg-[#08070A] text-gray-300 rounded-md border-2 border-[#28262D] border-[#28262D] transition-colors duration-300 focus:border-gray-300 focus:outline-none peer"
            placeholder=" "
            {...register("email", {
              required: "Email is required.",
              minLength: {
                value: 8,
                message: "Minimum length is 8 characters.",
              },
              maxLength: {
                value: 32,
                message: "Maximum length is 32 characters.",
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          <label
            htmlFor="email"
            className="absolute text-sm text-[#28262D] duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-3 start-1.5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Email
          </label>
        </div>
        <p className="error-message text-[#dd2b0e]">{errors.email?.message}</p>
        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            className="block px-2.5 pb-1.5 pt-4 w-full text-sm bg-[#08070A] text-gray-300 rounded-md border-2 border-[#28262D] transition-colors duration-300 focus:border-gray-300 focus:outline-none peer"
            placeholder=" "
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 8,
                message: "Minimum length is 8 characters.",
              },
              maxLength: {
                value: 32,
                message: "Maximum length is 32 characters.",
              },
              validate: (value) => {
                if (!value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
                  return "Password must contains at least 1 character and 1 number.";
                }
              },
            })}
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
        <p className="error-message text-[#dd2b0e]">
          {errors.password?.message}
        </p>
        <div className="relative">
          <input
            type={isConfirmPasswordVisible ? "text" : "password"}
            id="confirm-password"
            className="block px-2.5 pb-1.5 pt-4 w-full text-sm bg-[#08070A] text-gray-300 rounded-md border-2 border-[#28262D] transition-colors duration-300 focus:border-gray-300 focus:outline-none peer"
            placeholder=" "
            {...register("confirm-password", {
              required: "Password confirmation is required.",
              validate: (value) => {
                if (watch("password") != value) {
                  return "Password confirmation does not match";
                }
              },
            })}
          />
          <label
            htmlFor="confirm-password"
            className="absolute text-sm text-[#28262D] duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-3 start-1.5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Confirm password
          </label>
          <div
            className="w-fit h-fit cursor-pointer"
            onClick={() =>
              setIsConfirmPasswordVisible((prevState) => !prevState)
            }
          >
            {!isConfirmPasswordVisible ? (
              <PiEyeSlashFill className="absolute right-3 top-1/3 text-xl text-[#28262D]" />
            ) : (
              <PiEyeFill className="absolute right-3 top-1/3 text-xl text-gray-300" />
            )}
          </div>
        </div>
        <p className="error-message text-[#dd2b0e]">
          {errors["confirm-password"]?.message}
        </p>
        <MainButton
          className="w-full"
          type="filled"
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
