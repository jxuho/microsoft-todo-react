import { useDispatch, useSelector } from "react-redux";
import { useGetTodosApiQuery } from "../api/todoApiSlice";
import { setTodos } from "../store/todoSlice";
import { useEffect } from "react";

const useGetTodos = () => {
  const dispatch = useDispatch();
  const userId = auth.currentUser.uid;

  const {
    data: todoArrData,
    error,
    isLoading: isTodoLoading,
    refetch,
  } = useGetTodosApiQuery(userId, { skip: !userId });


  useEffect(() => {
    if (!todoArrData) return;
    dispatch(setTodos(todoArrData));
  }, [todoArrData]);

};

export default useGetTodos;
