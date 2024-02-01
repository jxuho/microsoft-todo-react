import { useEffect } from "react";
import { isDateToday } from "../utils/getDates";
import { useGetTodosApiQuery, useSetMydayTodoApiMutation } from "../api/todoApiSlice";
import { useGetUserApiQuery, useSetUpdatedApiMutation } from "../api/userApiSlice";

const useUpdateMyday = ({userId}) => {
  const [setMydayTodoApi] = useSetMydayTodoApiMutation();
  
  const {data: userData, isLoading:isUserLoading} = useGetUserApiQuery(userId, { skip: !userId })
  const [setUpdatedApi] = useSetUpdatedApiMutation()
  
  const {
    data: todos,
    error,
    isLoading: isTodosLoading,
    refetch,
  } = useGetTodosApiQuery(userId, { skip: !userId });

  useEffect(() => {
    // reload될 때, 날짜 변경됐으면 myday변경
    // db의 updated 항목이 오늘 toDateString과 일치하면 pass, 일치하지 않으면 아래 코드 실행하고 today를 오늘로 설정.
    if (!userData || !todos) return;
    if (userData.updated === new Date().toDateString()) return;
    todos.map((todo) => {
      if (
        !isDateToday(new Date(todo.created)) &&
        todo.myday &&
        !isDateToday(new Date(todo.dueDate))
      ) {
        setMydayTodoApi({ todoId: todo.id, userId, value: false });
      } else if (
        !isDateToday(new Date(todo.created)) &&
        isDateToday(new Date(todo.dueDate))
      ) {
        setMydayTodoApi({ todoId: todo.id, userId, value: true });
      } else if (
        !todo.dueDate &&
        !isDateToday(new Date(todo.created)) &&
        todo.myday
      ) {
        setMydayTodoApi({ todoId: todo.id, userId, value: false });
      }
    });

    setUpdatedApi({userId: userId, updated: new Date().toDateString()})


  }, [isUserLoading]);
};

export default useUpdateMyday;