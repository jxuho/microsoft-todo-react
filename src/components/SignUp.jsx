import { useEffect, useRef } from "react";
import { useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [emailAlertContent, setEmailAlertContent] = useState("");
  const [isEmailExist, setIsEmailExist] = useState(false);

  const [showPasswordTab, setShowPasswordTab] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const [passwordAlertContent, setPasswordAlertContent] = useState("");
  const [isShowPasswordChecked, setIsShowPasswordChecked] = useState(false);

  const checkboxRef = useRef();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleEnterKeyPress = (event) => {
      if (event.key === "Enter") {
        nextButtonClickHandler();
      }
    };
    document.addEventListener("keydown", handleEnterKeyPress);
    return () => document.removeEventListener("keydown", handleEnterKeyPress);
  }, [email, password]);

  ///////////////////////////////
  const emailInputHandler = (e) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    if (showEmailAlert) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) {
        setEmailAlertContent("An email address is required");
      } else if (!emailRegex.test(email)) {
        setEmailAlertContent(
          "Enter the email address in the format someone@example.com."
        );
      } else if (emailRegex.test(email) && !isEmailExist) {
        setEmailAlertContent("");
      }
    }
  }, [email, showEmailAlert]);

  ///////////////////////////////

  const passwordInputHandler = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    if (showPasswordAlert) {
      const passwordRegex =
        /^(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[!@#$%^&*()_+={}[\]:;<>,.?~\\/-]){2,}).{8,}$/;
      if (!password.trim()) {
        setPasswordAlertContent("A password is required");
      } else if (!passwordRegex.test(password)) {
        setPasswordAlertContent(
          "Passwords must have at least 8 characters and contain at least two of the following: uppercase letters, lowercase letters, numbers, and symbols."
        );
      }
    }
  }, [password, showPasswordAlert]);

  ///////////////////////////////

  const nextButtonClickHandler = async () => {
    if (!showPasswordTab) {
      // email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setShowEmailAlert(true);
        return;
      }
      const emailQuery = query(
        collection(db, "users"),
        where("email", "==", email)
      );

      try {
        const querySnapshot = await getDocs(emailQuery);
        if (querySnapshot.size > 0) {
          setIsEmailExist(true);
          setShowEmailAlert(true);
          setEmailAlertContent(
            `${email} is already a Microsoft account. Please try a different email address.`
          );
        } else {
          setShowPasswordTab(true);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      // password
      const passwordRegex =
        /^(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[!@#$%^&*()_+={}[\]:;<>,.?~\\/-]){2,}).{8,}$/;
      if (!passwordRegex.test(password)) {
        setShowPasswordAlert(true);
        return;
      }
      setShowPasswordAlert(false);

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        dispatch(
          login({
            email: userCredential.user.email,
            uid: userCredential.user.uid,
            displayName: userCredential.user.displayName,
            photoUrl: userCredential.user.photoURL,
          })
        );

        await setDoc(doc(db, "users", user.uid), { email: user.email });

        // signup 성공했을 때, Firestore 초기 configuration

        // const sorDocRef = doc(db, `users/${user.uid}/preference`, "sortDoc");
        // await setDoc(
        //   sorDocRef,
        //   {
        //     myday: { sortBy: "", order: "descending" },
        //     important: { sortBy: "", order: "descending" },
        //     completed: { sortBy: "", order: "descending" },
        //     tasks: { sortBy: "", order: "descending" },
        //     search: { sortBy: "", order: "descending" },
        //   },
        //   { merge: true }
        // );




        // const uiDocRef = doc(db, `users/${user.uid}/preference`, "uiDoc");
        // await setDoc(
        //   uiDocRef,
        //   {
        //     detailWidth: 360,
        //     theme: "light",
        //   },
        //   { merge: true }
        // );

        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="absolute h-full w-full flex flex-col items-center justify-center bg-ms-background">
      <div
        className="w-full max-[600px]:h-full min-[601px]:max-w-[440px] min-[601px]:min-h-[338px] bg-white text-ms-text-dark"
        style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
      >
        <div className="p-11 w-full h-full flex flex-col relative">
          <h2 className="text-xl font-medium pb-4 text-ms-light-text">
            Welcome!
          </h2>

          {!showPasswordTab ? (
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold mb-2">Create account</h1>
              {showEmailAlert && (
                <p className="text-ms-alert-error">{emailAlertContent}</p>
              )}
              <input
                className={`pt-2 pb-1.5 border-b  text-base pr-2.5 mb-4  ${
                  showEmailAlert && emailAlertContent !== ""
                    ? "border-ms-alert-error focus:border-ms-alert-error"
                    : "border-ms-scrollbar focus:border-ms-blue"
                }`}
                type="text"
                name="email"
                value={email}
                onChange={emailInputHandler}
                placeholder="someone@example.com"
                autoFocus
              />
              <div className="flex text-sm text-ms-light-text mb-4">
                <span>Already have an account?</span>
                <span
                  className="text-ms-blue-hover hover:underline hover:text-ms-light-text hover:cursor-pointer pl-1"
                  onClick={() => navigate("/user/signin")}
                >
                  Sign in
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center">
                <div
                  className="p-1 mr-1 rounded-full border-none hover:bg-ms-button-hover hover:cursor-pointer transition-colors duration-150"
                  onClick={() => setShowPasswordTab(false)}
                >
                  <BsArrowLeft />
                </div>
                <div>{email}</div>
              </div>
              <h1 className="text-2xl font-semibold mb-2">Create a password</h1>
              {showPasswordAlert ? (
                <p className="text-ms-alert-error">{passwordAlertContent}</p>
              ) : (
                <p>
                  Enter the password you would like to use with your account.
                </p>
              )}
              <input
                className={`pt-2 pb-1.5 border-b  text-base pr-2.5 mb-4  ${
                  showPasswordAlert && passwordAlertContent !== ""
                    ? "border-ms-alert-error focus:border-ms-alert-error"
                    : "border-ms-scrollbar focus:border-ms-blue"
                }`}
                type={`${isShowPasswordChecked ? "text" : "password"}`}
                name="password"
                value={password}
                onChange={passwordInputHandler}
                placeholder="Create password"
                autoFocus
              />
              <div className="flex text-sm text-ms-light-text mb-4">
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
            </div>
          )}

          <div className="flex justify-end">
            {!showPasswordTab && (
              <button
                className="py-1 px-3 bg-ms-bg-border min-w-[108px] min-h-[32px] mr-2 hover:bg-ms-gray-button-hover"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            )}
            <button
              className="py-1 px-3 bg-ms-blue min-w-[108px] min-h-[32px] text-white hover:bg-ms-blue-hover hover:underline"
              onClick={nextButtonClickHandler}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
