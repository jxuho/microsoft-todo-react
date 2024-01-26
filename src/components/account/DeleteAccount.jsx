import { useState } from "react";
import { auth, db, storage } from "../../firebase";
import { deleteObject, listAll, ref } from "firebase/storage";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { useGetTodosApiQuery } from "../../api/todoApiSlice";
import {
  GoogleAuthProvider,
  deleteUser,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Loading from "../Loading";
import { useNavigate } from "react-router-dom";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const {
    data: todos,
    error: todosError,
    isLoading: isTodosLoading,
    refetch: todosRefetch,
  } = useGetTodosApiQuery(auth.currentUser.uid, {
    skip: !auth.currentUser.uid,
  });
  const googleProvider = new GoogleAuthProvider();

  const [showAuthErrMessage, setShowAuthErrMessage] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const deleteAccountEmailInputHandler = (e) => {
    setShowAuthErrMessage(false);
    setEmail(e.target.value);
  };
  const [password, setPassword] = useState("");
  const deleteAccountPasswordHandler = (e) => {
    setShowAuthErrMessage(false);
    setPassword(e.target.value);
  };

  const cancelButtonClickHandler = () => {
    window.location.pathname = "/myaccount";
  };

  const deleteAccountSubmitHandler = async (e, user) => {
    e.preventDefault();
    console.log("submit trigger");
    try {
      setIsLoading(true);
      if (auth.currentUser.providerData[0].providerId === "google.com") {
        const signInResult = await signInWithPopup(auth, googleProvider);
        const userCredential =
          GoogleAuthProvider.credentialFromResult(signInResult);
        const token = userCredential.accessToken;

        // 동일한 계정이 아니면 return
        console.log(signInResult);
        console.log(auth.currentUser);
        if (signInResult.user.email !== auth.currentUser.email) {
          console.log("user information is not matched");
          setIsLoading(false);
          navigate("/myaccount/deleteaccount");
          return;
        }
      } else if (auth.currentUser.providerData[0].providerId === "password") {
        const signInResult = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      // storage 파일 삭제
      const profileRef = ref(storage, `${user.uid}/profile`);
      const storageProfileList = await listAll(profileRef);
      storageProfileList.items.forEach(async (itemRef) => {
        await deleteObject(itemRef);
      });
      const todosWithFile = todos.filter((todo) => todo.file.length !== 0);
      if (todosWithFile.length !== 0) {
        todosWithFile.map((todo) => {
          todo.file.map(async (fileItem) => {
            console.log(fileItem);
            await deleteObject(ref(storage, fileItem.fileRef));
          });
        });
      }

      // firestore 삭제
      // todos collection 삭제
      const todosDocRef = query(collection(db, `users/${user.uid}/todos`));
      const todosToDelete = await getDocs(todosDocRef);
      todosToDelete.forEach(async (docItem) => {
        const docId = docItem.id;
        await deleteDoc(doc(db, `users/${user.uid}/todos`, docId));
      });
      // preference collection 삭제
      const preferenceDocRef = query(
        collection(db, `users/${user.uid}/preference`)
      );
      const preferenceToDelete = await getDocs(preferenceDocRef);
      preferenceToDelete.forEach(async (docItem) => {
        console.log(docItem);
        const docId = docItem.id;
        await deleteDoc(doc(db, `users/${user.uid}/preference`, docId));
      });
      // uid doc 삭제
      await deleteDoc(doc(db, "users", user.uid));

      // authenticatoin user 삭제
      await deleteUser(auth.currentUser);

      console.log("Account deleted");
    } catch (error) {
      console.error(error);
      if (error.message.includes("auth")) {
        // check your email and password message
        setShowAuthErrMessage(true);
      }
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading />;
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
        <form
          className="flex flex-col"
          onSubmit={(e) => deleteAccountSubmitHandler(e, auth.currentUser)}
        >
          <h1 className="text-2xl font-bold mb-6">Delete Account</h1>
          <div className="flex flex-col mb-6">
            <span className="font-semibold text-xl pb-3">
              Are you sure you want to delete the account?
            </span>
            <span className="mb-6">
              ⚠️ Warning: This action is irreversible and will permanently
              delete all your data.
            </span>
            {auth.currentUser.providerData[0].providerId === "google.com" && (
              <span className="mb-6">
                ⚠️ If you want to proceed, you should sign in again.
              </span>
            )}
            {auth.currentUser.providerData[0].providerId === "password" && (
              <div className="mb-6">
                <span>
                  ⚠️ To confirm, type your email and password in the box below.
                </span>
                <input
                  className="border border-black  mb-2 bg-transparent"
                  type="text"
                  placeholder="Type your email"
                  onChange={deleteAccountEmailInputHandler}
                  value={email}
                />
                <input
                  className="border border-black bg-transparent"
                  type="password"
                  placeholder="Type your password"
                  onChange={deleteAccountPasswordHandler}
                  value={password}
                />
                {showAuthErrMessage && (
                  <p className="text-ms-alert-error">
                    Account information is not correct
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end ">
            <button
              className="bg-ms-input-hover font-semibold py-2 px-3 w-auto h-auto rounded hover:bg-gray-200 transition-colors"
              style={{ color: "#34373d" }}
              onClick={cancelButtonClickHandler}
              type="button"
            >
              Cancel
            </button>
            <button
              className="ml-2 font-semibold py-2 px-3 w-auto h-auto rounded text-white bg-ms-warning hover:bg-red-800 transition-colors disabled:bg-ms-scrollbar disabled:hover:cursor-not-allowed"
              type="submit"
            >
              {auth.currentUser.providerData[0].providerId === "google.com"
                ? "Sign in & Delete account"
                : "Delete Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccount;
