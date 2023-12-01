import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  User,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { SiGoogle, SiFacebook } from "react-icons/si";
import { PiEyeSlashFill, PiEyeFill } from "react-icons/pi";
import { useForm } from "react-hook-form";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

import { auth, database } from "../../../configs/firebaseConfig";
import MainButton from "../../../components/Buttons/MainButton/MainButton";
import Spinner from "../../../components/Spinner/Spinner";
import { toast } from "react-toastify";

const Login = () => {
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSocialUser = async (user: User) => {
    if (!user) return;

    const userDocRef = doc(database, `users/${user.uid}`);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      const { displayName, photoURL } = user;

      await setDoc(userDocRef, {
        displayName,
        search_displayName: displayName?.toLowerCase(),
        photoURL,
        createdAt: new Date(),
        role: "user",
        status: true,
      })
        .then(() => {
          toast.success("Logged in successfully!");
          navigate("/");
        })
        .catch((error: Error) => {
          toast.error(`Error: ${error.message}`);
        });
    } else {
      if (userSnapshot.data().status === false) {
        toast.error("Your account is disabled");
        return;
      }

      toast.success("Logged in successfully!");
      switch (userSnapshot.data()?.role) {
        case "user":
          navigate("/");
          break;
        case "admin":
          navigate("/manage");
          break;

        default:
          break;
      }
    }
  };

  const onSubmit = (data: any) => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(async (res) => {
        const userDocRef = doc(database, `users/${res.user.uid}`);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          setIsLoading(false);

          if (userSnapshot.data().status === false) {
            setIsLoading(false);

            toast.error("Your account is disabled");
            return;
          }

          toast.success("Logged in successfully!");
          switch (userSnapshot.data()?.role) {
            case "user":
              navigate("/");
              break;
            case "admin":
              navigate("/manage");
              break;

            default:
              break;
          }
        } else {
          setIsLoading(false);
          toast.error("User data does not exist in database.");
        }
      })
      .catch((error: Error) => {
        setIsLoading(false);
        toast.error(`Error: ${error.message}`);
      });
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        handleLoginSocialUser(result.user);
      })
      .catch((error: Error) => {
        toast.error(`Error: ${error.message}`);
      });
  };

  const handleFacebookLogin = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        const user = result.user;
        handleLoginSocialUser(user);
      })
      .catch((error: Error) => {
        toast.error(`Error: ${error.message}`);
      });
  };

  return (
    <div className="w-[300px] sm:w-[500px] mx-auto flex flex-col gap-3 pt-4 pb-8 bg-[#0D0C0F] rounded-lg">
      <Link to="/">
        <img
          src="/saint_stream_logo.png"
          className="w-1/2 sm:w-1/3 h-auto mx-auto"
        />
      </Link>
      <span className="text-xs text-slate-200 text-center mb-3">
        Login to your account
      </span>
      <form
        className="flex w-5/6 mx-auto flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative">
          <input
            type="text"
            id="email"
            className="block px-2.5 pb-1.5 pt-4 w-full text-sm bg-[#08070A] text-gray-300 rounded-md border-2 border-[#28262D] transition-colors duration-300 focus:border-gray-300 focus:outline-none peer"
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
        {isLoading ? (
          <MainButton
            className="w-full "
            type="filled"
            text=""
            icon={<Spinner />}
            isSubmit={true}
            isDisabled
          />
        ) : (
          <MainButton
            className="w-full"
            type="filled"
            text="Login"
            isSubmit={true}
          />
        )}
      </form>

      <span className="text-[#9CA4AB] text-xs mx-auto">
        Don't have an account?{" "}
        <Link to={"/auth/register"} className="text-slate-200 text-[F0F0F0]">
          Sign up
        </Link>{" "}
      </span>
      <div className="flex w-5/6 mx-auto">
        <div className="border-b-2 border-slate-400 w-5/6 m-auto text-center"></div>
        <span className="text-white mx-2">or</span>
        <div className="border-b-2 border-slate-400 w-5/6 m-auto text-center"></div>
      </div>
      <MainButton
        className="w-5/6"
        type="auth"
        text="Login with Google"
        icon={<SiGoogle />}
        onClick={handleGoogleLogin}
      />
      <MainButton
        className="w-5/6"
        type="auth"
        text="Login with Facebook"
        icon={<SiFacebook />}
        onClick={handleFacebookLogin}
      />
    </div>
  );
};

export default Login;
