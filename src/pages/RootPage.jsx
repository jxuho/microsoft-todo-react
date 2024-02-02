import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import TaskDetail from "../components/details/TaskDetail";
import { useDispatch } from "react-redux";
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
import { useGetGroupApiQuery } from "../api/groupApiSlice";
import { useGetUiApiQuery } from "../api/uiApiSlice";
import { auth } from "../firebase";

const RootPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading: isAuthLoading, userId } = useAuth();
  const navigate = useNavigate();

  // console.log("RootPage");

  const { isLoading: isTodosLoading } = useGetTodosApiQuery(userId, {
    skip: !userId,
  });

  const { isLoading: isSortLoading } = useGetSortApiQuery(userId, {
    skip: !userId,
  });

  const { isLoading: isGroupLoading } = useGetGroupApiQuery(userId, {
    skip: !userId,
  });

  const { isLoading: isUiLoading } = useGetUiApiQuery(userId, {
    skip: !userId,
  });

  useUpdateMyday({ userId });
  useRemindNotification({ userId });
  useTheme({ userId });
  useTitle({ userId });

  // console.log(auth.currentUser); 

  useEffect(() => {
    // console.log(location.key);
    dispatch(initializeActiveTasks());
    dispatch(initializeActiveStep());
    dispatch(closeDetail());
  }, [location]);

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      console.log("navigate to sign in");
      // navigate("/user/signin");
      window.location.pathname = "/user/signin";
    }
  }, [isAuthLoading, isLoggedIn, navigate]);

  if (
    isAuthLoading ||
    isTodosLoading ||
    isSortLoading ||
    isGroupLoading ||
    isUiLoading ||
    (!isAuthLoading && !isLoggedIn)
  ) {
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
