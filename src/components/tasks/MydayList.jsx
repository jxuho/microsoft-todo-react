import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import sortTasks from "../../utils/sortTasks";
import GroupLists from "./GroupLists";
import BasicList from "./BasicList";
import CompleteList from "./CompleteList";
import { addActiveTasks } from "../../store/activeSlice";
import { useGetTodosApiQuery } from "../../api/todoApiSlice";
import { useGetSortApiQuery } from "../../api/sortApiSlice";
import { useGetGroupApiQuery } from "../../api/groupApiSlice";

const MydayList = ({ currentLocation }) => {
  const dispatch = useDispatch();
  const [todoArr, setTodoArr] = useState([]);
  const activeRange = useSelector((state) => state.active.activeRange);
  
  const user = useSelector((state) => state.auth.user);
  const {
    data: todos,
    error,
    isLoading: isTodosLoading,
    refetch,
  } = useGetTodosApiQuery(user?.uid, { skip: !user });
  
  const {
    data: sortData,
    isError: isSortError,
    error: sortError,
  } = useGetSortApiQuery(user?.uid, { skip: !user });
  
  const sortOrder = sortData?.myday?.order;
  const sortBy = sortData?.myday?.sortBy;
  
  
  
  const {data: groupData} = useGetGroupApiQuery(user?.uid, { skip: !user })
  
  const groupBy = groupData.myday



  useEffect(() => {
    // importance Boolean에서 Date Object string으로 변경함
    // importanct 설정되면 상단으로 render하는 logic을 여기에 작성해야 함

    let mydayTodos;

    // user exist
    mydayTodos = todos
      .slice()
      .sort((a, b) => new Date(a.created) - new Date(b.created))
      .reverse()
      .filter((todo) => todo.myday);

    if (sortBy) {
      mydayTodos = sortTasks(sortBy, sortOrder, mydayTodos);
    }

    let incompleteTemp = [];
    let completeTemp = [];
    mydayTodos.forEach((todo) => {
      if (!todo.complete) {
        incompleteTemp.push(todo);
      } else {
        completeTemp.push(todo);
      }
    });
    mydayTodos = [...incompleteTemp, ...completeTemp];
    setTodoArr(mydayTodos);
  }, [todos, sortBy, sortOrder]);

  useEffect(() => {
    // 정렬된 task를 shift keydown activeRange에 따라 active 설정
    if (activeRange.length !== 0) {
      const [startId, endId] = activeRange.map((taskId) =>
        todoArr.findIndex((todo) => todo.id === taskId)
      );
      if (startId !== -1 && endId !== -1) {
        const [minIndex, maxIndex] = [startId, endId].sort((a, b) => a - b);
        const activeTasksArr = todoArr.slice(minIndex, maxIndex + 1);

        activeTasksArr.forEach((task) => {
          dispatch(addActiveTasks(task.id));
        });
      }
    }
  }, [activeRange]);

  return (
    <div className="overflow-y-auto">
    {/* category가 아닌 경우 대비해서 !== "" 로 수정하기 */}
      {groupBy === "category" ? (
        <GroupLists todoArr={todoArr} currentLocation={currentLocation} />
      ) : (
        <>
          <BasicList todoArr={todoArr} currentLocation={currentLocation} />
          <CompleteList todoArr={todoArr} currentLocation={currentLocation} />
        </>
      )}
    </div>
  );
};

export default React.memo(MydayList);
