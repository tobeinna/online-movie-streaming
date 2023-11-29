import { RouterProvider } from "react-router-dom";

import { router } from "./routes/routes";
import "./styles/App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
