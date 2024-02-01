import { useEffect, useState } from "react";
import { BsSun, BsXLg } from "react-icons/bs";
import { useSelector } from "react-redux";
import DetailRemindPopover from "./DetailRemindPopover";
import DetailDuePopover from "./DetailDuePopover";
import DetailRepeatPopover from "./DetailRepeatPopover";
import { useSetMydayTodoApiMutation } from "../../api/todoApiSlice";
import { auth } from "../../firebase";

const DetailOptions = ({ taskId, todo }) => {
  const [isMyday, setIsMyday] = useState(false);
  const [isMydayHover, setIsMydayHover] = useState(false);
  const userId = auth.currentUser.uid;
  const [setMydayTodoApi] = useSetMydayTodoApiMutation();

  const todoMyday = todo?.myday;

  useEffect(() => {
    setIsMyday(todoMyday);
  }, [todoMyday]);

  const addMydayHandler = () => {
    if (!todoMyday) {
      setMydayTodoApi({ todoId: taskId, userId, value: true });
    }
  };

  const removeMydayHandler = () => {
    if (todoMyday) {
      setMydayTodoApi({ todoId: taskId, userId, value: false });
    }
  };

  return (
    <>
      <div
        className="flex bg-white w-full rounded my-2 p-4 items-center justify-between text-ms-light-text hover:bg-ms-white-hover hover:text-black"
        onClick={addMydayHandler}
        onMouseOver={() => setIsMydayHover(true)}
        onMouseLeave={() => setIsMydayHover(false)}
      >
        <div
          className={`flex w-full items-center ${
            isMyday ? "text-ms-font-blue" : ""
          }`}
        >
          <BsSun size="16px" />
          <span className="mx-4">
            {isMyday ? "Added to My Day" : "Add to My Day"}
          </span>
        </div>
        {isMyday && isMydayHover && (
          <button onClick={removeMydayHandler}>
            <BsXLg size="16px" style={{ paddingRight: "2px" }} />
          </button>
        )}
      </div>

      <div className="rounded mb-2">
        <DetailRemindPopover taskId={taskId} todo={todo} />
        <DetailDuePopover taskId={taskId} todo={todo} />
        <DetailRepeatPopover taskId={taskId} todo={todo} />
      </div>
    </>
  );
};

export default DetailOptions;
