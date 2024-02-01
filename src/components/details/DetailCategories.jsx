import {
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { useState } from "react";
import { BsCheck2, BsFillCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import DetailCategoryItems from "./DetailCategoryItems";

import {
  useAddCategoryTodoApiMutation,
  useRemoveCategoryTodoApiMutation,
} from "../../api/todoApiSlice";
import { auth } from "../../firebase";

const DetailCategories = ({ taskId, todo }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const userId = auth.currentUser.uid;

  const [addCategoryTodoApi] = useAddCategoryTodoApiMutation();
  const [removeCategoryTodoApi] = useRemoveCategoryTodoApiMutation();

  const todoCategory = todo?.category ?? [];

  const categoryHandler = (category) => {
    if (!todoCategory.includes(category)) {
      addCategoryTodoApi({ todoId: taskId, userId, category });
    } else {
      removeCategoryTodoApi({ todoId: taskId, userId, category });
    }
  };

  const {
    refs: popoverRefs,
    floatingStyles: popoverFloatingStyles,
    context: popoverContext,
  } = useFloating({
    open: popoverOpen,
    onOpenChange: setPopoverOpen,
    middleware: [offset(5), flip(), shift({ padding: 10 })],
  });

  const {
    getReferenceProps: getPopoverReferenceProps,
    getFloatingProps: getPopoverFloatingProps,
  } = useInteractions([useClick(popoverContext), useDismiss(popoverContext)]);

  return (
    <>
      <DetailCategoryItems
        taskId={taskId}
        popoverRefs={popoverRefs}
        getPopoverReferenceProps={getPopoverReferenceProps}
        categoryHandler={categoryHandler}
        todo={todo}
      />

      {popoverOpen && (
        <div
          ref={popoverRefs.setFloating}
          {...getPopoverFloatingProps()}
          style={{ ...popoverFloatingStyles, zIndex: 50 }}
        >
          <div
            className="bg-white py-1.5 rounded-sm min-w-[260px] max-w-[290px]"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
            }}
          >
            <ul className="text-black">
              <li
                className={`text-left min-h-[38px] flex relative items-center font-normal text-sm px-4 ${
                  todoCategory.includes("blue")
                    ? "bg-ms-white-hover"
                    : "hover:bg-ms-white-hover"
                }`}
                onClick={() => categoryHandler("blue")}
              >
                <BsFillCircleFill
                  size="12px"
                  color="rgb(224, 247, 253)"
                  style={{
                    padding: "1px",
                    background: "blue",
                    borderRadius: "50%",
                  }}
                />
                <span className="text-left px-2">Blue category</span>
                {todoCategory.includes("blue") && (
                  <span className="ml-auto">
                    <BsCheck2 />
                  </span>
                )}
              </li>

              <li
                className={`text-left min-h-[38px] flex relative items-center font-normal text-sm px-4 ${
                  todoCategory.includes("green")
                    ? "bg-ms-white-hover"
                    : "hover:bg-ms-white-hover"
                }`}
                onClick={() => categoryHandler("green")}
              >
                <BsFillCircleFill
                  size="12px"
                  color="rgb(233, 249, 232)"
                  style={{
                    padding: "1px",
                    background: "green",
                    borderRadius: "50%",
                  }}
                />
                <span className="text-left px-2">Green category</span>
                {todoCategory.includes("green") && (
                  <span className="ml-auto">
                    <BsCheck2 />
                  </span>
                )}
              </li>

              <li
                className={`text-left min-h-[38px] flex relative items-center font-normal text-sm px-4 ${
                  todoCategory.includes("orange")
                    ? "bg-ms-white-hover"
                    : "hover:bg-ms-white-hover"
                }`}
                onClick={() => categoryHandler("orange")}
              >
                <BsFillCircleFill
                  size="12px"
                  color="rgb(255, 241, 224)"
                  style={{
                    padding: "1px",
                    background: "orange",
                    borderRadius: "50%",
                  }}
                />
                <span className="text-left px-2">Orange category</span>
                {todoCategory.includes("orange") && (
                  <span className="ml-auto">
                    <BsCheck2 />
                  </span>
                )}
              </li>

              <li
                className={`text-left min-h-[38px] flex relative items-center font-normal text-sm px-4 ${
                  todoCategory.includes("purple")
                    ? "bg-ms-white-hover"
                    : "hover:bg-ms-white-hover"
                }`}
                onClick={() => categoryHandler("purple")}
              >
                <BsFillCircleFill
                  size="12px"
                  color="rgb(240, 236, 246)"
                  style={{
                    padding: "1px",
                    background: "purple",
                    borderRadius: "50%",
                  }}
                />
                <span className="text-left px-2">Purple category</span>
                {todoCategory.includes("purple") && (
                  <span className="ml-auto">
                    <BsCheck2 />
                  </span>
                )}
              </li>

              <li
                className={`text-left min-h-[38px] flex relative items-center font-normal text-sm px-4 ${
                  todoCategory.includes("red")
                    ? "bg-ms-white-hover"
                    : "hover:bg-ms-white-hover"
                }`}
                onClick={() => categoryHandler("red")}
              >
                <BsFillCircleFill
                  size="12px"
                  color="rgb(252, 233, 234)"
                  style={{
                    padding: "1px",
                    background: "red",
                    borderRadius: "50%",
                  }}
                />
                <span className="text-left px-2">Red category</span>
                {todoCategory.includes("red") && (
                  <span className="ml-auto">
                    <BsCheck2 />
                  </span>
                )}
              </li>

              <li
                className={`text-left min-h-[38px] flex relative items-center font-normal text-sm px-4 ${
                  todoCategory.includes("yellow")
                    ? "bg-ms-white-hover"
                    : "hover:bg-ms-white-hover"
                }`}
                onClick={() => categoryHandler("yellow")}
              >
                <BsFillCircleFill
                  size="12px"
                  color="rgb(255, 253, 224)"
                  style={{
                    padding: "1px",
                    background: "gold",
                    borderRadius: "50%",
                  }}
                />
                <span className="text-left px-2">Yellow category</span>
                {todoCategory.includes("yellow") && (
                  <span className="ml-auto">
                    <BsCheck2 />
                  </span>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailCategories;
