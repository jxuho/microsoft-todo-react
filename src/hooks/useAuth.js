import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { login, logout } from "../store/authSlice";
import { useLocalStorage } from "./useLocalStorage";

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState("")

  const dispatch = useDispatch();
  const [localStorageUser, setLocalStorageUser] = useLocalStorage("user", null);

  useEffect(() => {

    console.log("AUTH EFFECT");

    setIsLoading(true)
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {

        console.log("AUTH CHECKED");

        setIsLoggedIn(true)
        dispatch(
          login({
            email: authUser.email,
            uid: authUser.uid,
            displayName: authUser.displayName,
            photoUrl: authUser.photoURL,
          })
        );
        setLocalStorageUser(authUser.email)
        setUserId(authUser.uid)
      } else {
        setIsLoggedIn(false)
        setLocalStorageUser(null)
        dispatch(logout());
       
      }
      setIsLoading(false)
    });
    return () => unsubscribe();
  }, []);

  return {isLoggedIn, isLoading, userId}

};

export default useAuth;
