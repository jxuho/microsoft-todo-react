import { useDispatch } from "react-redux";
import { closeDetail, openContextMenu, openDetail } from "../../store/uiSlice";
import {
  BsCircle,
  BsCheckCircle,
  BsCheckCircleFill,
  BsStar,
  BsStarFill,
} from "react-icons/bs";
import React, { forwardRef, useState } from "react";
import {
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import TaskItemCategories from "./TaskItemCategories";
import {
  addActiveTasks,
  initializeActiveRange,
  initializeActiveStep,
  initializeActiveTasks,
  removeActiveTask,
  setActiveRange,
} from "../../store/activeSlice";
import TaskItemOptions from "./TaskItemOptions";
import {
  useSetCompleteTodoApiMutation,
  useSetImportanceTodoApiMutation,
} from "../../api/todoApiSlice";
import uuid from "react-uuid";
import { auth } from "../../firebase";

const TaskItem = forwardRef(({ todo, currentLocation, isTaskActive }, ref) => {
  const dispatch = useDispatch();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const userId = auth.currentUser?.uid;
  const [setCompleteTodoApi] = useSetCompleteTodoApiMutation();
  const [setImportanceTodoApi] = useSetImportanceTodoApiMutation();

  // console.log("taskItem");

  const completeHandler = () => {
    if (todo.complete) {
      setCompleteTodoApi({ todoId: todo.id, userId, value: false });
    } else {
      setCompleteTodoApi({
        todoId: todo.id,
        userId,
        value: true,
        newTaskId: uuid(),
      });
    }
  };

  const importanceHandler = () => {
    if (todo.importance) {
      setImportanceTodoApi({ todoId: todo.id, userId, value: "" });
    } else {
      setImportanceTodoApi({
        todoId: todo.id,
        userId,
        value: new Date().toISOString(),
      });
    }
  };

  const taskClickHandler = (e, id) => {
    dispatch(initializeActiveStep());

    if (!e.ctrlKey && !e.shiftKey) {
      dispatch(initializeActiveTasks());
      dispatch(initializeActiveRange());
      dispatch(addActiveTasks(id));
      dispatch(openDetail());
    } else {
      dispatch(closeDetail());
    }
    if (e.ctrlKey) {
      if (isTaskActive) {
        dispatch(removeActiveTask(id));
      } else {
        dispatch(addActiveTasks(id));
      }
    }
    // && activeTasksId.length !== 0 조건을 activeTasksId를 부모로 분리하고, memo사용하기 위해 제거함
    // if (e.shiftKey && activeTasksId.length !== 0) {
    if (e.shiftKey) {
      dispatch(setActiveRange(id));
      dispatch(initializeActiveTasks());
    }
  };

  const contextMenuHandler = (e) => {
    e.preventDefault();
    if (!isTaskActive) {
      // active가 아닌 task가 클릭되면 -> 초기화, add
      dispatch(initializeActiveTasks());
      dispatch(initializeActiveStep());
      dispatch(addActiveTasks(todo.id));
    }
    dispatch(openContextMenu());
  };

  const {
    refs: tooltipRefs,
    floatingStyles: tooltipFloatingStyles,
    context: tooltipContext,
  } = useFloating({
    open: tooltipOpen,
    onOpenChange: setTooltipOpen,
    placement: "top",
    middleware: [offset(5), flip(), shift({ padding: 10 })],
  });

  const {
    getReferenceProps: getTooltipReferenceProps,
    getFloatingProps: getTooltipFloatingProps,
  } = useInteractions([
    useHover(tooltipContext, { delay: { open: 300, close: 0 } }),
    useDismiss(tooltipContext, {
      referencePress: true,
    }),
  ]);

  return (
    <div
      ref={ref}
      className={`flex items-center mt-2 min-h-52 px-4 py-0 rounded animate-slideFadeDown100 break-all ${
        isTaskActive ? "bg-ms-active-blue" : "bg-white hover:bg-ms-white-hover"
      }`}
      style={{
        boxShadow:
          "0px 0.3px 0.9px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
      }}
    >
      <span
        onClick={completeHandler}
        className="flex items-center justify-center w-8 h-8 hover:cursor-pointer text-ms-font-blue"
      >
        {todo.complete ? (
          <div className="animate-checkAnimationBase">
            <BsCheckCircleFill size="16px" />
          </div>
        ) : (
          <div className="flex items-center">
            <div className="absolute opacity-0 hover:opacity-100 transition-opacity duration-100 z-20">
              <BsCheckCircle size="16px" />
            </div>
            <div className="z-10">
              <BsCircle size="16px" />
            </div>
          </div>
        )}
      </span>

      <button
        onClick={(e) => taskClickHandler(e, todo.id)}
        className="hover:cursor-pointer px-3 py-2 flex-1 text-left text-ms-text-dark"
        onContextMenu={contextMenuHandler}
      >
        <span
          style={todo.complete ? { textDecoration: "line-through" } : null}
          className=""
        >
          {todo.task}
        </span>

        <div className="flex flex-wrap flex-row items-center leading-3">
          <span className="text-xs" style={{ color: "#797775" }}>
            Tasks
          </span>
          <TaskItemOptions todo={todo} currentLocation={currentLocation} />
          <TaskItemCategories todo={todo} />
        </div>
      </button>

      <div
        className="pr-2 hover:cursor-pointer text-ms-font-blue"
        onClick={importanceHandler}
        ref={tooltipRefs.setReference}
        {...getTooltipReferenceProps()}
      >
        {todo.importance ? (
          <div className="animate-fillAnimation">
            <BsStarFill size="18px" />
          </div>
        ) : (
          <BsStar size="18px" />
        )}
      </div>

      {tooltipOpen && (
        <div
          ref={tooltipRefs.setFloating}
          {...getTooltipFloatingProps()}
          style={{
            ...tooltipFloatingStyles,
            boxShadow:
              "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
          }}
          className="bg-white py-1.5 rounded-sm px-2 text-xs"
        >
          {todo.importance ? "Remove importance." : "Mark task as important."}
        </div>
      )}
    </div>
  );
});

export default React.memo(TaskItem);
