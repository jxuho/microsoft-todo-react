import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProtectedLayout from "./components/ProtectedLayout";
import { Suspense, lazy } from "react";
import Loading from "./components/Loading";
import ChangePassword from "./components/myaccount/ChangePassword";
import UpdateProfile from "./components/myaccount/UpdateProfile";
import DeleteAccount from "./components/myaccount/DeleteAccount";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPassword from "./components/myaccount/RegisterPassword";

const RootPage = lazy(() => import("./pages/RootPage"));
const MydayPage = lazy(() => import("./pages/MydayPage"));
const ImportantPage = lazy(() => import("./pages/ImportantPage"));
const PlannedPage = lazy(() => import("./pages/PlannedPage"));
const CompletedPage = lazy(() => import("./pages/CompletedPage"));
const InboxPage = lazy(() => import("./pages/InboxPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const MyAccountPage = lazy(() => import("./pages/MyAccountPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <RootPage />
      </Suspense>
    ),
    children: [
      {
        index: true,
        loader: () => redirect("today"),
      },
      {
        path: "today",
        element: <MydayPage />,
      },
      {
        path: "myday",
        element: <MydayPage />,
      },
      {
        path: "important",
        element: <ImportantPage />,
      },
      {
        path: "planned",
        element: <PlannedPage />,
      },
      {
        path: "completed",
        element: <CompletedPage />,
      },
      {
        path: "inbox",
        element: <InboxPage />,
      },
      {
        path: "search/:query?",
        element: <SearchPage />,
      },
      {
        path: "/myaccount",
        children: [
          {
            index: true,
            element: <MyAccountPage />,
          },
          {
            path: "changepassword",
            element: <ChangePassword />,
          },
          {
            path: "updateprofile",
            element: <UpdateProfile/>
          },
          {
            path: "deleteaccount",
            element: <DeleteAccount/>
          },
          {
            path: "registerpassword",
            element: <RegisterPassword/>
          },
          {
            path: "*",
            element: <NotFoundPage/>
          }
        ],
      },
      {
        path: "*",
        element: <NotFoundPage/>
      }
    ],
  },
  {
    path: "/user",
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        path: "*",
        element: <NotFoundPage/>
      }
    ],
  },
  {
    path: "*",
    element: <NotFoundPage/>
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

/**
 * TODO
 * (complete) ms todo app redirect https://to-do.office.com/ -> https://to-do.office.com/tasks/today
 * (complete) sidebar retraction
 * (complete) TaskDetail에서 redux저장소에서 데이터 가지고와서 detail body 구현하기
 * (complete) basic layout
 * (complete)testfield code 해석하기
 * Header search bar
 * AddTask.js fix payload (considering delete item using id)
 * implement steps
 * (complete) implement date/remind/repeat compoenent popover
 * (complete) complete탭 task 순서 수정하기
 * (complete) Detail resizer <-> popover랑 겹치면 UI 오류발생 -> 안겹치게 바꾸기
 * (complete) activated task blue color
 * (complete) UI -> searchbar x버튼 눌렀을 때 flickering문제 해결하기
 * (complete) Searchbar
 * (complete) taskList component scroll 가능하게 만들기
 * (complete) repeat완료됐을 때 다음 repeat task생성 로직 백엔드에서 구현하기(RootPage로 이동)
 * (complete) myday처리
 * (complete)task context menu 기능 구현하기
 * (complete) dueDate가 설정되지 않더라도, 날짜 지나면 myday=false로 변경됨
 * (complete) Task Item multi selection (shift, ctrl키)
 * (complete) PlannedList component next week text 변경하기
 * (complete) react datepicker styling
 * (complete) 삭제 모달
 * (complete) remind functionality
 * (complete) complete sound
 * (complete) UI -> searchbar hover cursor pointer
 * (complete) 반응형으로 만들기(사이즈 따라 다르게)
 * (complete) Detailbar zIndex floating ui zIndex 조정해야함
 * (complete) searchbar esc버튼
 * (complete) dark theme -> toggle switch 만들기
 * (complete) sign-in, sign-up,
 * (complete) backend 연결
 * (complete) Myday tab 아닌 곳에서 detail bar - add to myday button 작동 안함
 * (complete) Loading component 구현
 * (complete) SignIn, SignUp page => 로그인 되어있으면 home으로 redirect
 * (complete) viewport width 작아져서 detailbar 전체화면 설정할 때, taskDetail component useEffect hook에서 호출 너무 자주 발생함. 수정할것. debounce vs throttle
 * (complete) task list에서 taskItem 서버에서 가져올때 조금씩 가지고오기(리스트 많아지면 성능저하 발생.. 해결하기) infinite scrolling
 * (complete) TaskItem render 횟수 최적화하기
 * (complete) shift/ctrl keydown TaskItem component re-render 수정하기
 * (complete) ImportanceList infinite scroll 구현하기
 * (complete) plannedList infinite scroll 구현하기
 * (complete) GroupList infinite scroll 구현하기
 * (complete) list 정렬 수정하기 (complete탭, importance탭 ...)
 * (complete) planned탭 dueDate순으로 정렬하기
 * (complete) Loading component render 위치 수정하기 - 네트워크 속도제한걸면 처음에는 spinner없다가 마지막에만 잠깐 나옴 - index.html에 loader 넣을지 결정하기
 * (complete) search params로 검색값 전달해서 구현
 * (complete) todoApiSlice:67, uiApiSlice:34 content download 종료되지 않는 문제 해결.
 * (complete) dark mode설정 server에 저장하기
 * (complete) created 및 필요한 정보들을 client 타임스탬프에서 서버 타임스탬프로 변경 - abort
 * (complete) Tasks탭 tasks 여러 개 등록 후 refresh하면 순서 바뀜
 * (complete)note updated 표시 즉시 안됨
 * (complete) useGetTodos Redux local store(todoSlice)말고 RTKQ만 사용해서 구현
 * (complete) file 업로드 개수, 용량, 확장자 제한하기
 * (complete) file 업로드 중 loading spinner render
 * (complete) groupSlice, sortSlice -> sortApiSlice, groupApiSlice로 migrate
 * (complete) detailWidth 초기값 api slice에서 설정 -> TaskDetail 간단하게 하기
 * (complete) OAuth & 로그인 페이지 기능 추가하기
 * (complete) login state에 대한 check가 redux를 통하지 않고, firebase에서 직접 받아온 정보여야 한다
 * (complete) signout했을 때, refresh 되도록 설정?
 * (complete) 브라우저 종료 후 켰을 때 계정 정보 초기화
 * (complete) complete된 task remind 비활성화 하기 -> complete되면 remind변경이 아니라 notify를 막아서 해결
 * (complete) 계정 삭제, 비밀번호 변경 가능한 mypage 만들기
 * (complete) 계정 삭제되면 firestore, storage에 연결된 데이터도 삭제하기
 * (complete) 잘못된 route 처리 (/abc) -> react router 404 처리
 * (complete) 'user' local에서 rtk query로 migrate -> 모든 user useSelector를 auth.currentUser로 대체가능하지 않을까?
 *
 *
 *
 *
 * <할것>
 *
 * 
 * 
 * useUpdateMyday, useRemindNotification, useTheme, useTitle에서 auth.currentUser.uid 초기 호출에서 null...
 * useAuth를 대체할 수 있을지? 대체 불가능하다면 uid를 위의 custom hook으로 전달하는 것도 고려 가능
 * 
 * 
 * Signin component에서 google provider(ljhcow@knou.ac.kr)입력하면 계정 연결하도록 설정
 * 
 * 이메일 사용 signup할 때, 메일 인증 
 * dark theme, 
 * 
 * 
 * 비밀번호 초기화 설정 -> 메일 전송
 *
 *
 *
 *
 *
 * 계정 새로 생성됐을 때 작동 확인하기
 *
 * 배포 전 Firestore 보안규칙 업데이트하기(단순 true에서 새로운 규칙으로)
 * 
 * 배포 중 SignUp - VerifyEmail component - actionCodeSettings 배포 링크로 수정하기
 * 
 *
 * completeList, PlannedList, GroupList에서 상위리스트가 모두 render된 이후에 하위리스트 render되도록 설정
 *
 *
 * signin page 배경 색깔 물결
 *
 *
 *
 * print 설정하기
 * Notion 개발일지 가지고와서 list로 render하기(보류)
 *
 * 
 * * 로딩 페이지 dark mode -> window.location.pathName으로 refresh하면서 theme즉시 받아오지 못하면서 발생하는 문제
 *
 *
 * AddTask component retraction
 *
 *
 *
 * floating ui -> useListNavigation 사용, 방향키로 선택 가능하도록 설정하기
 *
 *
 * UI -> task list scrollbar 생성될 때, taskItem 가로길이 바뀜. scrollbar 유무에 따라 padding 동적으로 변경하기
 *
 *
 *
 * Popover, tooltip 독립된 component로 구현해서 코드 가독성 높이기
 *
 *
 * Refactor -> GroupLists -> TaskHeader & TaskItemHeader 동일한 컴포넌트로 만들기
 *
 *
 * UI -> TaskItem myday sun icon 정렬 수정하기
 *
 */
