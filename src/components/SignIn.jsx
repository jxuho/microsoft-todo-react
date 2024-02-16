import { BsKey } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useLocalStorage } from "../hooks/useLocalStorage";
import Loading from "./Loading";
import ResetPassword from "./ResetPassword";
import googleImg from '../../public/googleLogo.png'

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [emailAlertContent, setEmailAlertContent] = useState("");

  const [showPasswordTab, setShowPasswordTab] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const [passwordAlertContent, setPasswordAlertContent] = useState("");
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [passwordInfoContent, setPasswordInfoContent] = useState("");
  const [isShowPasswordChecked, setIsShowPasswordChecked] = useState(false);
  const [showSignInOptions, setShowSignInOptions] = useState(false);
  const [nextButtonDisable, setNextButtonDisable] = useState(false);

  const [showResetPassword, setShowResetPassword] = useState(false);

  const checkboxRef = useRef();

  const [localStorageUser, setLocalStorageUser] = useLocalStorage("user", null);

  const [isLoading, setIsLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider(); // provider 구글 설정

  // // redirect 사용 login
  // useEffect(() => {
  //   const redirectResult = async () => {
  //     try {
  //       setIsLoading(true);
  //       const signInResult = await getRedirectResult(auth);

  //       console.log(signInResult);

  //       if (signInResult) {

  //         await setDoc(doc(db, "users", signInResult.user.uid), {
  //           email: signInResult.user.email,
  //         });

  //         navigate("/");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     setIsLoading(false);
  //   };

  //   console.log('1');

  //   if (localStorageRedirect) {
  //     console.log('2');
  //     redirectResult();
  //     setLocalStorageRedirect(false);
  //   }
  // }, []);

  useEffect(() => {
    const handleEnterKeyPress = (event) => {
      if (event.key === "Enter") {
        nextButtonClickHandler();
      }
    };
    document.addEventListener("keydown", handleEnterKeyPress);
    return () => document.removeEventListener("keydown", handleEnterKeyPress);
  }, [email, password]);

  const emailInputHandler = (e) => {
    setEmail(e.target.value);
    setNextButtonDisable(false);
  };

  const passwordInputHandler = (e) => {
    setPassword(e.target.value);
  };

  // const sendEmailHandler = () => {
  //   window.open(
  //     "mailto:jxuholee@gmail.com?subject=Todo - Can't access my account&body=Tell me about the problem you have"
  //   );
  // };

  const nextButtonClickHandler = async () => {
    if (!showPasswordTab) {
      //email
      const emailQuery = query(
        collection(db, "users"),
        where("email", "==", email)
      );

      try {
        const querySnapshot = await getDocs(emailQuery);
        if (querySnapshot.size === 0) {
          setEmailAlertContent(
            "We couldn't find an account with that username. Try another, or get a new Microsoft account."
          );
          setShowEmailAlert(true);
        } else {
          if (
            querySnapshot.docs[0]._document.data.value.mapValue.fields.provider
              ?.stringValue === "google"
          ) {
            setPasswordInfoContent(
              "This email is linked with Google. You can go back and sign-in with Google."
            );
            setShowPasswordInfo(true);
          }
          setShowPasswordTab(true);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      // password
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
        });
        setLocalStorageUser(userCredential.user.email);
        navigate("/");
      } catch (error) {
        if (error.code === "auth/invalid-login-credentials") {
          setPasswordAlertContent("Your account or password is incorrect.");
          setShowPasswordAlert(true);
          // If you don't remember your password, reset it now.
        } else if (error.code === "auth/missing-password") {
          // password empty
          setPasswordAlertContent("Please enter the password.");
          setShowPasswordAlert(true);
        }
        console.error(error);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // // redirect 사용 google login
      // setLocalStorageRedirect(true);
      // await signInWithRedirect(auth, googleProvider);

      // popup 사용 google login
      const signInResult = await signInWithPopup(auth, googleProvider);

      await setDoc(doc(db, "users", signInResult.user.uid), {
        email: signInResult.user.email,
        provider: "google",
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (showResetPassword) {
    return <ResetPassword email={email} />;
  }

  return (
    <div className="absolute h-full w-full flex flex-col items-center justify-center bg-ms-background ">
      <div
        className={`w-full h-full min-[600px]:w-[440px] min-[600px]:h-[380px] bg-white text-ms-text-dark `}
        style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
      >
        <div className="p-11 w-full h-full flex flex-col overflow-auto">
          <h2 className="text-xl font-medium pb-4 text-ms-light-text">
            Welcome!
          </h2>
          {!showSignInOptions ? (
            !showPasswordTab ? (
              <div className="flex flex-col">
                <h1 className="text-2xl font-semibold mb-2">Sign in</h1>
                {showEmailAlert && (
                  <p className="text-ms-alert-error">{emailAlertContent}</p>
                )}
                <input
                  type="email"
                  placeholder="Email"
                  className="pt-2 pb-1.5 border-b border-ms-scrollbar text-base pr-2.5 mb-4 focus:border-ms-blue"
                  onChange={emailInputHandler}
                  value={email}
                  autoFocus
                />
                <div className="flex text-sm text-ms-light-text mb-4">
                  <span>No account?</span>
                  <span
                    className="text-ms-blue-hover hover:underline hover:text-ms-light-text hover:cursor-pointer pl-1"
                    onClick={() => navigate("/user/signup")}
                  >
                    Create one!
                  </span>
                </div>
                {/* <span
                  className="text-sm text-ms-blue-hover hover:underline hover:text-ms-light-text hover:cursor-pointer"
                  onClick={sendEmailHandler}
                >
                  Can't access your account?
                </span> */}
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center">
                  <div>{email}</div>
                </div>
                <h1 className="text-2xl font-semibold mb-2">Enter password</h1>
                {showPasswordInfo && (
                  <p className="text-ms-blue">{passwordInfoContent}</p>
                )}
                {showPasswordAlert && (
                  <p className="text-ms-alert-error">{passwordAlertContent}</p>
                )}
                <input
                  className={`pt-2 pb-1.5 border-b  text-base pr-2.5 mb-4  ${
                    showPasswordAlert && passwordAlertContent !== ""
                      ? "border-ms-alert-error focus:border-ms-alert-error"
                      : "border-ms-scrollbar focus:border-ms-blue"
                  }`}
                  type={`${isShowPasswordChecked ? "text" : "password"}`}
                  name="password"
                  autoFocus
                  value={password}
                  onChange={passwordInputHandler}
                  placeholder="Password"
                />
                <div className="flex text-sm text-ms-light-text mb-4 justify-between">
                  <div className="flex">
                    <input
                      ref={checkboxRef}
                      className="w-5 h-5 mr-2 hover:cursor-pointer"
                      type="checkbox"
                      onChange={() =>
                        setIsShowPasswordChecked(!isShowPasswordChecked)
                      }
                    />
                    <span
                      className="hover:cursor-pointer"
                      onClick={() => checkboxRef.current.click()}
                    >
                      Show password
                    </span>
                  </div>
                  <span
                    className="text-sm text-ms-blue-hover hover:underline hover:text-ms-light-text hover:cursor-pointer"
                    onClick={() => setShowResetPassword(true)}
                  >
                    Reset password
                  </span>
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold mb-2">Sign-in options</h1>
              <div
                className="flex flex-col hover:bg-ms-white-hover hover:cursor-pointer py-3 px-11 ml-[-44px] mr-[-44px]"
                onClick={handleGoogleLogin}
              >
                <div className="flex flex-row">
                  <img
                    src={googleImg}
                    alt="goole logo"
                    className="w-10 h-10"
                  />
                  <div className="flex flex-col w-full px-3">
                    <p className="text-ms-text-dark font-medium">
                      Sign in with Google
                    </p>
                    <p className="text-ms-light-text text-sm">
                      Redirects to the sign in page
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end py-3 ">
            <button
              className="py-1 px-3 bg-ms-bg-border min-w-[108px] min-h-[32px] mr-2 hover:bg-ms-gray-button-hover"
              onClick={() => (window.location.pathname = "/user/signin")}
            >
              Back
            </button>
            <button
              className={`py-1 px-3 bg-ms-blue min-w-[108px] min-h-[32px] text-white hover:bg-ms-blue-hover ${
                nextButtonDisable &&
                "bg-ms-scrollbar hover:bg-ms-scrollbar hover:cursor-not-allowed"
              }`}
              onClick={nextButtonClickHandler}
              disabled={nextButtonDisable}
            >
              Next
            </button>
          </div>
        </div>
        {!showPasswordTab && !showSignInOptions && (
          <div
            className="min-[600px]:w-[440px] h-[48px] min-[600px]:relative 
            max-[599px]:relative
            max-[599px]:-mt-12
            max-[599px]:w-full 
            bg-white text-ms-text-dark mt-5 flex items-center hover:bg-ms-white-button-hover hover:bg-opacity-20 hover:cursor-pointer text-base"
            style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
            onClick={() => setShowSignInOptions(true)}
          >
            <div className="flex items-center ml-12">
              <BsKey
                size="30px"
                style={{ transform: "rotate(45deg)", paddingTop: "5px" }}
              />
              <span className="ml-2">Sign-in options</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
