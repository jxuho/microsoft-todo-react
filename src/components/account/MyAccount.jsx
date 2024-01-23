import { useDispatch, useSelector } from "react-redux";
import { LuKeyRound } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { MdDeleteOutline, MdKeyboardArrowRight } from "react-icons/md";
import { PiUserCircleThin } from "react-icons/pi";
import { PiTrashThin } from "react-icons/pi";
import { PiKeyThin } from "react-icons/pi";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { initializeUi } from "../../store/uiSlice";
import { initializeActive } from "../../store/activeSlice";
import { initializeSearch } from "../../store/searchSlice";
import { logout } from "../../store/authSlice";
/**
 *
 *
 *
 * 계정 삭제
 * 비밀번호 변경
 * 사진 등록/변경
 * 이름 등록/변경
 *
 *
 * 버튼 하나당 기능 하나로 설정
 * hover하면 animation 출력
 * change password
 * delete account
 *
 *
 */
const MyAccount = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user);
  const [localStorageUser, setLocalStorageUser] = useLocalStorage("user", null);


  const signOutHandler = () => {
    signOut(auth)
      .then(() => {
        dispatch(logout());

        setLocalStorageUser(null);
        dispatch(initializeUi());
        dispatch(initializeActive());
        dispatch(initializeSearch());

        // navigate('/user/signin')
        // window.location.pathname = "/user/signin";
      })
      .catch((error) => {
        console.log(error);
      });
  };



  
  return (
    <div className="w-full h-full p-12 mx-auto max-w-[1680px] overflow-auto">
      <div className="m-6 grid gap-12 grid-cols-1 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3 xl:grid-cols-4">
        <div
          className="h-[600px] row-span-2 flex flex-col justify-between max-w-xs p-4 bg-white rounded"
          style={{
            boxShadow:
              "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex flex-col items-center">
            <div className="w-20 h-20">
              {user.photoUrl ? (
                <img
                  className="rounded-full"
                  src={user.photoUrl}
                  alt="profile image"
                />
              ) : (
                <img
                  className="rounded-full"
                  src="/public\profile_image.svg"
                  alt="profile image"
                />
              )}
            </div>
            {/* 중간에 통계 작성하면 좋을 듯 */}
            <div className="flex flex-col items-center my-2 border-b border-ms-bg-border">
              <div className="text-2xl font-medium mb-2">
                {user.displayName ?? user.email}
              </div>
              <div className="font-normal mb-2">{user.email}</div>
            </div>
          </div>

          <div className="flex justify-center border-t pt-3 font-medium border-ms-bg-border text-ms-blue ">
            <button className="hover:underline" onClick={signOutHandler}>Sign out</button>
          </div>
        </div>

        <div
          className="flex flex-col max-w-xs p-4 bg-white rounded h-full"
          style={{
            boxShadow:
              "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex flex-col items-center justify-between h-full mt-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-normal pb-4">Profile</div>

              <PiUserCircleThin
                className="text-ms-light-text scale-x-[-1]"
                size={"60px"}
              />

              <p className="py-3 text-center">Update your personal information.</p>
            </div>

            <div className="font-medium text-ms-blue flex hover:underline hover:cursor-pointer pb-2">
              <span>UPDATE PROFILE</span>
              <span>
                <MdKeyboardArrowRight size={"22px"} />
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col max-w-xs p-4 bg-white rounded h-full"
          style={{
            boxShadow:
              "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex flex-col items-center justify-between h-full mt-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-normal pb-4">Password</div>
              <PiKeyThin
                className="text-ms-light-text scale-x-[-1]"
                size={"60px"}
              />
              <p className="py-3 text-center">
                Make your password stronger, or change it if someone else knows
                it.
              </p>
            </div>
            <div className="font-medium text-ms-blue flex hover:underline hover:cursor-pointer pb-2">
              <span>CHANGE PASSWORD</span>
              <span>
                <MdKeyboardArrowRight size={"22px"} />
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col max-w-xs p-4 bg-white rounded h-full"
          style={{
            boxShadow:
              "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex flex-col items-center justify-between h-full mt-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-normal pb-4">Delete Account</div>

              <PiTrashThin
                className="text-ms-light-text scale-x-[-1]"
                size={"60px"}
              />

              <p className="py-3 text-center">
                Delete your account. <br />You can't recover the data.
              </p>
            </div>
            <div className="font-medium text-ms-alert-error flex hover:underline hover:cursor-pointer pb-2">
              <span>DELETE ACCOUNT</span>
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
