import { useDispatch } from "react-redux";
import {
  addActiveTasks,
  initializeActiveRange,
  initializeActiveTasks,
} from "../store/activeSlice";
import { openDetail } from "../store/uiSlice";
import { useEffect } from "react";
import {
  useGetTodosApiQuery,
  useSetRemindedTodoApiMutation,
} from "../api/todoApiSlice";
import { auth } from "../firebase";

const useRemindNotification = () => {
  const dispatch = useDispatch();
  const userId = auth.currentUser?.uid;
  const [setRemindedTodoApi] = useSetRemindedTodoApiMutation();

  const {
    data: todos,
    error,
    isLoading: isTodosLoading,
    refetch,
  } = useGetTodosApiQuery(userId, { skip: !userId });

  useEffect(() => {
    if (!todos) return;
    if (!todos.some((todo) => todo.remind && !todo.reminded && !todo.complete))
      return;
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    const intervalId = setInterval(() => {
      // console.log("Interval");
      const currentTime = new Date();
      for (const todo of todos) {
        if (
          todo.remind &&
          !todo.reminded &&
          !todo.complete &&
          new Date(todo.remind) <= currentTime
        ) {
          notifyMe(todo);
          setRemindedTodoApi({ todoId: todo.id, userId, value: true });
        }
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [todos]);

  function notifyMe(todo) {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      const notification = new Notification("To do", { body: todo.task });
      notification.onclick = (event) => {
        event.preventDefault();
        dispatch(initializeActiveTasks());
        dispatch(initializeActiveRange());
        dispatch(addActiveTasks(todo.id));
        dispatch(openDetail());
      };
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          const notification = new Notification("To do", { body: todo.task });
          notification.onclick = (event) => {
            event.preventDefault();
            dispatch(initializeActiveTasks());
            dispatch(initializeActiveRange());
            dispatch(addActiveTasks(todo.id));
            dispatch(openDetail());
          };
        }
      });
    }
  }
};

export default useRemindNotification;
