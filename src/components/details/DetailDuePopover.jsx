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
import { getCustomFormatDateString } from "../../utils/getDates";
import { useSelector } from "react-redux";
import { BsXLg } from "react-icons/bs";
import { IoCalendarOutline } from "react-icons/io5";
import DueCalendar from "../addtask/DueCalendar";
import DueItems from "../addtask/DueItems";
import { useLocation } from "react-router-dom";
import { useChangeOptionTodoApiMutation } from "../../api/todoApiSlice";
import { auth } from "../../firebase";

const DetailDuePopover = ({ taskId, todo }) => {
  const location = useLocation();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dueText, setDueText] = useState("");
  const [isHover, setIsHover] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const userId = auth.currentUser.uid;

  const [changeOptionTodoApi] = useChangeOptionTodoApiMutation();

  const todoDuedate = todo?.dueDate;

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
    refs: calendarRefs,
    floatingStyles: calendarFloatingStyles,
    context: calendarContext,
  } = useFloating({
    open: calendarOpen,
    onOpenChange: setCalendarOpen,
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
    getReferenceProps: getCalendarReferenceProps,
    getFloatingProps: getCalendarFloatingProps,
  } = useInteractions([useClick(calendarContext), useDismiss(calendarContext)]);

  const floatingRef = useMergeRefs([
    popoverRefs.setReference,
    calendarRefs.setReference,
  ]);

  const dueButtonProps = getPopoverReferenceProps({
    onClick() {
      setCalendarOpen(false);
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

  const addDueHandler = (dateObj) => {
    const content = dateObj.toISOString();
    // 선택한 dateObj의 isoString을 해당 task remind에 저장함

    console.log('addDueHandler');

    changeOptionTodoApi({
      todoId: taskId,
      userId,
      option: "dueDate",
      content,
      currentLocation: location.pathname,
    });

    setPopoverOpen(false);
  };

  const resetDueHandler = () => {
    // 해당 task remind를 empty string으로 변경함

    changeOptionTodoApi({
      todoId: taskId,
      userId,
      option: "dueDate",
      content: "",
      currentLocation: location.pathname,
    });

    setPopoverOpen(false);
  };

  const closePopoverHandler = () => {
    setPopoverOpen(false);
  };

  const calendarSaveButtonHander = (dateObj) => {
    addDueHandler(dateObj);
    setCalendarOpen(false);
  };

  useEffect(() => {
    if (todoDuedate) {
      setDueText(getCustomFormatDateString(new Date(todoDuedate), "dueDate"));
    }
  }, [todoDuedate]);

  return (
    <>
      <div
        className="flex bg-white w-full items-center justify-between text-ms-light-text hover:bg-ms-white-hover hover:text-black border-solid border-b-[0.5px] border-ms-input-hover"
        // style={{ borderBottom: "solid 0.5px #edebe9" }}
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {todoDuedate ? (
          <div
            className="flex justify-between w-full p-4"
            style={{ color: "#2564cf" }}
          >
            <div
              className={`flex items-center flex-auto ${
                dueText.includes("Overdue") ? "text-ms-warning" : "text-ms-blue"
              }`}
              ref={floatingRef}
              {...dueButtonProps}
            >
              <IoCalendarOutline size="17px" />
              <div className="mx-4">
                <div>{dueText}</div>
              </div>
            </div>
            {isHover && (
              <button
                onClick={resetDueHandler}
                className=""
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
            {...dueButtonProps}
          >
            <IoCalendarOutline size="17px" color="#797775" />
            <span className="mx-4">Add due date</span>
          </div>
        )}
      </div>

      {calendarOpen && (
        <div
          ref={calendarRefs.setFloating}
          {...getCalendarFloatingProps()}
          style={{ ...calendarFloatingStyles, zIndex: 40 }}
        >
          <DueCalendar onCalendarSaveClick={calendarSaveButtonHander} />
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
          <DueItems
            onItemClick={addDueHandler}
            getCalendarReferenceProps={getCalendarReferenceProps}
            onPickADateClick={closePopoverHandler}
            isRemoveDueButtonShow={false}
            onRemoveDueButtonClick={resetDueHandler}
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
          Remove due date
        </div>
      )}
    </>
  );
};

export default DetailDuePopover;
