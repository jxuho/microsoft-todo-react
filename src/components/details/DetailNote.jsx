import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useAddNoteTodoApiMutation } from "../../api/todoApiSlice";

const DetailNote = ({ taskId, todo }) => {

  const inputRef = useRef();
  const [note, setNote] = useState("");
  const [updatedText, setUpdatedText] = useState("");

  const user = useSelector((state) => state.auth.user);
  const [addNoteTodoApi] = useAddNoteTodoApiMutation();

  const todoNote = todo.note;

  const noteInputHandler = (event) => {
    setNote(event.target.value);
  };

  const blurHandler = () => {
    addNoteTodoApi({ todoId: taskId, user, content: note });
  };

  const noteSectionClickHandler = () => {
    inputRef.current.focus();
  };

  useEffect(() => {
    setNote(todoNote.content);
  }, [todoNote.content]);

  useEffect(() => {
    if (todoNote.updated) {
      setUpdatedText(timeAgo(new Date(todoNote.updated)));
    }
  }, [todoNote.updated]);

  return (
    <div
      className="flex flex-col p-4 rounded my-2 bg-white justify-center border border-transparent hover:border-gray-300 hover:cursor-text"
      onClick={noteSectionClickHandler}
    >
      <TextareaAutosize
        ref={inputRef}
        type="text"
        placeholder="Add note"
        className="placeholder:text-gray-500 bg-white"
        style={{ outline: "none", resize: "none" }}
        onChange={noteInputHandler}
        value={note}
        onBlur={blurHandler}
      />
      <div className="flex mt-6 text-xs" style={{ color: "#767678" }}>
        {todoNote?.updated && <p>Updated {updatedText}</p>}
      </div>
    </div>
  );
};

export default DetailNote;

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " years ago";
  }
  if (interval === 1) {
    return "last year";
  }

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months ago";
  }
  if (interval === 1) {
    return "last month";
  }

  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days ago";
  }
  if (interval === 1) {
    return "yesterday";
  }

  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours ago";
  }
  if (interval === 1) {
    return "an hour ago";
  }

  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes ago";
  }
  if (interval === 1) {
    return "a minute ago";
  }

  return "a few seconds ago";
};
