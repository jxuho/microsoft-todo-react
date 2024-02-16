import React, { useState } from "react";
import TaskHeader from "./TaskHeader";
import TaskItem from "./TaskItem";
import { useSelector } from "react-redux";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

const CategorySection = ({
  categoryName,
  taskArr,
  categoryOpen,
  categoryOpenHandler,
  currentLocation,
  activeTasksId,
}) => {
  const { lastTaskRef, limitTodoArr } = useInfiniteScroll(20, taskArr);

  const categoryContent = limitTodoArr.map((todo, index) => (
    <TaskItem
      ref={index === limitTodoArr.length - 1 ? lastTaskRef : null}
      key={todo.id}
      todo={todo}
      currentLocation={currentLocation}
      isTaskActive={activeTasksId.includes(todo.id)}
    />
  ));

  return (
    <div>
      <TaskHeader
        isHeaderOpen={categoryOpen}
        headerOpenHandler={() => categoryOpenHandler(categoryName)}
        taskCount={taskArr.length}
        categoryName={categoryName}
      />
      {categoryOpen && <div>{categoryContent}</div>}
    </div>
  );
};

const GroupLists = ({ todoArr, currentLocation }) => {
  const activeTasksId = useSelector((state) => state.active.activeTasks);

  const [categoryOpen, setCategoryOpen] = useState({
    blue: true,
    green: true,
    orange: true,
    purple: true,
    red: true,
    yellow: true,
    uncategorized: true,
  });

  const categoryOpenHandler = (category) => {
    setCategoryOpen((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const renderCategory = (category) => {
    let filteredArr;
    if (category === "uncategorized") {
      filteredArr = todoArr.filter(
        (todo) => !todo.category.length && !todo.complete
      );
    } else {
      filteredArr = todoArr.filter(
        (todo) => todo.category.includes(category) && !todo.complete
      );
    }

    if (filteredArr.length !== 0) {
      return (
        <CategorySection
          key={category}
          categoryName={category}
          taskArr={filteredArr}
          categoryOpen={categoryOpen[category]}
          categoryOpenHandler={categoryOpenHandler}
          currentLocation={currentLocation}
          activeTasksId={activeTasksId}
        />
      );
    }
    return null;
  };

  const categories = [
    "blue",
    "green",
    "orange",
    "purple",
    "red",
    "yellow",
    "uncategorized",
  ];

  const noIncomplete = todoArr.every((todo) => todo.complete === "");

  return (
    <div
      className="flex flex-col px-6"
      style={
        noIncomplete ? { paddingBottom: "1.5rem" } : { paddingBottom: "5px" }
      }
    >
      {categories.map(renderCategory)}
    </div>
  );
};

export default React.memo(GroupLists);