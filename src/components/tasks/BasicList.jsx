import React from "react";
import TaskItem from "./TaskItem";
import { useSelector } from "react-redux";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

const BasicList = ({ todoArr, currentLocation }) => {
  const activeTasksId = useSelector((state) => state.active.activeTasks);
  
  const incompleteTodoArr = todoArr.filter(todo => !todo.complete)

  const { lastTaskRef, limitTodoArr } =
  useInfiniteScroll(20, incompleteTodoArr);

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

  const noIncomplete = todoArr.every((todo) => todo.complete === "");

  return (
    <div
      className="flex flex-col px-6"
      style={
        noIncomplete ? { paddingBottom: "1.5rem" } : { paddingBottom: "5px" }
      }
    >
      {content}
    </div>
  );
};

export default React.memo(BasicList);