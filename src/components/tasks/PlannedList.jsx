import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import TaskItemHeader from "./TaskItemHeader";
import TaskItem from "./TaskItem";
import { addActiveTasks } from "../../store/activeSlice";
import { getCustomFormatDateString } from "../../utils/getDates";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import sortTasks from "../../utils/sortTasks";
import { useGetTodosApiQuery } from "../../api/todoApiSlice";
import { auth } from "../../firebase";

const PlannedList = () => {
  const dispatch = useDispatch();
  const activeRange = useSelector((state) => state.active.activeRange);
  const activeTasksId = useSelector((state) => state.active.activeTasks);

  const userId = auth.currentUser?.uid;
  const {
    data: todos,
    error,
    isLoading: isTodosLoading,
    refetch,
  } = useGetTodosApiQuery(userId, { skip: !userId });

  const [activeArr, setActiveArr] = useState([]);
  const [isOpen, setIsOpen] = useState({
    earlier: false,
    today: true,
    tomorrow: true,
    next5Days: true,
    later: true,
  });

  const [sortedArr, setSortedArr] = useState({
    earlier: [],
    today: [],
    tomorrow: [],
    next5Days: [],
    later: [],
  });

  const [count, setCount] = useState({
    earlier: 0,
    today: 0,
    tomorrow: 0,
    next5Days: 0,
    later: 0,
  });

  const toggleListHandler = (title) => {
    setIsOpen((prevState) => {
      return {
        ...prevState,
        [title]: !prevState[title],
      };
    });
  };

  useEffect(() => {
    const listCount = {
      earlier: 0,
      today: 0,
      tomorrow: 0,
      next5Days: 0,
      later: 0,
    };
    const tempSortedArr = {
      earlier: [],
      today: [],
      tomorrow: [],
      next5Days: [],
      later: [],
    };

    todos.forEach((todo) => {
      if (!todo.dueDate || todo.complete) return;
      const category = classifyDate(todo);
      tempSortedArr[category].push(todo);
      listCount[category]++;
    });

    // tempSortedArr내부의 arr를 dueDate에 따라서 sort. today, tmr는 정렬필요없음.
    tempSortedArr.earlier = sortTasks(
      "dueDate",
      "descending",
      tempSortedArr.earlier
    ).reverse();
    tempSortedArr.today = sortTasks(
      "dueDate",
      "descending",
      tempSortedArr.today
    );
    tempSortedArr.tomorrow = sortTasks(
      "dueDate",
      "descending",
      tempSortedArr.tomorrow
    );
    tempSortedArr.next5Days = sortTasks(
      "dueDate",
      "descending",
      tempSortedArr.next5Days
    ).reverse();
    tempSortedArr.later = sortTasks(
      "dueDate",
      "descending",
      tempSortedArr.later
    ).reverse();

    setActiveArr([
      ...tempSortedArr.earlier.slice(),
      ...tempSortedArr.today.slice(),
      ...tempSortedArr.tomorrow.slice(),
      ...tempSortedArr.next5Days.slice(),
      ...tempSortedArr.later.slice(),
    ]);
    setSortedArr(tempSortedArr);
    setCount(listCount);
  }, [todos]);

  useEffect(() => {
    // 정렬된 task를 shift keydown activeRange에 따라 active 설정
    if (activeRange.length !== 0) {
      const [startId, endId] = activeRange.map((taskId) =>
        activeArr.findIndex((todo) => todo.id === taskId)
      );
      if (startId !== -1 && endId !== -1) {
        const [minIndex, maxIndex] = [startId, endId].sort((a, b) => a - b);
        const activeTasksArr = activeArr.slice(minIndex, maxIndex + 1);

        activeTasksArr.forEach((task) => {
          dispatch(addActiveTasks(task.id));
        });
      }
    }
  }, [activeRange]);

  const { lastTaskRef: earlierLastTaskRef, limitTodoArr: earlierLimitArr } =
    useInfiniteScroll(20, sortedArr.earlier);

  const earlierContent = earlierLimitArr.map((todo, index) => {
    if (earlierLimitArr.length === index + 1) {
      return (
        <TaskItem
          ref={earlierLastTaskRef}
          key={todo.id}
          todo={todo}
          currentLocation="planned"
          isTaskActive={activeTasksId.includes(todo.id)}
        />
      );
    }
    return (
      <TaskItem
        key={todo.id}
        todo={todo}
        currentLocation="planned"
        isTaskActive={activeTasksId.includes(todo.id)}
      />
    );
  });
  const { lastTaskRef: todayLastTaskRef, limitTodoArr: todayLimitArr } =
    useInfiniteScroll(20, sortedArr.today);

  const todayContent = todayLimitArr.map((todo, index) => {
    if (todayLimitArr.length === index + 1) {
      return (
        <TaskItem
          ref={todayLastTaskRef}
          key={todo.id}
          todo={todo}
          currentLocation="planned"
          isTaskActive={activeTasksId.includes(todo.id)}
        />
      );
    }
    return (
      <TaskItem
        key={todo.id}
        todo={todo}
        currentLocation="planned"
        isTaskActive={activeTasksId.includes(todo.id)}
      />
    );
  });
  const { lastTaskRef: tomorrowLastTaskRef, limitTodoArr: tomorrowLimitArr } =
    useInfiniteScroll(20, sortedArr.tomorrow);

  const tomorrowContent = tomorrowLimitArr.map((todo, index) => {
    if (tomorrowLimitArr.length === index + 1) {
      return (
        <TaskItem
          ref={tomorrowLastTaskRef}
          key={todo.id}
          todo={todo}
          currentLocation="planned"
          isTaskActive={activeTasksId.includes(todo.id)}
        />
      );
    }
    return (
      <TaskItem
        key={todo.id}
        todo={todo}
        currentLocation="planned"
        isTaskActive={activeTasksId.includes(todo.id)}
      />
    );
  });
  const { lastTaskRef: next5DaysLastTaskRef, limitTodoArr: next5DaysLimitArr } =
    useInfiniteScroll(20, sortedArr.next5Days);

  const next5DaysContent = next5DaysLimitArr.map((todo, index) => {
    if (next5DaysLimitArr.length === index + 1) {
      return (
        <TaskItem
          ref={next5DaysLastTaskRef}
          key={todo.id}
          todo={todo}
          currentLocation="planned"
          isTaskActive={activeTasksId.includes(todo.id)}
        />
      );
    }
    return (
      <TaskItem
        key={todo.id}
        todo={todo}
        currentLocation="planned"
        isTaskActive={activeTasksId.includes(todo.id)}
      />
    );
  });
  const { lastTaskRef: laterLastTaskRef, limitTodoArr: laterLimitArr } =
    useInfiniteScroll(20, sortedArr.later);

  const laterContent = laterLimitArr.map((todo, index) => {
    if (laterLimitArr.length === index + 1) {
      return (
        <TaskItem
          ref={laterLastTaskRef}
          key={todo.id}
          todo={todo}
          currentLocation="planned"
          isTaskActive={activeTasksId.includes(todo.id)}
        />
      );
    }
    return (
      <TaskItem
        key={todo.id}
        todo={todo}
        currentLocation="planned"
        isTaskActive={activeTasksId.includes(todo.id)}
      />
    );
  });

  let startDate = new Date();
  startDate.setDate(startDate.getDate() + 2);
  startDate = getCustomFormatDateString(startDate, "short");
  let endDate = new Date();
  endDate.setDate(endDate.getDate() + 6);
  endDate = getCustomFormatDateString(endDate, "short");

  return (
    <div className="flex flex-col overflow-y-auto pb-6 px-6">
      {count.earlier !== 0 && (
        <TaskItemHeader
          title="Earlier"
          isOpen={isOpen.earlier}
          openHandler={() => toggleListHandler("earlier")}
          count={count.earlier}
        />
      )}
      {count.earlier !== 0 && isOpen.earlier && <div>{earlierContent}</div>}

      {count.today !== 0 && (
        <TaskItemHeader
          title="Today"
          isOpen={isOpen.today}
          openHandler={() => toggleListHandler("today")}
          count={count.today}
        />
      )}
      {count.today !== 0 && isOpen.today && <div>{todayContent}</div>}

      {count.tomorrow !== 0 && (
        <TaskItemHeader
          title="Tomorrow"
          isOpen={isOpen.tomorrow}
          openHandler={() => toggleListHandler("tomorrow")}
          count={count.tomorrow}
        />
      )}
      {count.tomorrow !== 0 && isOpen.tomorrow && <div>{tomorrowContent}</div>}
      {count.next5Days !== 0 && (
        <TaskItemHeader
          title={`${startDate} to ${endDate}`}
          isOpen={isOpen.next5Days}
          openHandler={() => toggleListHandler("next5Days")}
          count={count.next5Days}
        />
      )}
      {count.next5Days !== 0 && isOpen.next5Days && (
        <div>{next5DaysContent}</div>
      )}

      {count.later !== 0 && (
        <TaskItemHeader
          title="Later"
          isOpen={isOpen.later}
          openHandler={() => toggleListHandler("later")}
          count={count.later}
        />
      )}
      {count.later !== 0 && isOpen.later && <div>{laterContent}</div>}
    </div>
  );
};

export default React.memo(PlannedList);

const classifyDate = (task) => {
  if (!task.dueDate) return;
  const dateToClassify = new Date(task.dueDate);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);
  const oneWeekLater = new Date(currentDate);
  oneWeekLater.setDate(currentDate.getDate() + 7);

  if (dateToClassify < currentDate) {
    return "earlier";
  } else if (dateToClassify.toDateString() === currentDate.toDateString()) {
    return "today";
  } else if (dateToClassify.toDateString() === tomorrow.toDateString()) {
    return "tomorrow";
  } else if (dateToClassify > tomorrow && dateToClassify <= oneWeekLater) {
    return "next5Days";
  } else {
    return "later";
  }
};
