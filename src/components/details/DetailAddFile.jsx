import { useEffect, useRef, useState } from "react";
import { FiPaperclip } from "react-icons/Fi";
import { storage } from "../../firebase";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useAddFileTodoApiMutation } from "../../api/todoApiSlice";
import DetailFileItem from "./DetailFileItem";

const DetailAddFile = ({ taskId, todo }) => {
  const inputRef = useRef();
  const user = useSelector((state) => state.auth.user);

  const [addFileTodoApi, { isError: isAddFileError, error: addFileError }] =
    useAddFileTodoApiMutation();

  const addFileClickHandler = (event) => {
    if (event.target.id !== "fileInputEl") {
      inputRef.current.click();
    }
  };


  const inputFileSaveHandler = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    if (!file) return;

    const fileRef = `${user.uid}-${taskId}-${file.name}`;
    const storageRef = ref(storage, fileRef);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // console.log(snapshot.metadata);
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log("File available at", downloadURL);
            addFileTodoApi({
              todoId: taskId,
              user,
              content: { fileName: file.name, downloadURL, fileRef },
            });
            if (isAddFileError) {
              console.log(addFileError);

              deleteObject(fileRef)
                .then(() => {
                  console.log(
                    "File in Storage is deleted because of an error from Firestore"
                  );
                })
                .catch((error) => {
                  console.log(
                    `Error while deleting the file in Storage: ${error}`
                  );
                });
            }
          })
          .catch((error) => {
            console.log(error);
          });

      }
    );
  };



  return (
    <>
      {todo.file.length !== 0 && (
        <div className="rounded mt-2">
          {todo.file.map((fileItem, index) => {
            return (
              <DetailFileItem
                key={fileItem.fileRef}
                index={index}
                todo={todo}
                fileItem={fileItem}
              />
            );
          })}
        </div>
      )}

      <div
        className={`flex bg-white w-full rounded p-4 items-center justify-between text-ms-light-text hover:cursor-pointer hover:bg-ms-white-hover hover:text-black ${
          todo.file.length === 0 ? "my-2" : ""
        }`}
        onClick={addFileClickHandler}
      >
        <div className="flex w-full items-center">
          <FiPaperclip size="16px" style={{ transform: "rotate(180deg)" }} />
          <input
            ref={inputRef}
            type="file"
            id="fileInputEl"
            style={{ display: "none" }}
            onChange={inputFileSaveHandler}
          />
          <label className="mx-4 hover:cursor-pointer">Add File</label>
        </div>
      </div>
    </>
  );
};

export default DetailAddFile;

// 계정이나 task 삭제됐을 때, storage 내부 파일도 삭제되도록 해야 함
// task 삭제됐을 때 trigger되는 removeTodoApi에서 task와 연결된 file도 삭제하는 코드 추가
// file을 삭제했을 때, firestore와 storage를 동기화 하는 코드도 필요함
