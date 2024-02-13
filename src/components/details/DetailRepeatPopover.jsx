import {
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useMergeRefs,
} from "@floating-ui/react";
import { useEffect, useState } from "react";
import { getDayOfWeek } from "../../utils/getDates";
import { BsRepeat, BsXLg } from "react-icons/bs";
import RepeatCustom from "../addtask/RepeatCustom";
import RepeatItems from "../addtask/RepeatItems";
import { getRepeatButtonText } from "../addtask/RepeatPopover";
import { useLocation } from "react-router-dom";
import { useChangeOptionTodoApiMutation } from "../../api/todoApiSlice";
import { auth } from "../../firebase";

const DetailRepeatPopover = ({ taskId, todo }) => {
  const location = useLocation();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [repeatText, setRepeatText] = useState({ title: "", description: "" });
  const [isHover, setIsHover] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const userId = auth.currentUser?.uid;
  const [changeOptionTodoApi] = useChangeOptionTodoApiMutation();

  const todoRepeatRule = todo?.repeatRule

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
    refs: customRefs,
    floatingStyles: customFloatingStyles,
    context: customContext,
  } = useFloating({
    open: customOpen,
    onOpenChange: setCustomOpen,
    middleware: [offset(15), flip(), shift({ padding: 10 })],
  });

  const {
    getReferenceProps: getPopoverReferenceProps,
    getFloatingProps: getPopoverFloatingProps,
  } = useInteractions([
    useClick(popoverContext),
    useDismiss(popoverContext, {
      referencePress: true,
    }),
  ]);

  const {
    getReferenceProps: getCustomReferenceProps,
    getFloatingProps: getCustomFloatingProps,
  } = useInteractions([useClick(customContext), useDismiss(customContext)]);

  const floatingRef = useMergeRefs([
    popoverRefs.setReference,
    customRefs.setReference,
  ]);

  const repeatButtonProps = getPopoverReferenceProps({
    onClick() {
      setCustomOpen(false);
    },
  });

  const {
    refs: tooltipRefs,
    floatingStyles: tooltipFloatingStyles,
    context: tooltipContext,
  } = useFloating({
    open: tooltipOpen,
    onOpenChange: setTooltipOpen,
    placement: "top",
    middleware: [offset(-3), flip(), shift({ padding: 10 })],
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

  const addRepeatHandler = (input) => {
    switch (input) {
      case "daily":

          changeOptionTodoApi({
            todoId: taskId,
            userId,
            option: "repeatRule",
            content: "1-day",
            currentLocation: location.pathname,
          });

        break;
      case "weekdays":

          changeOptionTodoApi({
            todoId: taskId,
            userId,
            option: "repeatRule",
            content: "1-week-mon-tue-wed-thu-fri",
            currentLocation: location.pathname,
          });

        break;
      case "weekly":
        const currentDay = getDayOfWeek(new Date());

          changeOptionTodoApi({
            todoId: taskId,
            userId,
            option: "repeatRule",
            content: "1-week-" + currentDay,
            currentLocation: location.pathname,
          });

        break;
      case "monthly":
          changeOptionTodoApi({
            todoId: taskId,
            userId,
            option: "repeatRule",
            content: "1-month",
            currentLocation: location.pathname,
          });

        break;
      case "yearly":

          changeOptionTodoApi({
            todoId: taskId,
            userId,
            option: "repeatRule",
            content: "1-year",
            currentLocation: location.pathname,
          });

        break;
      default:
        break;
    }
    setPopoverOpen(false);
  };

  const resetRepeatHandler = () => {

      changeOptionTodoApi({
        todoId: taskId,
        userId,
        option: "repeatRule",
        content: "",
        currentLocation: location.pathname,
      });


    setPopoverOpen(false);
  };

  const closePopoverHandler = () => {
    setPopoverOpen(false);
  };

  const setRepeatRule = (content, option) => {

      changeOptionTodoApi({
        todoId: taskId,
        userId,
        option,
        content,
        currentLocation: location.pathname,
      });

  };

  useEffect(() => {
    if (!todoRepeatRule) return;
    const repeatButtonText = getRepeatButtonText(todoRepeatRule).split(",");
    setRepeatText({
      title: repeatButtonText[0],
      description: repeatButtonText.slice(1).join(","),
    });
  }, [todoRepeatRule]);

  return (
    <>
      <div
        className="flex bg-white w-full items-center justify-between text-ms-light-text hover:bg-ms-white-hover hover:text-black border-solid border-b-[0.5px] border-ms-input-hover"
        // style={{ borderBottom: "solid 0.5px #edebe9" }}
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {todoRepeatRule ? (
          <div
            className={`flex w-full text-ms-blue ${
              repeatText.description ? "px-4 py-2" : "p-4"
            }`}
            // style={{ color: "#2564cf" }}
          >
            <div
              className="flex items-center flex-auto text-ms-blue"
              ref={floatingRef}
              {...repeatButtonProps}
            >
              <BsRepeat size="17px" />
              <div className="mx-4 ">
                <div>{repeatText.title}</div>
                <div
                  className="text-ms-light-text"
                  style={{ fontSize: "11px" }}
                >
                  {repeatText.description}
                </div>
              </div>
            </div>
            {isHover && (
              <button
                onClick={resetRepeatHandler}
                className="ml-auto"
                ref={tooltipRefs.setReference}
                {...getTooltipReferenceProps()}
              >
                <BsXLg size="16px" style={{ paddingRight: "2px" }} />
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex w-full items-center p-4"
            ref={floatingRef}
            {...repeatButtonProps}
          >
            <BsRepeat size="17px" color="#797775" />
            <span className="mx-4">Repeat</span>
          </div>
        )}
      </div>

      {customOpen && (
        <div
          ref={customRefs.setFloating}
          {...getCustomFloatingProps()}
          style={{ ...customFloatingStyles, zIndex: 40 }}
        >
          <RepeatCustom
            setRepeatRule={setRepeatRule}
            closeCustom={() => setCustomOpen(false)}
          />
        </div>
      )}

      {popoverOpen && (
        <div
          ref={popoverRefs.setFloating}
          style={{
            ...popoverFloatingStyles,
            zIndex: 40,
          }}
          {...getPopoverFloatingProps()}
        >
          <RepeatItems
            onItemClick={addRepeatHandler}
            getCustomReferenceProps={getCustomReferenceProps}
            isNeverRepeatShow={false}
            onNeverRepeatClick={resetRepeatHandler}
            onCustomClick={closePopoverHandler}
          />
        </div>
      )}

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
          Remove recurrence
        </div>
      )}
    </>
  );
};

export default DetailRepeatPopover;

/**
 * TODO
 * 활성화됐을 때 버튼 전체 클릭 가능하도록 수정하기
 *
 *
 */
