import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

/**
 * 

 * 
 * 
 * 
 * 
 * 
 */
const RegisterPassword = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const googleProvider = new GoogleAuthProvider();

  const [showPasswordMessage, setShowPasswordMessage] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const [showAuthErrMessage, setShowAuthErrMessage] = useState(false);

  const [reAuthenticated, setReAuthenticated] = useState(false);

  const [credential, setCredential] = useState();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userToDelete = auth.currentUser?.email;

  const reAuthenticateHandler = async () => {
    console.log("submit trigger");

    try {
      if (auth.currentUser?.providerData[0].providerId === "google.com") {
        const signInResult = await signInWithPopup(auth, googleProvider);
        const userCredential =
          GoogleAuthProvider.credentialFromResult(signInResult);
        const token = userCredential.accessToken;

        console.log(userCredential);
        console.log(token);

        setCredential(userCredential);

        // 동일한 계정이 아니면 return
        if (signInResult.user.email !== userToDelete) {
          console.log("user information is not matched");
          setIsLoading(false);
          setShowAuthErrMessage(true);
          // 다른 계정으로 로그인되면 firestore에는 내용 생성 안됨
          // 다만, auth에 다른 계정 생성됨
          await signOut(auth);
          dispatch(logout());
          window.location.pathname = "/user/signin";

          return;
        }
        setReAuthenticated(true);
      }
    } catch (error) {
      console.log(error);
      if (error.message.includes("auth")) {
        // check your email and password message
        setShowAuthErrMessage(true);
      }
    }
  };

  const registerPasswordHandler = async () => {
    try {
      const passwordRegex =
        /^(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[!@#$%^&*()_+={}[\]:;<>,.?~\\/-]){2,}).{8,}$/;
      if (!passwordRegex.test(confirmPassword)) {
        throw new Error(
          "Password does not meet the required criteria. Please check the rules."
        );
      }


      // const credential = EmailAuthProvider.credential(auth.currentUser.email, password);

      const userCredential = await linkWithCredential(auth.currentUser, credential)
          const user = userCredential.user;
          console.log("Account linking success", user);

      /** 
       * TODO: email & google link 해결하기
       * 
       * 
       */



    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const debounceNewPassword = setTimeout(() => {
      const passwordRegex =
        /^(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[!@#$%^&*()_+={}[\]:;<>,.?~\\/-]){2,}).{8,}$/;
      if (password !== "" && !passwordRegex.test(password)) {
        setPasswordMessage(
          "Password does not meet the required criteria. Please check the rules."
        );
        setShowPasswordMessage(true);
      } else {
        setShowPasswordMessage(false);
      }
    }, 1000);
    return () => clearTimeout(debounceNewPassword);
  }, [password]);

  useEffect(() => {
    const debounceConfirmPassword = setTimeout(() => {
      if (confirmPassword !== "" && password !== confirmPassword) {
        setPasswordMessage("Passwords do not match. Please try again.");
        setShowPasswordMessage(true);
      } else {
        setShowPasswordMessage(false);
      }
    }, 1000);
    return () => clearTimeout(debounceConfirmPassword);
  }, [confirmPassword]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!reAuthenticated) {
      reAuthenticateHandler();
    } else {
      registerPasswordHandler();
    }
  };

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
              To enhance security and provide flexibility, you can register a
              new password for this account. Once registered, you'll have the
              option to log in using either your Google account or your email
              and password.
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
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
