import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { SiGoogle, SiFacebook } from "react-icons/si";
import { PiEyeSlashFill, PiEyeFill } from "react-icons/pi";

import { auth } from "../../../configs/firebaseConfig";
import MainButton from "../../../components/Buttons/MainButton/MainButton";
import { Link } from "react-router-dom";

const Login = () => {
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const [data, setData] = useState({ email: "", password: "" });

  const handleUpdateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newInput = { [e.target.name]: e.target.value };
    setData({ ...data, ...newInput });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((res) => {
        console.log(res.user);
      })
      .catch((error: Error) => {
        alert(error.message);
      });
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        console.log(result);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(error);
      });
  };

  const handleFacebookLogin = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;

        // IdP data available using getAdditionalUserInfo(result)
        // ...
        console.log(user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
        alert(errorCode);
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
        Login to your account
      </span>
      <form
        className="flex w-5/6 mx-auto flex-col gap-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="relative">
          <input
            type="text"
            id="email"
            name="email"
            className="block px-2.5 pb-1.5 pt-4 w-full text-sm bg-[#08070A] text-gray-300 rounded-md border-2 border-[#28262D] border-[#28262D] transition-colors duration-300 focus:border-gray-300 focus:outline-none peer"
            placeholder=" "
            onChange={(e) => handleUpdateInput(e)}
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
            onChange={(e) => handleUpdateInput(e)}
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
        <MainButton
          className="w-full"
          type="auth"
          text="Login"
          isSubmit={true}
        />
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
