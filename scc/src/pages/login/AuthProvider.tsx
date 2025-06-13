import { Navigate } from "react-router-dom";

function AuthProvider({ children }) {
  const accessToken = localStorage.getItem("accessToken");
  const Token = accessToken ? JSON.stringify(accessToken) : null;
  const check = localStorage.getItem("check");
  const user = check ? JSON.stringify(check) : null;

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}

export default AuthProvider;
