import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom"
import { useLocalStorage } from "../hooks/useLocalStorage";
import useTitle from "../hooks/useTitle";

const ProtectedLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const [localStorageUser, setLocalStorageUser] = useLocalStorage("user", null);

  useTitle()

  if (localStorageUser || user) {
    // console.log("GOTO ROOT");
    return <Navigate to={"/"}/>  
  }

  return (
    <Outlet/>
  )

}

export default ProtectedLayout