import { useDispatch, useSelector } from "react-redux";
import { useGetTodosApiQuery } from "../api/todoApiSlice";
import { setTodos } from "../store/todoSlice";
import { useEffect } from "react";

const useGetTodos = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const {
    data: todoArrData,
    error,
    isLoading: isTodoLoading,
    refetch,
  } = useGetTodosApiQuery(user?.uid, { skip: !user?.uid });


  useEffect(() => {
    if (!todoArrData) return;
    dispatch(setTodos(todoArrData));
  }, [todoArrData]);

};

export default useGetTodos;
