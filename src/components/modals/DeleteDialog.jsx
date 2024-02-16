import {
  useFloating,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
} from "@floating-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { closeDetail, setDeleteDialogActive } from "../../store/uiSlice";
import {
  useGetTodosApiQuery,
  useRemoveFileTodoApiMutation,
  useRemoveTodoApiMutation,
} from "../../api/todoApiSlice";
import { deleteObject, ref } from "firebase/storage";
import { auth, storage } from "../../firebase";

function DeleteDialog() {
  const dispatch = useDispatch();
  const activeTasksId = useSelector((state) => state.active.activeTasks);
  const isDeleteDialogOpen = useSelector(
    (state) => state.ui.deleteDialogActive
  );
  const deleteDialogTarget = useSelector(
    (state) => state.ui.deleteDialogTarget
  );
  const userId = auth.currentUser?.uid;
  const activeFileRef = useSelector((state) => state.active.activeFileRef);

  const {
    data: todos,
    error,
    isLoading: isTodosLoading,
    refetch,
  } = useGetTodosApiQuery(userId, { skip: !userId });

  const [removeTodoApi] = useRemoveTodoApiMutation();
  const [removeFileTodoApi] = useRemoveFileTodoApiMutation();

  const { refs, context } = useFloating({
    open: isDeleteDialogOpen,
    onOpenChange: (isOpen) => {
      dispatch(setDeleteDialogActive({ target: "", active: isOpen }));
    },
  });
  const click = useClick(context);
  const role = useRole(context);
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });
  const { getFloatingProps } = useInteractions([click, role, dismiss]);

  const deleteTargetHandler = () => {
    const targetTask = todos.find((todo) => todo.id === activeTasksId[0]);
    switch (deleteDialogTarget) {
      case "task":
        if (targetTask.file.length !== 0) {
          // task 삭제될 때, storage의 files 삭제
          targetTask.file.map((fileItem) => {
            deleteObject(ref(storage, fileItem.fileRef))
              .then(() => {
                activeTasksId.forEach((todoId) => {
                  removeTodoApi({ todoId, userId });
                });
              })
              .catch((error) => {
                console.log(error);
              });
            return null;
          });
        } else {
          // file 없는 경우
          activeTasksId.forEach((todoId) => {
            removeTodoApi({ todoId, userId });
          });
        }
        dispatch(closeDetail());
        break;

      case "file":
        deleteObject(ref(storage, activeFileRef))
          .then(() => {
            removeFileTodoApi({
              todoId: targetTask.id,
              userId,
              fileRef: activeFileRef,
            });
          })
          .catch((error) => {
            console.log(error);
          });
        break;

      default:
        break;
    }

    dispatch(setDeleteDialogActive({ target: "", active: false }));
  };

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };

  let headerContent;
  let deleteButtonContent;
  if (deleteDialogTarget === "task") {
    headerContent =
      activeTasksId.length === 1 ? (
        <div className="text-black">
          <span>{`"${truncateString(
            todos.find((todo) => todo.id === activeTasksId[0]).task,
            20
          )}"`}</span>
          <span> will be permanently deleted.</span>
        </div>
      ) : (
        <span>Are you sure you want to permanently delete these tasks?</span>
      );
    deleteButtonContent = "Delete task";
  } else if (deleteDialogTarget === "file") {
    headerContent = (
      <span>Are you sure you want to permanently delete this file?</span>
    );
    deleteButtonContent = "Delete file";
  }
  return (
    isDeleteDialogOpen && (
      <div>
        <FloatingPortal id="root">
          <FloatingOverlay
            className="flex items-center justify-center z-50"
            lockScroll
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
          >
            <FloatingFocusManager context={context}>
              <div
                className="bg-white min-w-[288px] min-h-[176px] rounded flex flex-col"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.22) 0px 25.6px 57.6px 0px, rgba(0, 0, 0, 0.18) 0px 4.8px 14.4px 0px",
                  border: "solid 1px #edebe9",
                }}
                ref={refs.setFloating}
                {...getFloatingProps()}
              >
                <div className="p-4">
                  <div className="font-semibold mb-3">{headerContent}</div>
                  <span className="text-ms-light-text">
                    You won't be able to undo this action.
                  </span>
                </div>
                <div className="flex justify-end p-4">
                  <button
                    className="bg-ms-input-hover font-semibold py-2 px-3 w-auto h-auto rounded hover:bg-gray-200 transition-colors"
                    style={{ color: "#34373d" }}
                    onClick={() => {
                      dispatch(setDeleteDialogActive(false));
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="ml-2 font-semibold py-2 px-3 w-auto h-auto rounded text-white bg-ms-warning hover:bg-red-800 transition-colors disabled:bg-ms-scrollbar disabled:hover:cursor-not-allowed"
                    onClick={deleteTargetHandler}
                  >
                    {deleteButtonContent}
                  </button>
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      </div>
    )
  );
}

export default DeleteDialog;
