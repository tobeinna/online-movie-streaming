import { RouterProvider } from "react-router-dom";

import { router } from "./routes/routes";

function App() {
  return (
    <div className="w-1/4 mx-auto my-auto">
      <RouterProvider router={router} />
      
    </div>
  );
}

export default App;
