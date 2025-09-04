
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function OpenRoute({ children }) {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return children;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  }
  if (user?.role === "member") {
    return <Navigate to="/member/dashboard" />;
  }
  if (user?.role === "store") {
    return <Navigate to="/store/dashboard" />;
  }

  return <Navigate to="/" />;
}

export default OpenRoute;
