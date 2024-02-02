import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";


const ResetPassword = ({email}) => {
  const navigate = useNavigate();
  const [isEmailSent, setIsEmailSent] = useState(false);

  const clickCancelHandler = () => {
    window.location.pathname = "/user";
  };

  const submitResetPasswordHandler = (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setIsEmailSent(true)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (isEmailSent) {
    return (
      <div className="absolute w-full h-full flex justify-center items-center">
        <div
          className="p-8 px-10 bg-white rounded max-w-sm"
          style={{
            boxShadow:
              "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
          }}
        >
          <form className="flex flex-col m-6">
            <h1 className="text-2xl font-semibold mb-5 text-center">Email Sent</h1>
            <p className="mb-5 text-lg">{email}</p>
            <div className="flex justify-center items-center">
              <button
                className="w-full py-1.5 px-8 rounded-sm border bg-ms-blue text-white hover:bg-ms-blue-hover transition-colors"
                onClick={() => navigate("/user/signin")}
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
    <div className="absolute w-full h-full flex justify-center items-center">
      <div
        className="p-8 bg-white rounded max-w-sm"
        style={{
          boxShadow:
            "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
        }}
      >
        <form className="flex flex-col" onSubmit={submitResetPasswordHandler}>
          <h1 className="text-2xl font-normal mb-6">Change password</h1>
          <div className="mb-6">
            <p className="text-sm text-ms-light-text">
              Please enter your email to reset your password. You'll receive an
              email with instructions.
            </p>
          </div>
          <div className="mb-6">
            <label htmlFor="resetEmail" className="font-medium">
              Email
            </label>
            <p>{email}</p>
            {false && (
              <p className="text-ms-alert-error">
                Password is not correct. Please check and try again.
              </p>
            )}
          </div>

          <div className="flex">
            <button
              className="mr-6 py-1.5 px-8 rounded-sm border bg-ms-blue text-white hover:bg-ms-blue-hover transition-colors"
              type="submit"
            >
              Send email
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

export default ResetPassword;
