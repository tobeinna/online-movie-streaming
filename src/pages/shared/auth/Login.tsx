import { FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";

import { auth } from "../../../configs/firebaseConfig";

const Login = () => {
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

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
    <>
    <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
        <input
          className="rounded-sm p-2 shadow-sm shadow-slate-500"
          type="email"
          name="email"
          onChange={(e) => handleUpdateInput(e)}
        />
        <input
          className="rounded-sm p-2 shadow-sm shadow-slate-500"
          type="password"
          name="password"
          onChange={(e) => handleUpdateInput(e)}
        />
        <input
          className="border-2 border-solid border-slate-800 px-4 py-1 rounded-md w-1/3 mx-auto mt-2"
          type="submit"
          value={"Login"}
        />
      </form>
      <div
        className="text-md gap-3 w-2/3 mx-auto mt-4 px-4 py-3 bg-slate-100 cursor-pointer rounded-lg flex outline-2 outline outline-slate-500"
        onClick={handleGoogleLogin}
      >
        <span>icon</span>
        <span className="text-slate-800 font-medium">Login with Google</span>
      </div>
      <div
        className="text-md cursor-pointer flex gap-3 w-2/3 mx-auto mt-4 px-4 py-3 bg-slate-100 rounded-lg outline-2 outline outline-slate-500"
        onClick={handleFacebookLogin}
      >
        <span>icon</span>
        <span className="text-slate-800 font-medium">Login with Facebook</span>
      </div>
    </>
  )
}

export default Login