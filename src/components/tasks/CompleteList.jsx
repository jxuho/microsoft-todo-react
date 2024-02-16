import React, {  useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import { useDispatch, useSelector } from "react-redux";
import TaskItemHeader from "./TaskItemHeader";
import { addActiveTasks } from "../../store/activeSlice";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

const CompleteList = ({ todoArr, currentLocation }) => {
  const dispatch = useDispatch();
  const activeRange = useSelector((state) => state.active.activeRange);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const activeTasksId = useSelector((state) => state.active.activeTasks);

  const toggleCompleteHandler = () => {
    setIsCompleteOpen((prevState) => !prevState);
  };

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

  const completeCount = todoArr.reduce(
    (acc, todo) => (todo.complete ? acc + 1 : acc),
    0
  );

  const title = currentLocation === "completed" ? "Tasks" : "Completed";

  const completeTodoArr = todoArr.filter((todo) => todo.complete)

  const { lastTaskRef, limitTodoArr } = useInfiniteScroll(20, completeTodoArr);

  const content = limitTodoArr.map((todo, index) => {
    if (limitTodoArr.length === index + 1) {
      return (
        <TaskItem
          ref={lastTaskRef}
          key={todo.id}
          todo={todo}
          currentLocation={currentLocation}
          isTaskActive={activeTasksId.includes(todo.id)}
        />
      );
    }
    return (
      <TaskItem
        key={todo.id}
        todo={todo}
        currentLocation={currentLocation}
        isTaskActive={activeTasksId.includes(todo.id)}
      />
    );
  });

  return (
    <>
      {todoArr.some((todo) => todo.complete) && (
        <div className="flex flex-col overflow-y-auto pb-6 px-6">
          <TaskItemHeader
            title={title}
            isOpen={isCompleteOpen}
            openHandler={toggleCompleteHandler}
            count={completeCount}
          />
          {isCompleteOpen && <div>{content}</div>}
        </div>
      )}
    </>
  );
};

export default React.memo(CompleteList);
