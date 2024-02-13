import { MdKeyboardArrowRight } from "react-icons/md";
import {
  PiUserCircleThin,
  PiTrashThin,
  PiKeyThin,
  PiPasswordThin,
} from "react-icons/pi";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import profileImg from '../../../public/profile_image.svg'

const MyAccount = () => {
  const [localStorageUser, setLocalStorageUser] = useLocalStorage("user", null);

  const signOutHandler = () => {
    signOut(auth)
      .then(() => {
        setLocalStorageUser(null);
        window.location.pathname = "/user/signin";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changePasswordHandler = () => {
    window.location.pathname = "/myaccount/changepassword";
  };

  const updateProfileHandler = () => {
    window.location.pathname = "/myaccount/updateprofile";
  };

  const deleteAccountHandler = () => {
    window.location.pathname = "/myaccount/deleteaccount";
  };

  const registerPasswordHandler = () => {
    window.location.pathname = "/myaccount/registerpassword";
  };

  return (
    <div className="w-full h-full p-12 mx-auto max-w-[1680px] overflow-auto">
      <div className="m-6 grid gap-12 grid-cols-1 min-[640px]:grid-cols-2 min-[900px]:grid-cols-3 xl:grid-cols-4">
      {/* Profile */}
        <div
          className="min-[640px]:h-[600px] row-span-2 flex flex-col justify-between max-w-xs p-4 bg-white rounded"
          style={{
            boxShadow:
              "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 overflow-hidden rounded-full">
              {auth.currentUser.photoURL ? (
                <img
                  className="rounded-full"
                  src={auth.currentUser.photoURL}
                  alt="profile image"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img
                  className="rounded-full"
                  src={profileImg}
                  alt="profile image"
                />
              )}
            </div>
            {/* 중간에 통계 작성하면 좋을 듯 */}
            <div className="flex flex-col items-center my-2 ">
              <div className="text-2xl font-medium mb-2">
                {auth.currentUser.displayName ?? auth.currentUser.email}
              </div>
              <div className="font-normal mb-2">{auth.currentUser.email}</div>
            </div>
          </div>

          <div className="flex justify-center border-t pt-3 font-medium border-ms-bg-border text-ms-blue ">
            <button className="hover:underline" onClick={signOutHandler}>
              Sign out
            </button>
          </div>
        </div>

        {/* Update Profile */}
        <div
          className="flex flex-col max-w-xs p-4 bg-white rounded h-full row-span-1"
          style={{
            boxShadow:
              "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex flex-col items-center justify-between h-full mt-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-normal pb-4 max-[400px]:text-lg">
                Profile
              </div>

              <PiUserCircleThin
                className="text-ms-light-text scale-x-[-1]"
                size={"60px"}
              />

              <p className="py-3 text-center">
                Update your personal information.
              </p>
            </div>

            <div
              className="font-medium text-ms-blue flex hover:underline hover:cursor-pointer pb-2 pt-4 border-t"
              onClick={updateProfileHandler}
            >
              <span className="uppercase max-[400px]:text-sm">
                Update Profile
              </span>
              <span>
                <MdKeyboardArrowRight size={"22px"} />
              </span>
            </div>
          </div>
        </div>

        {/* Change Password */}
        {auth.currentUser.providerData.find(
          (item) => item.providerId === "password"
        ) && (
          <div
            className="flex flex-col max-w-xs p-4 bg-white rounded h-full row-span-1"
            style={{
              boxShadow:
                "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex flex-col items-center justify-between h-full mt-4">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-normal pb-4 max-[400px]:text-lg">
                  Change Password
                </div>
                <PiKeyThin
                  className="text-ms-light-text scale-x-[-1]"
                  size={"60px"}
                />
                <p className="py-3 text-center">
                  Make your password stronger, or change it if someone else
                  knows it.
                </p>
              </div>
              <div
                className="font-medium text-ms-blue flex hover:underline hover:cursor-pointer pb-2 pt-4  border-t"
                onClick={changePasswordHandler}
              >
                <span className="uppercase max-[400px]:text-xs">
                  Change Password
                </span>
                <span>
                  <MdKeyboardArrowRight size={"22px"} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Register Password */}
        {auth.currentUser.providerData.length === 1 &&
          auth.currentUser.providerData[0].providerId === "google.com" && (
            <div
              className="flex flex-col max-w-xs p-4 bg-white rounded h-full row-span-1 "
              style={{
                boxShadow:
                  "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex flex-col items-center justify-between h-full mt-4">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-normal pb-4 max-[400px]:text-lg">
                    Register Password
                  </div>

                  <PiPasswordThin
                    className="text-ms-light-text scale-x-[-1]"
                    size={"60px"}
                  />

                  <p className="py-3 text-center">
                    To enhance your experience and provide flexibility, you can
                    register a password for future logins.
                  </p>
                </div>
                <div
                  className="font-medium text-ms-blue flex hover:underline hover:cursor-pointer pb-2 pt-4 border-t"
                  onClick={registerPasswordHandler}
                >
                  <span className="uppercase max-[400px]:text-xs">
                    Register Password
                  </span>
                  <span>
                    <MdKeyboardArrowRight size={"22px"} />
                  </span>
                </div>
              </div>
            </div>
          )}

        {/* Delete Account */}
        <div
          className="flex flex-col max-w-xs p-4 bg-white rounded h-full row-span-1 "
          style={{
            boxShadow:
              "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex flex-col items-center justify-between h-full mt-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-normal pb-4 max-[400px]:text-lg">
                Delete Account
              </div>

              <PiTrashThin
                className="text-ms-light-text scale-x-[-1]"
                size={"60px"}
              />

              <p className="py-3 text-center">
                Delete your account. <br />
                You can't recover the data.
              </p>
            </div>
            <div
              className="font-medium text-ms-alert-error flex hover:underline hover:cursor-pointer pb-2 pt-4  border-t "
              onClick={deleteAccountHandler}
            >
              <span className="uppercase max-[400px]:text-xs">
                Delete Account
              </span>
              <span>
                <MdKeyboardArrowRight size={"22px"} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
