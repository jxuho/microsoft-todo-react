import AddTask from "./addtask/AddTask";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../store/uiSlice";
import { RxHamburgerMenu } from "react-icons/rx";
import { PiDotsThreeBold } from "react-icons/pi";
import SortPopover from "./toolbar/SortPopover";
import GroupPopover from "./toolbar/GroupPopover";
import SortIndicator from "./toolbar/SortIndicator";
import GroupIndicator from "./toolbar/GroupIndicator";
import { GoHome } from "react-icons/go";
import GroupLists from "./tasks/GroupLists";
import BasicList from "./tasks/BasicList";
import { useEffect, useState } from "react";
import sortTasks from "../utils/sortTasks";
import CompleteList from "./tasks/CompleteList";
import { addActiveTasks } from "../store/activeSlice";
import { useGetTodosApiQuery } from "../api/todoApiSlice";
import { useGetSortApiQuery } from "../api/sortApiSlice";
import { useGetGroupApiQuery } from "../api/groupApiSlice";
import { auth } from "../firebase";

const Inbox = () => {
  const isSidebarOpen = useSelector((state) => state.ui.sidebar);
  const activeRange = useSelector((state) => state.active.activeRange);
  const dispatch = useDispatch();
  const [todoArr, setTodoArr] = useState([]);

  const userId = auth.currentUser.uid;

  const {
    data: sortData,
    isError: isSortError,
    error: sortError,
  } = useGetSortApiQuery(userId, { skip: !userId });

  const isSortOptionSelected = sortData?.tasks.sortBy;
  const sortOrder = sortData?.tasks.order;
  const sortBy = sortData?.tasks.sortBy;

  const { data: groupData } = useGetGroupApiQuery(userId, { skip: !userId });

  const groupBy = groupData?.tasks;
  const isGroupOptionSelected = groupData?.tasks;

  const {
    data: todos,
    error,
    isLoading: isTodosLoading,
    refetch,
  } = useGetTodosApiQuery(userId, { skip: !userId });

  const openSidebarHandler = () => {
    dispatch(openSidebar());
  };

  useEffect(() => {
    //  todoArr 생성.
    let allTasks = todos
      .slice()
      .sort((a, b) => new Date(a.created) - new Date(b.created))
      .reverse();

    if (sortBy) {
      allTasks = sortTasks(sortBy, sortOrder, allTasks);
    }

    let incompleteTemp = [];
    let completeTemp = [];
    allTasks.forEach((todo) => {
      if (!todo.complete) {
        incompleteTemp.push(todo);
      } else {
        completeTemp.push(todo);
      }
    });
    allTasks = [...incompleteTemp, ...completeTemp];
    setTodoArr(allTasks);
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
  }, [activeRange, todoArr, dispatch]);

  return (
    <>
      <div className="flex flex-shrink-0 relative items-center justify-center h-12 mx-6 my-4 ">
        <div className="flex items-center flex-1 min-w-100 mr-5 py-2 ml-1">
          <div className="flex flex-col pt-1">
            <div className="flex items-center">
              <div>
                {!isSidebarOpen ? (
                  <button onClick={openSidebarHandler} className="mr-2">
                    <RxHamburgerMenu size="20px" />
                  </button>
                ) : (
                  <div className="px-2 py-1.5 text-ms-blue">
                    <GoHome size="22px" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-medium py-2 text-ms-blue">Tasks</h2>
              </div>
              <div className="px-3">
                <PiDotsThreeBold />
              </div>
            </div>
          </div>
        </div>
        <div className="flex text-ms-blue">
          <SortPopover currentLocation="tasks" />
          <GroupPopover currentLocation="tasks" />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-end">
          {isSortOptionSelected && <SortIndicator currentLocation="tasks" />}
          {isGroupOptionSelected && <GroupIndicator currentLocation="tasks" />}
        </div>
        <AddTask currentLocation={"tasks"} />
        <div className="overflow-y-auto">
          {groupBy === "category" ? (
            <GroupLists todoArr={todoArr} currentLocation={"tasks"} />
          ) : (
            <>
              <BasicList todoArr={todoArr} currentLocation={"tasks"} />
              <CompleteList todoArr={todoArr} currentLocation={"tasks"} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Inbox;
