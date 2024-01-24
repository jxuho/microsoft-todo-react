import { useDispatch, useSelector } from "react-redux";
import {  MdKeyboardArrowRight } from "react-icons/md";
import { PiUserCircleThin,PiTrashThin,PiKeyThin } from "react-icons/pi";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { initializeUi } from "../../store/uiSlice";
import { initializeActive } from "../../store/activeSlice";
import { initializeSearch } from "../../store/searchSlice";
import { logout } from "../../store/authSlice";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const location = useLocation()
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
        window.location.pathname = "/user/signin";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changePasswordHandler = () => {
    // navigate("changepassword")
    window.location.pathname = "/myaccount/changepassword";
  }



  return (
    <div className="w-full h-full p-12 mx-auto max-w-[1680px] overflow-auto">
      <div className="m-6 grid gap-12 grid-cols-1 min-[640px]:grid-cols-2 min-[900px]:grid-cols-3 xl:grid-cols-4">
        <div
          className="min-[640px]:h-[600px] row-span-2 flex flex-col justify-between max-w-xs p-4 bg-white rounded"
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
            <div className="flex flex-col items-center my-2 ">
              <div className="text-2xl font-medium mb-2">
                {user.displayName ?? user.email}
              </div>
              <div className="font-normal mb-2">{user.email}</div>
            </div>
          </div>

          <div className="flex justify-center border-t pt-3 font-medium border-ms-bg-border text-ms-blue ">
            <button className="hover:underline" onClick={signOutHandler}>
              Sign out
            </button>
          </div>
        </div>

        <div
          className="flex flex-col max-w-xs p-4 bg-white rounded h-full row-span-1"
          style={{
            boxShadow:
              "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex flex-col items-center justify-between h-full mt-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-normal pb-4 max-[400px]:text-lg">Profile</div>

              <PiUserCircleThin
                className="text-ms-light-text scale-x-[-1]"
                size={"60px"}
              />

              <p className="py-3 text-center">
                Update your personal information.
              </p>
            </div>

            <div className="font-medium text-ms-blue flex hover:underline hover:cursor-pointer pb-2 pt-4 border-t">
              <span className="uppercase max-[400px]:text-sm">Update Profile</span>
              <span>
                <MdKeyboardArrowRight size={"22px"} />
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col max-w-xs p-4 bg-white rounded h-full row-span-1"
          style={{
            boxShadow:
              "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex flex-col items-center justify-between h-full mt-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-normal pb-4 max-[400px]:text-lg">Password</div>
              <PiKeyThin
                className="text-ms-light-text scale-x-[-1]"
                size={"60px"}
              />
              <p className="py-3 text-center">
                Make your password stronger, or change it if someone else knows
                it.
              </p>
            </div>
            <div className="font-medium text-ms-blue flex hover:underline hover:cursor-pointer pb-2 pt-4  border-t"
              onClick={changePasswordHandler}
            >
              <span className="uppercase max-[400px]:text-xs">Change Password</span>
              <span>
                <MdKeyboardArrowRight size={"22px"} />
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col max-w-xs p-4 bg-white rounded h-full row-span-1 "
          style={{
            boxShadow:
              "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex flex-col items-center justify-between h-full mt-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-normal pb-4 max-[400px]:text-lg">Delete Account</div>

              <PiTrashThin
                className="text-ms-light-text scale-x-[-1]"
                size={"60px"}
              />

              <p className="py-3 text-center">
                Delete your account. <br />
                You can't recover the data.
              </p>
            </div>
            <div className="font-medium text-ms-alert-error flex hover:underline hover:cursor-pointer pb-2 pt-4  border-t ">
              <span className="uppercase max-[400px]:text-xs">Delete Account</span>
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

/**
 * TODO
 * 
 * myaccount route의 children으로 changepassword, profile route render하는 것 생각해보기
 * 만약 changepassword page가 myaccount의 children이 된다면, myaccount에서 render되는 내용을 outlet인 changepassword가 덮어써야 한다
 * 
 * google로 로그인 했을 때, 개인정보 변경버튼 비활성화 해야 함
 * 
 * 
 */