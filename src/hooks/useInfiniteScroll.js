import { useState, useRef, useCallback } from 'react';

const useInfiniteScroll = (initialTasksToShow = 20, todoArr) => {
  const [tasksToShow, setTasksToShow] = useState(initialTasksToShow);

  const loadMoreTasks = () => {
    setTasksToShow((prevState) => prevState + 20);
  };

  const observerRef = useRef();

  const lastTaskRef = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && tasksToShow <= todoArr.length) {
          // console.log("load more");
          loadMoreTasks();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [tasksToShow, todoArr.length]
  );


  const limitTodoArr = todoArr.slice(0, tasksToShow);

  return {
    lastTaskRef,
    limitTodoArr,
  };
};

export default useInfiniteScroll;
