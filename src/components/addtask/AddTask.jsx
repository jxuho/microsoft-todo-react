import { useEffect, useRef, useState } from "react";
import uuid from "react-uuid";
import DuePopover from "./DuePopover";
import RemindPopover from "./RemindPopover";
import RepeatPopover from "./RepeatPopover";
import getLastTimeOfDay, {
  getNextClosestDayOfWeekFromDate,
} from "../../utils/getDates";
import { GoCircle } from "react-icons/go";
import { useAddTodoApiMutation } from "../../api/todoApiSlice";
import { auth } from "../../firebase";

const initialTask = {
  id: "", // uuid
  task: "", // user input
  steps: [],
  myday: false,
  dueDate: "", // isoString
  remind: "", // isoString
  reminded: false,
  repeatRule: "",
  repeated: false,
  category: [],
  file: [],
  note: { content: "", updated: "" },
  importance: false,
  created: "", // isoString
  complete: "", // isoString
};

const AddTask = ({ currentLocation }) => {
  const [taskInput, setTaskInput] = useState(initialTask);
  const dueRef = useRef();
  const remindRef = useRef();
  const repeatRef = useRef();
  const inputRef = useRef();

  const userId = auth.currentUser?.uid
  const [addTodoApi] = useAddTodoApiMutation();

  let isMyday = false;
  let isImportant = false;
  switch (currentLocation) {
    case "myday":
      isMyday = true;
      break;
    case "important":
      isImportant = true;
      break;

    default:
      break;
  }

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const taskInputHandler = (event) => {
    setTaskInput((prevState) => ({
      ...prevState,
      task: event.target.value,
    }));
  };

  const initializeButtons = () => {
    dueRef.current.resetDue();
    remindRef.current.resetRemind();
    repeatRef.current.resetRepeat();
  };

  const addTaskHandler = async () => {
    const trimmedTaskInput = { ...taskInput, task: taskInput.task.trim() };
    if (currentLocation === "planned" && !trimmedTaskInput.dueDate) {
      trimmedTaskInput.dueDate = new Date().toISOString();
    }
    const newTask = {
      ...trimmedTaskInput,
      id: uuid(),
      myday: isMyday,
      importance: isImportant,
    };
    try {
      addTodoApi({ todo: newTask, userId});
    } catch (error) {
      console.log(error.message);
    }
    
    setTaskInput(initialTask);
    initializeButtons();
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter" && taskInput.task.trim()) {
      addTaskHandler();
    }
    if (event.key === "Escape") {
      setTaskInput(initialTask);
    }
  };

  const taskCreateValueHandler = (input, type) => {
    if (input instanceof Date) {
      input = input.toISOString();
    }
    setTaskInput((prevState) => ({
      ...prevState,
      [type]: input,
    }));
  };

  useEffect(() => {
    // due 제거되면 repeat도 제거
    if (!taskInput.dueDate && taskInput.repeatRule) {
      repeatRef.current.resetRepeat();
    }
  }, [taskInput.dueDate]);

  useEffect(() => {
    // repeat설정했을때, due버튼 설정
    if (taskInput.repeatRule && !taskInput.dueDate) {
      if (taskInput.repeatRule.split("-").length === 2) {
        dueRef.current.setDue(getLastTimeOfDay());
      } else {
        const today = new Date();
        dueRef.current.setDue(
          getNextClosestDayOfWeekFromDate(
            today,
            taskInput.repeatRule.split("-").slice(2)
          )
        );
      }
    }
  }, [taskInput.repeatRule]);

  return (
    <div
      className="flex flex-col rounded bg-white mb-2 mx-6"
      style={{
        boxShadow:
          "0px 0.3px 0.9px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
      }}
    >
      <div
        className="flex items-center min-h-[52px] bg-white px-4 w-full z-10"
        style={{ borderBottom: "1px solid #e1dfdd" }}
      >
        <div className="ml-2 cursor-pointer text-ms-blue">
          <GoCircle size="18px" />
        </div>
        <input
          className="px-4 placeholder:text-ms-blue focus:placeholder:text-gray-500"
          style={{
            border: "none",
            backgroundColor: "transparent",
            outline: "none",
          }}
          placeholder="Add a task"
          maxLength="255"
          onChange={taskInputHandler}
          value={taskInput.task}
          onKeyDown={handleEnterKeyPress}
          ref={inputRef}
        />
      </div>

      <div
        className="flex justify-between h-11 items-center bg-ms-background shrink-0 px-4"
        style={{ color: "#323130" }}
      >
        <div className="flex items-center justify-center overflow-auto AddTaskButtons">
          <div className="flex px-1">
            <DuePopover
              setDueDateValue={taskCreateValueHandler}
              dueDateValue={taskInput.dueDate}
              ref={dueRef}
            />
          </div>
          <div className="flex px-1">
            <RemindPopover
              setRemindValue={taskCreateValueHandler}
              remindValue={taskInput.remind}
              ref={remindRef}
            />
          </div>
          <div className="flex px-1">
            <RepeatPopover
              setRepeatRule={taskCreateValueHandler}
              repeatRuleValue={taskInput.repeatRule}
              ref={repeatRef}
            />
          </div>
        </div>

        <button
          className="h-8 border-solid px-2 text-xs font-medium text-ms-blue bg-white disabled:cursor-not-allowed disabled:text-gray-400"
          style={{ borderWidth: "1px" }}
          disabled={!taskInput.task.trim()}
          onClick={addTaskHandler}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddTask;