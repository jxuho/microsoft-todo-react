import { useEffect, useRef } from "react";
import { useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
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

const SignUp = () => {
  const [email, setEmail] = useState(
    window.localStorage.getItem("emailForSignIn") ?? ""
  );
  const [currentView, setCurrentView] = useState("email");

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
      } else {
        // window.localStorage.removeItem('emailForSignIn');

        // email 인증 로그인을 진행하지 않고, password tab으로 전환함
        // TODO: 보안 문제 발생할 수 있음
        setCurrentView("password");
      }
    }
  }, []);

  return (
    <div>
      {currentView === "email" && (
        <SignUpEmail
          setCurrentView={setCurrentView}
          setEmail={setEmail}
          email={email}
        />
      )}
      {currentView === "verifyEmail" && (
        <VerifyEmail setCurrentView={setCurrentView} email={email} />
      )}
      {currentView === "password" && (
        <SignUpPassword setCurrentView={setCurrentView} />
      )}
    </div>
  );
};

export default SignUp;


const SignUpEmail = ({ setCurrentView, setEmail, email }) => {
  const navigate = useNavigate();

  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [emailAlertContent, setEmailAlertContent] = useState("");
  const [isEmailExist, setIsEmailExist] = useState(false);

  useEffect(() => {
    if (auth && auth.currentUser) {
      navigate("/");
    }
  }, [auth, navigate]);

  useEffect(() => {
    const handleEnterKeyPress = (event) => {
      if (event.key === "Enter") {
        nextButtonClickHandler();
      }
    };
    document.addEventListener("keydown", handleEnterKeyPress);
    return () => document.removeEventListener("keydown", handleEnterKeyPress);
  }, [email]);

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

  const nextButtonClickHandler = async () => {
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
        // GOTO PASSWORD TAB
        setCurrentView("verifyEmail");
      }
    } catch (error) {
      console.log(error);
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

          <div className="flex justify-end">
            <button
              className="py-1 px-3 bg-ms-bg-border min-w-[108px] min-h-[32px] mr-2 hover:bg-ms-gray-button-hover"
              onClick={() => navigate(-1)}
            >
              Back
            </button>

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

const VerifyEmail = ({ setCurrentView, email }) => {
  const navigate = useNavigate();
  const [buttonMessage, setButtonMessage] = useState("Send Email")
  const [errorMessage, setErrorMessage] = useState("")
  const [showErrorMessage, setShowErrorMessage] = useState(false)

  const actionCodeSettings = {
    // TODO: 배포 후 수정 필요
    url: "https://ms-todo-clone-9156d.web.app/user/signup",
    handleCodeInApp: true,
  };

  const sendEmailHandler = async () => {
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setButtonMessage("Email Sent")
    } catch (error) {
      console.log(error.message);
      if (error.message.includes("auth/quota-exceeded")) {
        setButtonMessage("Error");
        setErrorMessage("The sign-up limit for today has been exceeded. Please try again tomorrow. Alternatively, you can sign up using your Google account.")
        setShowErrorMessage(true)
      }
    }
  };

  useEffect(() => {
    if (auth && auth.currentUser) {
      navigate("/");
    }
  }, [auth, navigate]);

  useEffect(() => {
    const handleEnterKeyPress = (event) => {
      if (event.key === "Enter") {
        sendEmailHandler();
      }
    };
    document.addEventListener("keydown", handleEnterKeyPress);
    return () => document.removeEventListener("keydown", handleEnterKeyPress);
  }, [email]);

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

          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold mb-2">
              Send Verification Email
            </h1>
            <p className="pt-2 pb-1.5 border-b  text-base pr-2.5 mb-4">
              {email}
            </p>
          </div>

          {showErrorMessage && (
              <p className="text-ms-alert-error">{errorMessage}</p>
            )}

          <div className="flex justify-end mt-6">
            <button
              className="py-1 px-3 bg-ms-bg-border min-w-[108px] min-h-[32px] mr-2 hover:bg-ms-gray-button-hover"
              onClick={() => setCurrentView("email")}
            >
              Back
            </button>

            <button
              className={`py-1 px-3 bg-ms-blue min-w-[108px] min-h-[32px] text-white hover:bg-ms-blue-hover hover:underline disabled:bg-ms-scrollbar disabled:hover:cursor-default disabled:no-underline`}
              onClick={sendEmailHandler}
              disabled={buttonMessage!=="Send Email"}
            >
              {buttonMessage}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignUpPassword = ({ setCurrentView }) => {
  const navigate = useNavigate();
  let email = window.localStorage.getItem("emailForSignIn");
  const [password, setPassword] = useState("");
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const [passwordAlertContent, setPasswordAlertContent] = useState("");
  const [isShowPasswordChecked, setIsShowPasswordChecked] = useState(false);

  const checkboxRef = useRef();

  useEffect(() => {
    if (auth && auth.currentUser) {
      navigate("/");
    }
  }, [auth, navigate]);

  useEffect(() => {
    const handleEnterKeyPress = (event) => {
      if (event.key === "Enter") {
        nextButtonClickHandler();
      }
    };
    document.addEventListener("keydown", handleEnterKeyPress);
    return () => document.removeEventListener("keydown", handleEnterKeyPress);
  }, [password]);

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

  const nextButtonClickHandler = async () => {
    console.log("nextbutton trigger");
    console.log(email);
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
      window.localStorage.removeItem("emailForSignIn");
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
      });

      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.message.includes("auth/email-already-in-use")) {
        setPasswordAlertContent(
          "It looks like you've already linked your account with this email address through Google. Please login through Google."
        );
        setShowPasswordAlert(true);
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

          <div className="flex flex-col">
            <div className="flex items-center">
              <div
                className="p-1 mr-1 rounded-full border-none hover:bg-ms-button-hover hover:cursor-pointer transition-colors duration-150"
                onClick={() => setCurrentView("email")}
              >
                <BsArrowLeft />
              </div>
              <div>{email}</div>
            </div>
            <h1 className="text-2xl font-semibold mb-2">Create a password</h1>
            {showPasswordAlert ? (
              <p className="text-ms-alert-error">{passwordAlertContent}</p>
            ) : (
              <p>Enter the password you would like to use with your account.</p>
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

          <div className="flex justify-end">
            <button
              className="py-1 px-3 bg-ms-blue min-w-[108px] min-h-[32px] text-white hover:bg-ms-blue-hover hover:underline"
              onClick={nextButtonClickHandler}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};