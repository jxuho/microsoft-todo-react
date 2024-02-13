import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setHeaderButton } from "../store/uiSlice";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AccountManager = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accountManagerRef = useRef();
  const isAccountManagerActive = useSelector(
    (state) => state.ui.accountManagerActive
  );

  const [localStorageUser, setLocalStorageUser] = useLocalStorage("user", null);

  useEffect(() => {
    const closeModalOnClickOutside = (event) => {
      if (
        accountManagerRef.current &&
        !accountManagerRef.current.contains(event.target)
      ) {
        if (event.target.closest("#accountManagerButton")) {
          return;
        }
        dispatch(
          setHeaderButton({ property: "accountManagerActive", value: false })
        );
      }
    };
    if (isAccountManagerActive) {
      document.addEventListener("click", closeModalOnClickOutside, true);
    }
    return () => {
      document.removeEventListener("click", closeModalOnClickOutside, true);
    };
  }, [isAccountManagerActive]);

  const signOutHandler = () => {
    signOut(auth)
      .then(() => {
        setLocalStorageUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const myAccountClickHandler = () => {
    window.location.pathname = "/myaccount";
    // navigate("/myaccount")
  };

  return (
    <>
      {isAccountManagerActive && (
        <div
          ref={accountManagerRef}
          className="absolute w-80 bg-white right-0 top-12 z-40 animate-fadeFillSlow delay-0 max-w-full"
          style={{
            boxShadow:
              "0 24px 54px rgba(0,0,0,.15), 0 4.5px 13.5px rgba(0,0,0,.08)",
            color: "#333",
            height: "180px",
            transition: "visibility 0s linear 120ms,opacity 120ms ease",
          }}
        >
          {auth.currentUser ? (
            <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[1fr_3fr] leading-normal items-stretch h-full text-black">
              <div className="col-start-1 col-end-2 self-center text-sm px-4">
                Welcome!
              </div>
              <div className="col-start-1 col-end-4 min-h-[132px self-center] flex">
                <div className="w-20 h-20 m-5  overflow-hidden rounded-full">
                  {auth.currentUser.photoURL ? (
                    <img src={auth.currentUser.photoURL} alt="profile image" referrerPolicy="no-referrer"/>
                  ) : (
                    <img src="/public/profile_image.svg" alt="profile image" />
                  )}
                </div>
                <div className="flex-grow pr-3 mt-4">
                  <div className="font-semibold text-lg">
                    {auth.currentUser.displayName ?? auth.currentUser.email}
                  </div>
                  <div className="mt-1 font-semibold">{auth.currentUser.email}</div>
                  <div
                    className="mt-1 font-semibold underline text-ms-blue-hover hover:cursor-pointer"
                    onClick={myAccountClickHandler}
                  >
                    My account
                  </div>
                </div>
              </div>
              <div
                className="col-start-3 col-end-4 row-start-1 p-3 text-sm self-center font-semibold hover:bg-ms-white-hover hover:underline hover:cursor-pointer"
                onClick={signOutHandler}
              >
                sign out
              </div>
            </div>
          ) : (
            <div className="p-8 h-full w-full flex flex-col justify-center items-center text-ms-light-text">
              <h2 className="text-center">
                You're not logged in.
                <br />
                Changes are not saved.
              </h2>
              <button
                className="text-2xl border rounded-md my-4 w-full pb-1 bg-ms-blue text-white hover:bg-ms-blue-hover duration-100"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </button>
              <button
                className="text-lg border rounded-md w-[80%] border-ms-light-text hover:bg-ms-white-hover duration-75"
                onClick={() => navigate("/signin")}
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AccountManager;
