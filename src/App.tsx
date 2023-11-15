import { RouterProvider } from "react-router-dom";

import { router } from "./routes/routes";
import "./styles/App.css";
import { AuthContextProvider } from "./stores/AuthContext";

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
