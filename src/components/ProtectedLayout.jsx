import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loading from "./Loading";

const ProtectedLayout = () => {
  const { isLoggedIn, isLoading: isAuthLoading, userId } = useAuth();

  if (isAuthLoading) {
    return <Loading />;
  }

  if (isLoggedIn) {
    console.log('navigate to root');
    return <Navigate to={"/"} />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
