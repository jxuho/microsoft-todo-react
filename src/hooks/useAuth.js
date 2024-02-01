import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLocalStorage } from "./useLocalStorage";

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState("")

  const [localStorageUser, setLocalStorageUser] = useLocalStorage("user", null);

  useEffect(() => {
    setIsLoading(true)
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // console.log("AUTH CHECKED");
        setIsLoggedIn(true)
        setLocalStorageUser(authUser.email)
        setUserId(authUser.uid)
      } else {
        setIsLoggedIn(false)
        setLocalStorageUser(null)
      }
      setIsLoading(false)
    });
    return () => unsubscribe();
  }, []);

  return {isLoggedIn, isLoading, userId}

};

export default useAuth;
