import {
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { deleteObject, getMetadata, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { BsXLg } from "react-icons/bs";
import { storage } from "../../firebase";
import { useRemoveFileTodoApiMutation } from "../../api/todoApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setDialog } from "../../store/uiSlice";

const DetailFileItem = ({ todo, fileItem, index }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isHover, setIsHover] = useState();

  const [removeFileTodoApi, {isError: isRemoveFileError, error: removeFileError}] = useRemoveFileTodoApiMutation()

  const removeFileHandler = (fileItem) => {
    removeFileTodoApi({todoId:todo.id, user, fileRef:fileItem.fileRef})

    if (isRemoveFileError) {
      console.log("error while deleting file in Firestore ", removeFileError);
      return;
    }

    deleteObject(ref(storage, fileItem.fileRef)).then(() => {
      console.log("File deleted successfully in Cloud Storage");

    }).catch((error) => {
      console.log(error);
    });
  };

  const mouseOverHandler = (index) => {
    setIsHover(index);
  };

  const mouseLeaveHandler = () => {
    setIsHover(null);
  };

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

  const [filItemMeta, setFileItemMeta] = useState();

  useEffect(() => {
    const storageRef = ref(storage, fileItem.fileRef);

    getMetadata(storageRef)
      .then((metadata) => {
        setFileItemMeta(metadata);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div
      className="flex bg-white w-full items-center justify-between text-ms-light-text hover:bg-ms-white-hover hover:text-black hover:cursor-pointer"
      key={fileItem.fileRef}
      onMouseOver={() => mouseOverHandler(index)}
      onMouseLeave={mouseLeaveHandler}
    >
      <div className="flex justify-between w-full items-center p-4 border-solid border-b-[0.5px] border-ms-input-hover">
        <div className="w-9 h-9 bg-ms-blue text-white-text uppercase font-semibold items-center justify-center text-sm rounded-md">
          <div className="max-w-[36px] h-6 text-center leading-9">
            {filItemMeta?.contentType.split("/")[1]}
          </div>
        </div>
        <div
          className={`ml-4 flex flex-col flex-1 overflow-hidden ${
            isHover !== null && "underline decoration-ms-blue"
          } text-ms-light-text`}
        >
          <div className="whitespace-nowrap overflow-hidden leading-4 text-ellipsis">
            {fileItem.fileName}
          </div>
          <div className="whitespace-nowrap overflow-hidden text-ellipsis leading-4 text-xs mt-1">
            <span className="leading-4 after:content-['•'] after:mx-2">
              {`${(filItemMeta?.size / 1024).toFixed(1)}kb`}
            </span>
            <span>{filItemMeta?.contentType.split("/")[0]}</span>
          </div>
        </div>
        {isHover === index && (
          <button
            onClick={() => removeFileHandler(fileItem)}
            ref={tooltipRefs.setReference}
            {...getTooltipReferenceProps()}
          >
            <BsXLg size="16px" style={{ paddingRight: "2px" }} />
          </button>
        )}
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
          Delete File
        </div>
      )}
    </div>
  );
};

export default DetailFileItem;
