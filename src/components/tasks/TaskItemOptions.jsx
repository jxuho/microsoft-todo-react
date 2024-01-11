import { BsSun } from "react-icons/bs";
import { PiArrowsClockwiseBold, PiNoteBlankLight } from "react-icons/pi";
import { IoCalendarOutline } from "react-icons/io5";
import { VscBell } from "react-icons/vsc";
import { FiPaperclip } from "react-icons/Fi";
import { useEffect } from "react";
import { useState } from "react";
import { getCustomFormatDateString } from "../../utils/getDates";

const TaskItemOptions = ({ todo, currentLocation }) => {
  const [dueText, setDueText] = useState("");
  const [remindText, setRemindText] = useState("");
  const [stepIncompleteLength, setStepIncompleteLength] = useState(0);

  useEffect(() => {
    if (todo.dueDate) {
      setDueText(getCustomFormatDateString(new Date(todo.dueDate), "dueDate"));
    }
    if (todo.remind) {
      setRemindText(getCustomFormatDateString(new Date(todo.remind), "remind"));
    }
    if (todo.steps.length) {
      setStepIncompleteLength(
        todo.steps.filter((step) => step.complete).length
      );
    }
    if (!todo.dueDate) {
      setDueText("");
    }
    if (!todo.remind) {
      setRemindText("");
    }
  }, [todo]);

  return (
    <>
      {currentLocation !== "myday" && todo.myday && (
        <div className="flex items-center before:content-['\2022'] before:mx-1.5 before:my-0 before:text-gray-500">
          <span className="mr-1">
            <BsSun size="12px" />
          </span>
          <span className="text-xs mr-1" style={{ color: "#797775" }}>
            My Day
          </span>
        </div>
      )}

      {todo.steps.length !== 0 && (
        <div className="flex items-center before:content-['\2022'] before:mx-1.5 before:my-0 before:text-gray-500">
          <span className="text-xs mr-1" style={{ color: "#797775" }}>
            {stepIncompleteLength} of {todo.steps.length}
          </span>
        </div>
      )}

      <div
        className="flex items-center"
        style={
          dueText === "Today"
            ? { color: "#2564cf" }
            : dueText.split(",")[0] === "Overdue"
            ? { color: "#a80000" }
            : { color: "#797775" }
        }
      >
        {dueText && (
          <div className="flex items-center before:content-['\2022'] before:mx-1.5 before:my-0 before:text-gray-500">
            <span className="mr-1">
              <IoCalendarOutline size="14px" />
            </span>
            <span className="text-xs mr-1">{dueText}</span>
          </div>
        )}
        {todo.repeatRule && (
          <span>
            <PiArrowsClockwiseBold size="14px" />
          </span>
        )}
      </div>
      {remindText && (
        <div className="flex items-center before:content-['\2022'] before:mx-1.5 before:my-0 before:text-gray-500">
          <span className="mr-1">
            <VscBell size="14px" color="#797775" />
          </span>
          <span className="text-xs mr-1" style={{ color: "#797775" }}>
            {remindText}
          </span>
        </div>
      )}

      {/* note */}
      {todo.note.content.trim() && (
        <div className="flex items-center before:content-['\2022'] before:mx-1.5 before:my-0 before:text-gray-500">
          <span className="mr-1">
            <PiNoteBlankLight size="14px" />
          </span>
          {!todo.file && !todo.dueDate && !todo.remind && (
            <span className="text-xs mr-1" style={{ color: "#797775" }}>
              Note
            </span>
          )}
        </div>
      )}

      {/* file attached */}
      {todo.file.length !== 0 && (
        <div className="flex items-center before:content-['\2022'] before:mx-1.5 before:my-0 before:text-gray-500">
          <span className="mr-1">
            <FiPaperclip size="12px" style={{ transform: "rotate(180deg)" }} />
          </span>
          <span className="text-xs mr-1" style={{ color: "#797775" }}>
            Files attached
          </span>
        </div>
      )}
    </>
  );
};

export default TaskItemOptions;
