import { useEffect, useRef, useState } from "react";
import { FiPaperclip } from "react-icons/Fi";
import { storage } from "../../firebase";
import { ref } from "firebase/storage";

const DetailAddFile = () => {
  const [inputFile, setInputFile] = useState();
  const inputRef = useRef();

  const storageRef = ref(storage);

  // useEffect(() => {
  //   console.log(inputFile);
  // }, [inputFile])

  const inputFileSaveHandler = (event) => {
    setInputFile(event.target.files[0]);
  };

  const addFileClickHandler = (event) => {
    if (event.target.id !== "fileAttach") {
      inputRef.current.click();
    }
  };

  return (
    <div
      className="flex bg-white w-full rounded my-2 p-4 items-center justify-between text-ms-light-text hover:bg-ms-white-hover hover:text-black"
      onClick={addFileClickHandler}
      id="fileAttachDiv"
    >
      <div className="flex w-full items-center">
        <FiPaperclip size="16px" style={{ transform: "rotate(180deg)" }} />
        <input
          ref={inputRef}
          type="file"
          id="fileAttach"
          style={{ display: "none" }}
          onChange={inputFileSaveHandler}
          onClick={() => console.log("input clicked")}
        />
        <label id="fileAttachLabel" className="mx-4">
          Add File
        </label>
      </div>
    </div>
  );
};

export default DetailAddFile;
