import { useDispatch, useSelector } from "react-redux";
import {
  BsCircle,
  BsCheckCircle,
  BsCheckCircleFill,
  BsStar,
  BsStarFill,
} from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import {
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";

import TextareaAutosize from "react-textarea-autosize";
import {
  useChangeTaskTodoApiMutation,
  useSetCompleteTodoApiMutation,
  useSetImportanceTodoApiMutation,
} from "../../api/todoApiSlice";
import uuid from "react-uuid";

const DetailHeader = ({ taskId, todo }) => {
  const textAreaRef = useRef();
  const [isHover, setIsHover] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [isEscaped, setIsEscaped] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [changeTaskTodoApi] = useChangeTaskTodoApiMutation();
  const userId = useSelector((state) => state.auth.user.uid);

  const [setCompleteTodoApi] = useSetCompleteTodoApiMutation();
  const [setImportanceTodoApi] = useSetImportanceTodoApiMutation();

  const todoComplete = todo?.complete;
  const todoImportance = todo?.importance;

  const taskEditHandler = (event) => {
    setNewTask(event.target.value);
  };

  const completedHandler = () => {
    if (!todo) return;
    if (todoComplete) {
      setCompleteTodoApi({ todoId: todo.id, userId, value: false });
    } else {
      setCompleteTodoApi({ todoId: todo.id, userId, value: true, newTaskId: uuid() });
      
      setIsFocused(false);
      setIsActive(false);
    }
  };

  const importanceHandler = () => {
    if (!todo) return;
    if (todoImportance) {
      setImportanceTodoApi({ todoId: todo.id, userId, value: "" });
    } else {
      setImportanceTodoApi({
        todoId: todo.id,
        userId,
        value: new Date().toISOString(),
      });
    }
  };

  const blurHandler = () => {
    if (!isEscaped) {
      if (!newTask) {
        // task가 비어있으면 초기화
        setNewTask(todo.task);
        return;
      }

      changeTaskTodoApi({ todoId: todo.id, userId, value: newTask });
    }
    setIsFocused(false);
    setIsActive(false);
  };

  const clickHandler = () => {
    setIsActive(true);
    setIsFocused(true);
    setIsEscaped(false);
    setTimeout(() => {
      // click하면 focus하고, cursor을 맨 뒤로 이동시킨다
      textAreaRef.current.focus();
      const end = textAreaRef.current.value.length;
      textAreaRef.current.setSelectionRange(end, end);
    }, 0);
  };

  const focusHandler = () => {
    setIsFocused(true);
    setIsEscaped(false);
  };

  useEffect(() => {
    if (!todo) return;
    setNewTask(todo.task);
  }, [todo]);

  const keyDownHandler = (event) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
    if (event.key === "Escape") {
      setIsEscaped(true);
    }
  };

  useEffect(() => {
    if (!todo) return;
    if (isEscaped) {
      textAreaRef.current.blur();
      setNewTask(todo.task); // 초기화
    }
  }, [isEscaped]);

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
      className="flex items-center p-4 bg-white rounded-t z-10 hover:bg-ms-white-hover w-full"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="flex flex-1 items-center justify-between w-full">
        <span
          className="flex items-center justify-center hover:cursor-pointer px-0.5"
          onClick={completedHandler}
        >
          {todoComplete ? (
            <div className="animate-checkAnimationBase text-ms-font-blue">
              <BsCheckCircleFill size="16px" />
            </div>
          ) : (
            <div className="flex items-center">
              <div className="absolute opacity-0 hover:opacity-100 transition-opacity duration-100 z-20 text-ms-font-blue">
                <BsCheckCircle size="16px" />
              </div>
              <div className="z-10 text-ms-font-blue">
                <BsCircle size="16px" />
              </div>
            </div>
          )}
        </span>

        <div
          className={`w-full text-base font-semibold px-4 ${
            isHover ? "bg-ms-white-hover" : "bg-white"
          }`}
        >
          {isActive ? (
            <TextareaAutosize
              ref={textAreaRef}
              rows="1"
              value={newTask}
              onChange={taskEditHandler}
              onBlur={blurHandler}
              onFocus={focusHandler}
              onKeyDown={keyDownHandler}
              maxLength="255"
              maxRows={12}
              className={`dark:bg-[#292827] ${
                isHover ? "bg-ms-white-hover" : "bg-white"
              }`}
              style={{
                resize: "none",
                textDecoration:
                  todoComplete && !isFocused ? "line-through" : "",
                color: todoComplete && !isFocused ? "#767678" : "",
                wordBreak: "break-all",
                lineHeight: "1.5rem",
              }}
            />
          ) : (
            <div
              className="break-all max-h-60 overflow-y-auto hover:cursor-text"
              onClick={clickHandler}
              style={{
                textDecoration:
                  todoComplete && !isFocused ? "line-through" : "",
                color: todoComplete && !isFocused ? "#767678" : "",
              }}
            >
              {newTask}
            </div>
          )}
        </div>

        <div
          className="hover:cursor-pointer text-ms-font-blue"
          onClick={importanceHandler}
          ref={tooltipRefs.setReference}
          {...getTooltipReferenceProps()}
        >
          {todoImportance ? (
            <div className="animate-fillAnimation ">
              <BsStarFill size="18px" />
            </div>
          ) : (
            <BsStar size="18px" />
          )}
        </div>
      </div>

      {tooltipOpen && (
        <div
          ref={tooltipRefs.setFloating}
          {...getTooltipFloatingProps()}
          style={{
            ...tooltipFloatingStyles,
            boxShadow:
              "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
            zIndex: 50,
          }}
          className="bg-white py-1.5 rounded-sm px-2 text-xs"
        >
          {todoImportance ? "Remove importance." : "Mark task as important."}
        </div>
      )}
    </div>
  );
};

export default DetailHeader;
