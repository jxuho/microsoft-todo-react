import { useDispatch, useSelector } from "react-redux";
import { useGetTodosApiQuery } from "../api/todoApiSlice";
import { setTodos } from "../store/todoSlice";
import { useEffect } from "react";

const useGetTodos = () => {
  // todos를 RTKQ를 통해 가지고와서 local redux store에 저장함.
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const {
    data: todoArrData,
    error,
    isLoading: isTodoLoading,
    refetch,
  } = useGetTodosApiQuery(user?.uid, { skip: !user?.uid });


  useEffect(() => {
    // console.log('useGetTodos hook execute');
    if (!todoArrData) return;
    // console.log(todoArrData?.[0].created.toDate().toISOString());

    // const modifiedTimestampTodoArr = todoArrData.map(todo => {
    //   return {...todo, created: todo.created.toDate().toISOString()}
    // })
    // console.log(modifiedTimestampTodoArr);

    // dispatch(setTodos(modifiedTimestampTodoArr));
    dispatch(setTodos(todoArrData));
  }, [todoArrData]);

};

export default useGetTodos;
