import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import TaskDetail from "../components/details/TaskDetail";
import { useDispatch, useSelector } from "react-redux";
import { Suspense, useEffect } from "react";
import {
  initializeActiveStep,
  initializeActiveTasks,
} from "../store/activeSlice";
import { closeDetail } from "../store/uiSlice";
import TaskItemContextMenu from "../components/modals/TaskItemContextMenu";
import DeleteDialog from "../components/modals/DeleteDialog";
import useRemindNotification from "../hooks/useRemindNotification";
import SidebarOverlay from "../components/ui/SidebarOverlay";
import HeaderPanels from "../panels/HeaderPanels";
import useTheme from "../hooks/useTheme";
import useAuth from "../hooks/useAuth";
import useUpdateMyday from "../hooks/useUpdateMyday";
import Loading from "../components/Loading";
import useTitle from "../hooks/useTitle";
import { useGetTodosApiQuery } from "../api/todoApiSlice";
import InformationModal from "../components/modals/InformationModal";
import { useGetSortApiQuery } from "../api/sortApiSlice";

const RootPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // console.log("rootpage render");

  const { isLoading: isTodosLoading } = useGetTodosApiQuery(user?.uid, {
    skip: !user,
  });

  const { isLoading: isSortLoading } = useGetSortApiQuery(user?.uid, {
    skip: !user,
  });


  useUpdateMyday();
  useRemindNotification();
  useTheme();
  useTitle();

  useEffect(() => {
    dispatch(initializeActiveTasks());
    dispatch(initializeActiveStep());
    dispatch(closeDetail());
  }, [location]);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/user/signin");
    }
  }, [isAuthLoading, user, navigate]);

  // if (isAuthLoading || isTodosLoading) {
  if (isAuthLoading || isTodosLoading || isSortLoading) {
    // 한번에 모든 useQuery에 대한 loading을 처리하는게 바람직한가?
    // 로딩이 너무 길어지지는 않는가?
    return <Loading />;
  }

  return (
    <div className="flex flex-col bg-ms-background h-screen overflow-hidden text-black">
      <Header />
      <HeaderPanels />
      <div className="flex flex-1 overflow-hidden relative">
        <SidebarOverlay />
        <Sidebar />
        <div className="flex flex-1 flex-col bg-ms-background overflow-hidden">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </div>
        <TaskDetail />
      </div>
      <TaskItemContextMenu />
      <DeleteDialog />
      <InformationModal />
    </div>
  );
};

export default RootPage;
