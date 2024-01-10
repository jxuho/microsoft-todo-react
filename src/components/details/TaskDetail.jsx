import { useDispatch, useSelector } from "react-redux";
import { closeDetail, closeSidebar, setDetailWidth, setDialog } from "../../store/uiSlice";
import { LuPanelRightClose } from "react-icons/lu";
import { BsTrash3 } from "react-icons/bs";
import { useCallback, useEffect, useRef, useState } from "react";
import { getCustomFormatDateString } from "../../utils/getDates";
import Details from "./Details";
import {
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import useViewport from "../../hooks/useViewPort";
import {
  useGetUiApiQuery,
  useSetDetailWidthApiMutation,
} from "../../api/uiApiSlice";

const TaskDetail = () => {
  const dispatch = useDispatch();
  const activeTasks = useSelector((state) => state.active.activeTasks);
  const [closeTooltipOpen, setCloseTooltipOpen] = useState(false);
  const [removeTooltipOpen, setRemoveTooltipOpen] = useState(false);
  const detailRef = useRef();
  const [isResizing, setIsResizing] = useState(false);
  const [resizerPosition, setResizerPosition] = useState(360);
  const [isHover, setIsHover] = useState(false);
  const [createdTime, setCreatedTime] = useState("");
  const [firstRender, setFirstRender] = useState(true);
  const detailWidth = useSelector((state) => state.ui.detailWidth);
  const user = useSelector((state) => state.auth.user);
  const todos = useSelector((state) => state.todo.todos);

  const {
    data: uiData,
    isLoading: isUiLoading,
    isSuccess: isUiSuccess,
    isError: isUiError,
    error: uiError,
  } = useGetUiApiQuery(user?.uid);
  const [setDetailWidthApi] = useSetDetailWidthApiMutation();

  // console.log('taskDetail');

  useEffect(() => {
    if (firstRender) {
      // first render일 때,
      if (!isUiLoading && isUiSuccess) {
        // user가 login했다면, firestore에서 detailwidth를 가지고 온다
        if (!uiData) {
          setResizerPosition(360);
        } else {
          setResizerPosition(uiData?.detailWidth);
        }
        setFirstRender(false);
      }
    }
  }, [firstRender, isUiLoading, uiData, detailWidth]);

  useEffect(() => {
    if (!isResizing && !firstRender) {
      dispatch(setDetailWidth(resizerPosition));

      const setResizerPosition = setTimeout(() => {
        setDetailWidthApi({ user, value: resizerPosition });
      }, 300);
      return () => clearTimeout(setResizerPosition);
    }
  }, [
    isResizing,
    resizerPosition,
    firstRender,
    dispatch,
    user,
    setDetailWidthApi,
  ]);

  const closeDetailHandler = () => {
    dispatch(closeDetail());
  };

  const removeTaskHandler = () => {
    dispatch(setDialog(true));
  };

  const detailId = activeTasks[0];

  useEffect(() => {
    // set created time text
    const todoDetail = todos.find((todo) => todo.id === detailId);
    if (!todoDetail) return;
    setCreatedTime(
      getCustomFormatDateString(new Date(todoDetail.created), "plain")
    );
  }, [detailId, todos]);

  const resizerMouseDownHandler = () => {
    setIsResizing(true);
  };

  const finishResizeHandler = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resizeHandler = useCallback(
    // resizer 이동
    (event) => {
      if (!isResizing) return;
      let calculatedPosition =
        detailRef.current.getBoundingClientRect().right - event.clientX;
      if (calculatedPosition > 700) {
        calculatedPosition = 700;
      }
      if (calculatedPosition < 360) {
        calculatedPosition = 360;
      }
      setResizerPosition(calculatedPosition);
    },
    [isResizing]
  );

  useEffect(() => {
    document.addEventListener("mousemove", resizeHandler); // resizer 이동조건
    document.addEventListener("mouseup", finishResizeHandler); // resizer 완료조건
    return () => {
      document.removeEventListener("mousemove", resizeHandler);
      document.removeEventListener("mouseup", finishResizeHandler);
    };
  }, [resizeHandler, finishResizeHandler]);

  const {
    refs: closeTooltipRefs,
    floatingStyles: closeTooltipFloatingStyles,
    context: closeTooltipContext,
  } = useFloating({
    open: closeTooltipOpen,
    onOpenChange: setCloseTooltipOpen,
    placement: "top",
    middleware: [offset(5), flip(), shift({ padding: 10 })],
  });

  const {
    getReferenceProps: getCloseTooltipReferenceProps,
    getFloatingProps: getCloseTooltipFloatingProps,
  } = useInteractions([
    useHover(closeTooltipContext, { delay: { open: 300, close: 0 } }),
    useDismiss(closeTooltipContext, {
      referencePress: true,
    }),
  ]);
  const {
    refs: removeTooltipRefs,
    floatingStyles: removeTooltipFloatingStyles,
    context: removeTooltipContext,
  } = useFloating({
    open: removeTooltipOpen,
    onOpenChange: setRemoveTooltipOpen,
    placement: "top",
    middleware: [offset(5), flip(), shift({ padding: 10 })],
  });

  const {
    getReferenceProps: getRemoveTooltipReferenceProps,
    getFloatingProps: getRemoveTooltipFloatingProps,
  } = useInteractions([
    useHover(removeTooltipContext, { delay: { open: 300, close: 0 } }),
    useDismiss(removeTooltipContext, {
      referencePress: true,
    }),
  ]);

  const { width: viewportWidth } = useViewport();
  const isDetailOpen = useSelector((state) => state.ui.detail);

  useEffect(() => {
    if (viewportWidth - detailWidth < 50 && viewportWidth > 450) {
      setResizerPosition(viewportWidth - 50);
    } else if (viewportWidth <= 450) {
      setResizerPosition(viewportWidth);
    }
  }, [viewportWidth, detailWidth]);


  useEffect(() => {
    if (viewportWidth - detailWidth < 560) {
      dispatch(closeSidebar());
    }
  }, [viewportWidth, detailWidth, dispatch]);


  return (
    isDetailOpen && (
      <div
        className="flex flex-row max-w-[700px] box-border z-30 h-full"
        ref={detailRef}
        style={
          viewportWidth - detailWidth < 560 && isDetailOpen
            ? {
                width: detailWidth,
                transition: "width 180ms ease",
                position: "absolute",
                right: "0",
              }
            : { width: detailWidth, transition: "width 180ms ease" }
        }
      >
        <div
          className={`w-1 absolute h-full m-0 p-0 box-border bg-ms-scrollbar opacity-0 translate-x-1 ${
            (isHover || isResizing) && "opacity-40 cursor-ew-resize"
          } `}
          onMouseDown={resizerMouseDownHandler} // resize 시작조건
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          style={{ right: resizerPosition, zIndex: "200" }}
        ></div>

        <div
          className="flex flex-col w-full h-full relative flex-1 box-border bg-ms-background"
          style={{
            boxShadow:
              "0px 1.2px 3.6px rgba(0,0,0,0.1), 0px 6.4px 14.4px rgba(0,0,0,0.1)",
          }}
        >
          {detailId && <Details taskId={detailId} todos={todos} />}

          <div className="flex flex-col before:content-[''] before:h-[0.5px] before:w-full before:bg-ms-bg-border before:top-0 before:left-0">
            <div className="flex items-center justify-between py-4 px-0 my-0 mx-6">
              <button
                onClick={closeDetailHandler}
                ref={closeTooltipRefs.setReference}
                {...getCloseTooltipReferenceProps()}
              >
                <LuPanelRightClose size="16px" />
              </button>

              <p className="text-xs leading-5 text-ms-light-text">
                Created {createdTime}
              </p>

              <button
                onClick={removeTaskHandler}
                ref={removeTooltipRefs.setReference}
                {...getRemoveTooltipReferenceProps()}
              >
                <BsTrash3 size="16px" />
              </button>
            </div>
          </div>
        </div>

        {closeTooltipOpen && (
          <div
            ref={closeTooltipRefs.setFloating}
            {...getCloseTooltipFloatingProps()}
            style={{
              ...closeTooltipFloatingStyles,
              boxShadow:
                "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
              zIndex: 50,
            }}
            className="bg-white py-1.5 rounded-sm px-2 text-xs"
          >
            Hide detail view
          </div>
        )}
        {removeTooltipOpen && (
          <div
            ref={removeTooltipRefs.setFloating}
            {...getRemoveTooltipFloatingProps()}
            style={{
              ...removeTooltipFloatingStyles,
              boxShadow:
                "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
              zIndex: 50,
            }}
            className="bg-white py-1.5 rounded-sm px-2 text-xs"
          >
            Delete task
          </div>
        )}
      </div>
    )
  );
};

export default TaskDetail;
