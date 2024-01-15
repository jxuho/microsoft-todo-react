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
import useGetTodos from "../hooks/useGetTodos";
import useAuth from "../hooks/useAuth";
import useUpdateMyday from "../hooks/useUpdateMyday";
import Loading from "../components/Loading";
import useTitle from "../hooks/useTitle";
import { useGetTodosApiQuery } from "../api/todoApiSlice";

const RootPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todo.todos);
  const { isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // console.log("rootpage render");

  useGetTodos();
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
      console.log("GO TO SIGNIN PAGE");
      navigate("/user/signin");
    }
  }, [isAuthLoading, user, navigate]);

  if (!todos || isAuthLoading) {
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
    </div>
  );
};

export default RootPage;
