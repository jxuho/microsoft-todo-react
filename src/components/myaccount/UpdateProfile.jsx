import { updateProfile } from "firebase/auth";
import { auth, storage } from "../../firebase";
import { useRef, useState } from "react";
import { FiPaperclip, FiTrash2 } from "react-icons/Fi";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const inputRef = useRef();

  const [userName, setUserName] = useState(auth.currentUser.displayName ?? "");
  const [showMessage, setShowMessage] = useState({
    showNameMessage: false,
    showPhotoMessage: false,
    changeSuccess: false,
  });
  const [nameMessage, setNameMessage] = useState("");
  const [photoMessage, setPhotoMessage] = useState("");

  const [isFileUploading, setIsFileUploading] = useState(false);

  const [newPhotoUrl, setNewPhotoUrl] = useState(
    auth.currentUser.photoURL ?? ""
  );
  const [photoDeleted, setPhotoDeleted] = useState(false);
  const [fileData, setFileData] = useState("");

  const nameInputHandler = (e) => {
    setShowMessage((prevState) => ({ ...prevState, showNameMessage: false }));
    setUserName(e.target.value);
  };

  const clickCancelHandler = () => {
    window.location.pathname = "/myaccount";
  };

  const addFileClickHandler = (event) => {
    if (event.target.id !== "fileInputEl") {
      inputRef.current.click();
    }
  };

  const deletePhotoHandler = () => {
    setNewPhotoUrl("");
    setPhotoDeleted(true);
  };

  const submitUpdateProfileHandler = (e) => {
    e.preventDefault();

    if (userName.length === 0) {
      setNameMessage("Please type your name");
      setShowMessage((prevState) => ({ ...prevState, showNameMessage: true }));
      return;
    }
    const nameRegex = /^[\p{L}\s.'-]+$/u;
    if (!nameRegex.test(userName)) {
      setNameMessage("Name can't contain special characters or number");
      setShowMessage((prevState) => ({ ...prevState, showNameMessage: true }));
      return;
    }

    // 업로드하는 파일 이외의 파일은 삭제
    const listRef = ref(storage, `${auth.currentUser.uid}/profile`);
    listAll(listRef)
      .then((res) => {
        // if (res.items.length > 1) {
        res.items.forEach((itemRef) => {
          console.log(itemRef);
          if (itemRef.name !== fileData.name) {
            deleteObject(itemRef).then(() => {
              console.log(`${itemRef.name} is deleted`);
            });
          }
        });
        // }
      })
      .catch((error) => {
        console.log(error);
      });

    // firebase auth update
    updateProfile(auth.currentUser, {
      displayName: userName,
      photoURL: newPhotoUrl,
    })
      .then(() => {
        // success modal render
        console.log("Profile updated");
        setShowMessage((prevState) => ({ ...prevState, changeSuccess: true }));
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const inputFileSaveHandler = (event) => {
    event.preventDefault();
    setShowMessage((prevState) => ({ ...prevState, showPhotoMessage: false }));

    const file = event.target.files[0];
    if (!file) return;

    if (file.type.split("/")[0] !== "image") {
      // image파일 아닐 경우
      // message 출력
      setPhotoMessage("File should be an image");
      setShowMessage((prevState) => ({ ...prevState, showPhotoMessage: true }));
      return;
    }

    if (file.size / 1024 / 1024 > 5) {
      // 파일 용량 초과하는 경우
      // message 출력
      setPhotoMessage("Photo size can't over 5MB");
      setShowMessage((prevState) => ({ ...prevState, showPhotoMessage: true }));
      return;
    }

    setPhotoDeleted(false);

    const fileRef = `${auth.currentUser.uid}/profile/${file.name.replaceAll(
      " ",
      ""
    )}`;

    setFileData(file);

    const storageRef = ref(storage, fileRef);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // console.log(snapshot.metadata);
        setIsFileUploading(true);
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
        setIsFileUploading(false);
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log("File available at", downloadURL);
            setNewPhotoUrl(downloadURL);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    );

    inputRef.current.value = null;
  };

  if (showMessage.changeSuccess) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div
          className="p-8 bg-white rounded max-w-sm"
          style={{
            boxShadow:
              "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
          }}
        >
          <form className="flex flex-col m-6">
            <h1 className="text-xl font-normal mb-10">Profile is updated</h1>

            <div className="flex justify-center items-center">
              <button
                className="py-1.5 px-8 rounded-sm border bg-ms-blue text-white hover:bg-ms-blue-hover transition-colors"
                onClick={() => navigate("/myaccount")}
              >
                Ok
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        className="p-8 bg-white rounded max-w-sm"
        style={{
          boxShadow:
            "0px 5px 10px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
        }}
      >
        <form className="flex flex-col" onSubmit={submitUpdateProfileHandler}>
          <h1 className="text-2xl font-normal mb-6">Update Profile</h1>
          <div className="mb-6">
            <p className="text-xs text-ms-light-text">
              Update your personal information. You can change a profile photo
              and a name.
            </p>
          </div>

          <div className="mb-6 flex flex-col items-center">
            <div className="w-20 h-20 m-5 overflow-hidden rounded-full">
              {!photoDeleted &&
                (newPhotoUrl ? (
                  <img src={newPhotoUrl} alt="profile image" />
                ) : auth.currentUser.photoURL ? (
                  <img src={auth.currentUser.photoURL} alt="profile image" />
                ) : (
                  <img src="/public/profile_image.svg" alt="profile image" />
                ))}
              {photoDeleted && (
                <img src="/public/profile_image.svg" alt="profile image" />
              )}
            </div>

            {isFileUploading && (
              <div className="flex bg-white w-full rounded p-4 items-center justify-between text-ms-light-text border-solid border-b-[0.5px] border-ms-input-hover">
                <span className="flex text-md font-medium w-full items-center justify-center">
                  Loading
                </span>
              </div>
            )}

            <div
              className="flex bg-white w-full rounded p-4 items-center justify-between text-ms-light-text hover:cursor-pointer hover:bg-ms-white-hover hover:text-black mb-2"
              onClick={addFileClickHandler}
            >
              <div className="flex w-full items-center">
                <FiPaperclip
                  size="16px"
                  style={{ transform: "rotate(180deg)" }}
                />
                <input
                  ref={inputRef}
                  type="file"
                  id="fileInputEl"
                  style={{ display: "none" }}
                  onChange={inputFileSaveHandler}
                />
                <label className="mx-4 hover:cursor-pointer">
                  Update photo
                </label>
              </div>
            </div>

            <div
              className="flex bg-white w-full rounded p-4 items-center justify-between text-ms-light-text hover:cursor-pointer hover:bg-ms-white-hover hover:text-black mb-2"
              onClick={deletePhotoHandler}
            >
              <div className="flex w-full items-center">
                <FiTrash2 size="16px" />
                <label className="mx-4 hover:cursor-pointer">
                  Delete photo
                </label>
              </div>
            </div>

            {showMessage.showPhotoMessage && (
              <p className="text-ms-alert-error">{photoMessage}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="userName" className="font-medium">
              Name
            </label>
            <input
              value={userName}
              type="text"
              placeholder="Please enter your name"
              id="userName"
              className="border mt-1 bg-transparent"
              onChange={nameInputHandler}
            />
            {showMessage.showNameMessage && (
              <p className="text-ms-alert-error text-wrap">{nameMessage}</p>
            )}
          </div>

          <div className="flex">
            <button
              className="mr-6 py-1.5 px-8 rounded-sm border bg-ms-blue text-white hover:bg-ms-blue-hover transition-colors"
              type="submit"
            >
              Save
            </button>
            <button
              className="text-ms-blue py-1.5 hover:underline"
              onClick={clickCancelHandler}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
