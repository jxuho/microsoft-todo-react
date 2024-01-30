import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showMessage, setShowMessage] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
    changeSuccess: false,
    fillRequired: false,
  });

  const oldPasswordChangeHandler = (e) => {
    setOldPassword(e.target.value);
    if (e.target.value === "") {
      setShowMessage({ ...showMessage, oldPassword: false });
    }
    if (showMessage.fillRequired) {
      setShowMessage((prevState) => ({ ...prevState, fillRequired: false }));
    }
  };

  const createNewPasswordChangeHandler = (e) => {
    setNewPassword(e.target.value);
    if (e.target.value === "") {
      setShowMessage({ ...showMessage, newPassword: false });
    }
    if (showMessage.fillRequired) {
      setShowMessage((prevState) => ({ ...prevState, fillRequired: false }));
    }
  };

  const confirmNewPasswordChangeHandler = (e) => {
    setConfirmPassword(e.target.value);
    if (showMessage.confirmPassword) {
      setShowMessage({ ...showMessage, confirmPassword: false });
    }
    if (e.target.value === "") {
      setShowMessage({ ...showMessage, confirmPassword: false });
    }
    if (showMessage.fillRequired) {
      setShowMessage((prevState) => ({ ...prevState, fillRequired: false }));
    }
  };

  useEffect(() => {
    const debounceNewPassword = setTimeout(() => {
      const passwordRegex =
        /^(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[!@#$%^&*()_+={}[\]:;<>,.?~\\/-]){2,}).{8,}$/;
      if (newPassword !== "" && !passwordRegex.test(newPassword)) {
        setShowMessage((prevState) => ({
          ...prevState,
          newPassword: true,
        }));
      } else {
        setShowMessage((prevState) => ({
          ...prevState,
          newPassword: false,
        }));
      }
    }, 1000);
    return () => clearTimeout(debounceNewPassword);
  }, [newPassword]);

  useEffect(() => {
    const debounceConfirmPassword = setTimeout(() => {
      if (confirmPassword !== "" && newPassword !== confirmPassword) {
        setShowMessage((prevState) => ({
          ...prevState,
          confirmPassword: true,
        }));
      } else {
        setShowMessage((prevState) => ({
          ...prevState,
          confirmPassword: false,
        }));
      }
    }, 1000);
    return () => clearTimeout(debounceConfirmPassword);
  }, [confirmPassword]);

  const submitNewPasswordHandler = (e) => {
    e.preventDefault();

    if (showMessage.oldPassword || showMessage.newPassword || showMessage.confirmPassword) {
      return
    }

    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
      setShowMessage((prevState) => ({ ...prevState, fillRequired: true }));
      return;
    }

    const user = auth.currentUser;

    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      oldPassword
    );

    reauthenticateWithCredential(user, credential)
      .then(() => {
        console.log("re-authenticated");

        // new password check
        const passwordRegex =
          /^(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[!@#$%^&*()_+={}[\]:;<>,.?~\\/-]){2,}).{8,}$/;
        if (!passwordRegex.test(confirmPassword)) {
          throw new Error(
            "Password does not meet the required criteria. Please check the rules."
          );
        }

        updatePassword(user, confirmPassword).then(() => {
          console.log("success password change");

          setShowMessage((prevState) => ({
            ...prevState,
            changeSuccess: true,
          }));
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        });
      })
      .catch((error) => {
        console.log(error.message);
        if (error.message.includes("auth/invalid-login-credentials")) {
          setShowMessage((prevState) => ({
            ...prevState,
            oldPassword: true,
          }));
        }
      });
  };

  const clickCancelHandler = () => {
    window.location.pathname = "/myaccount";
  };

  if (auth.currentUser.providerData[0].providerId !== "password") {
    return <Navigate to={"/myaccount"}/>
  }


  if (showMessage.changeSuccess) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div
          className="p-8 bg-white rounded max-w-sm"
          style={{
            boxShadow:
              "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
          }}
        >
          <form
            className="flex flex-col m-6"
          >
            <h1 className="text-xl font-normal mb-10">Password is successfully changed</h1>

            <div className="flex justify-center items-center">
              <button
                className="py-1.5 px-8 rounded-sm border bg-ms-blue text-white hover:bg-ms-blue-hover transition-colors"
                onClick={() => navigate("/myaccount")}
              >
                Ok
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
        <form className="flex flex-col" onSubmit={submitNewPasswordHandler}>
          <h1 className="text-2xl font-normal mb-6">Change password</h1>
          <div className="mb-6">
            <p className="text-xs text-ms-light-text">
              Strong password required. Passwords must have at least 8
              characters and contain at least two of the following: uppercase
              letters, lowercase letters, numbers, and symbols.
            </p>
          </div>
          <div className="mb-6">
            <label htmlFor="currentPassword" className="font-medium">
              Old password
            </label>
            <input
              value={oldPassword}
              type="password"
              id="currentPassword"
              className="border mt-1 bg-transparent"
              onChange={oldPasswordChangeHandler}
            />
            {showMessage.oldPassword && (
              <p className="text-ms-alert-error">
                Password is not correct. Please check and try again.
              </p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="newPassword" className="font-medium">
              Create new password
            </label>
            <input
              value={newPassword}
              type="password"
              id="newPassword"
              className="border mt-1 bg-transparent"
              onChange={createNewPasswordChangeHandler}
            />
            {showMessage.newPassword && (
              <p className="text-ms-alert-error">
                Password does not meet the required criteria. Please check the
                rules.
              </p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="font-medium">
              Confirm new password
            </label>
            <input
              value={confirmPassword}
              type="password"
              id="confirmPassword"
              className="border mt-1 bg-transparent"
              onChange={confirmNewPasswordChangeHandler}
            />
            {showMessage.confirmPassword && (
              <p className="text-ms-alert-error">
                Passwords do not match. Please try again.
              </p>
            )}
          </div>
          {showMessage.fillRequired && (
            <p className="text-ms-alert-error mb-4">
              Please fill in all the required fields.
            </p>
          )}

          <div className="flex">
            <button
              className="mr-6 py-1.5 px-8 rounded-sm border bg-ms-blue text-white hover:bg-ms-blue-hover transition-colors"
              type="submit"
            >
              Submit
            </button>
            <button
              className="text-ms-blue py-1.5 hover:underline"
              onClick={clickCancelHandler}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



export default ChangePassword;

