import {
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { getMetadata, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { BsXLg } from "react-icons/bs";
import { storage } from "../../firebase";
import { useDispatch } from "react-redux";
import { setDeleteDialogActive } from "../../store/uiSlice";
import { setActiveFileRef } from "../../store/activeSlice";

const DetailFileItem = ({ todo, fileItem }) => {
  const dispatch = useDispatch();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isHover, setIsHover] = useState(null);
  const [filItemMeta, setFileItemMeta] = useState();

const removeFileHandler = (e, fileItem) => {
  e.stopPropagation()
  dispatch(setDeleteDialogActive({ target: "file", active: true }));
  dispatch(setActiveFileRef(fileItem.fileRef));
};

  const mouseOverHandler = (fileRef) => {
    setIsHover(fileRef);
  };

  const mouseLeaveHandler = () => {
    setIsHover(null);
  };

const clickHandler = () => {
  window.open(fileItem.downloadURL, '_blank');
}

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
      className="flex bg-white w-full items-center justify-between text-ms-light-text hover:bg-ms-white-hover hover:text-black hover:cursor-pointer rounded"
      key={fileItem.fileRef}
      onMouseOver={() => mouseOverHandler(fileItem.fileRef)}
      onMouseLeave={mouseLeaveHandler}
    >
      <div className="flex justify-between w-full items-center px-4 py-2 border-solid border-b-[0.5px] border-ms-input-hover"
      onClick={clickHandler}
      >
        <div className="w-9 h-9 bg-ms-blue text-white-text uppercase font-semibold items-center justify-center text-sm rounded-md">
          <div className="max-w-[36px] h-6 text-center leading-9">
            {filItemMeta?.customMetadata.extension}
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
              {`${formatFileSize(filItemMeta?.size)}`}
            </span>
            <span>{filItemMeta?.contentType.split("/")[0]}</span>
          </div>
        </div>
        {isHover === fileItem.fileRef && (
          <button
            onClick={(e) => removeFileHandler(e, fileItem)}
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


function formatFileSize(bytes) {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}