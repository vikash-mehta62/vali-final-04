
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/auth" />;
  }

  if (user?.role === "admin") {
    return children;
  } else if (user?.role === "member" || user?.role === "store") {
    return children;
  }

  return <Navigate to="/" />;
}

export default PrivateRoute;
