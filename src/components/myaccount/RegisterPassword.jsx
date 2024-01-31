import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import {
  GoogleAuthProvider,
  reauthenticateWithCredential,
  signInWithPopup,
  signOut,
  updatePassword,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import Loading from "../Loading";
import { Navigate } from "react-router-dom";

const RegisterPassword = () => {
  const dispatch = useDispatch();
  const googleProvider = new GoogleAuthProvider();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [showPasswordMessage, setShowPasswordMessage] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const [showAuthErrMessage, setShowAuthErrMessage] = useState(false);

  const [reAuthenticated, setReAuthenticated] = useState(false);

  const [credential, setCredential] = useState();

  const userToDelete = auth.currentUser?.email;

  const passwordInputHandler = (e) => {
    setPassword(e.target.value);
  };
  const confirmPasswordInputHandler = (e) => {
    setConfirmPassword(e.target.value);
  };

  const reAuthenticateHandler = async () => {
    setIsLoading(true);
    try {
      if (
        auth.currentUser.providerData.length === 1 &&
        auth.currentUser.providerData[0].providerId === "google.com"
      ) {
        const signInResult = await signInWithPopup(auth, googleProvider);
        const userCredential =
          GoogleAuthProvider.credentialFromResult(signInResult);
        const token = userCredential.accessToken;

        
        // 동일한 계정이 아니면 return
        if (signInResult.user.email !== userToDelete) {
          console.log("user information is not matched");
          setIsLoading(false);
          setShowAuthErrMessage(true);
          await signOut(auth);
          dispatch(logout());
          window.location.pathname = "/user/signin";
          return;
        }
        
        setCredential(userCredential);
        setReAuthenticated(true);
      }
    } catch (error) {
      console.log(error);
      if (error.message.includes("auth")) {
        // check your email and password message
        setShowAuthErrMessage(true);
      }
    }
    setIsLoading(false);
  };

  const registerPasswordHandler = async () => {
    if (password === "" || confirmPassword === "") {
      setPasswordMessage("Please fill in all the required fields.");
      setShowPasswordMessage(true);
      return;
    }
    try {
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, confirmPassword);
      console.log("success register password");
      window.location.pathname = "/myaccount";
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const debounceConfirmPassword = setTimeout(() => {
      const passwordRegex =
        /^(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[!@#$%^&*()_+={}[\]:;<>,.?~\\/-]){2,}).{8,}$/;
      if (password !== "" && !passwordRegex.test(password)) {
        setPasswordMessage(
          "Password does not meet the required criteria. Please check the rules."
        );
        setShowPasswordMessage(true);
      } else if (confirmPassword !== "" && password !== confirmPassword) {
        setPasswordMessage("Passwords do not match.");
        setShowPasswordMessage(true);
      } else {
        setShowPasswordMessage(false);
      }
    }, 500);
    return () => clearTimeout(debounceConfirmPassword);
  }, [password, confirmPassword]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!reAuthenticated) {
      reAuthenticateHandler();
    } else {
      registerPasswordHandler();
    }
  };

  if (
    !(
      auth.currentUser.providerData.length === 1 &&
      auth.currentUser.providerData[0].providerId === "google.com"
    )
  ) {
    console.log("Can't access to this route");
    return <Navigate to={"/myaccount"} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        className="p-8 bg-white rounded max-w-sm"
        style={{
          boxShadow:
            "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
        }}
      >
        <form className="flex flex-col" onSubmit={submitHandler}>
          <h1 className="text-2xl font-normal mb-6">Register password</h1>
          <div className="mb-6">
            <p className="text-sm text-ms-light-text">
              Your current account is signed in using your Google account.
              <br />
              You can register a password here.
              <br />
              Once registered, you'll have the option to log in using either
              your Google account or your email and password.
              <br />
              <br />
              Strong password required. Passwords must have at least 8
              characters and contain at least two of the following: uppercase
              letters, lowercase letters, numbers, and symbols.
            </p>
          </div>
          {!reAuthenticated && (
            <p className="text-base text-ms-blue mb-6">
              Before proceed, you should sign-in again.
            </p>
          )}

          {showAuthErrMessage && (
            <p className="text-ms-alert-error">
              Account information is not correct
            </p>
          )}

          {reAuthenticated && (
            <div>
              <div className="mb-6">
                {showPasswordMessage && (
                  <p className="text-ms-alert-error mb-2">{passwordMessage}</p>
                )}
                <label htmlFor="registerdPasssword" className="font-medium">
                  Password
                </label>
                <input
                  value={password}
                  type="password"
                  id="registerdPasssword"
                  className="border mt-1 bg-transparent"
                  onChange={passwordInputHandler}
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirmRegisteredPassword"
                  className="font-medium"
                >
                  Confirm password
                </label>
                <input
                  value={confirmPassword}
                  type="password"
                  id="confirmRegisteredPassword"
                  className="border mt-1 bg-transparent"
                  onChange={confirmPasswordInputHandler}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end ">
            <button
              className="bg-ms-input-hover font-semibold py-2 px-3 w-auto h-auto rounded hover:bg-gray-200 transition-colors"
              style={{ color: "#34373d" }}
              onClick={() => (window.location.pathname = "/myaccount")}
              type="button"
            >
              Cancel
            </button>
            <button
              className={`ml-2 font-semibold py-2 px-3 w-auto h-auto rounded text-white 
                  bg-ms-blue hover:bg-ms-blue-hover
              transition-colors disabled:bg-ms-scrollbar disabled:hover:cursor-not-allowed`}
              type="submit"
            >
              {reAuthenticated ? "Register Password" : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPassword;
