import { useContext } from "react";

import { AuthContext } from "../stores/AuthContext";

function useAuth() {
  return useContext(AuthContext);
}

export default useAuth;
