import { useEffect, useRef, useState } from "react";
import {
  BsCheckCircle,
  BsCheckCircleFill,
  BsCircle,
  BsXLg,
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { addActiveStep } from "../../store/activeSlice";
import {
  useChangeStepApiMutation,
  useCompleteStepApiMutation,
  useRemoveStepApiMutation,
} from "../../api/todoApiSlice";
import { auth } from "../../firebase";

const DetailStepItem = ({ step, taskId }) => {
  const [isCheckHover, setIsCheckHover] = useState(false);
  const dispatch = useDispatch();
  const isActive = useSelector((state) => state.active.activeStep);

  const userId = auth.currentUser.uid;
  const [completeStepApi] = useCompleteStepApiMutation();
  const [removeStepApi] = useRemoveStepApiMutation();
  const [changeStepApi] = useChangeStepApiMutation();

  const activeStepHandler = () => {
    dispatch(addActiveStep(step.id));
  };

  const completeStepHandler = () => {
    completeStepApi({ todoId: taskId, userId, stepId: step.id });
  };

  const removeStepHandler = () => {
    removeStepApi({ todoId: taskId, userId, stepId: step.id });
  };

  const inputRef = useRef();
  const [isHover, setIsHover] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [newStep, setNewStep] = useState("");
  const [isEscaped, setIsEscaped] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const stepEditHandler = (event) => {
    setNewStep(event.target.value);
  };

  const blurHandler = () => {
    if (!isEscaped) {
      if (!newStep) {
        setNewStep(step.content);
        return;
      }

      changeStepApi({ todoId: taskId, userId, stepId: step.id, value: newStep });
    }
    setIsFocused(false);
  };

  const focusHandler = () => {
    setIsFocused(true);
    setIsEscaped(false);
  };

  useEffect(() => {
    setNewStep(step.content);
  }, [step]);

  const keyDownHandler = (event) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
    if (event.key === "Escape") {
      setIsEscaped(true);
    }
  };

  useEffect(() => {
    if (isEscaped) {
      inputRef.current.blur();
      setNewStep(step.content);
    }
  }, [isEscaped]);

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

  return (
    <div
      className={`flex flex-col w-full after:block after:content-[''] after:w-divider after:border-b after:ml-auto `}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className={`flex items-center justify-between p-4 w-full hover:bg-ms-white-hover 
        ${
          isActive === step.id
            ? "bg-ms-active-tertiary"
            : isHover
            ? "bg-ms-white-hover"
            : "bg-white"
        }
        `}
        onClick={activeStepHandler}
      >
        <span
          className="flex items-center justify-center hover:cursor-pointer px-0.5 text-ms-blue dark:text-ms-blue-hover"
          onClick={completeStepHandler}
          onMouseEnter={() => setIsCheckHover(true)}
          onMouseLeave={() => setIsCheckHover(false)}
        >
          {step.complete ? (
            <BsCheckCircleFill size="16px" />
          ) : isCheckHover ? (
            <BsCheckCircle size="16px" />
          ) : (
            <BsCircle size="16px" />
          )}
        </span>

        <span className="w-full px-4">
          <input
            ref={inputRef}
            rows="1"
            value={newStep}
            onChange={stepEditHandler}
            onBlur={blurHandler}
            onFocus={focusHandler}
            onKeyDown={keyDownHandler}
            className={`${
              isActive === step.id
                ? "bg-ms-active-tertiary"
                : isHover
                ? "bg-ms-white-hover"
                : "bg-white"
            }`}
            style={{
              height: "21px",
              border: "none",
              outline: "none",
              resize: "none",
              textDecoration: step.complete && !isFocused ? "line-through" : "",
            }}
          />
        </span>

        <button
          onClick={removeStepHandler}
          ref={tooltipRefs.setReference}
          {...getTooltipReferenceProps()}
        >
          <BsXLg size="16px" style={{ paddingRight: "2px" }} />
        </button>
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
          Delete step
        </div>
      )}
    </div>
  );
};

export default DetailStepItem;

/**
 * TODO
 * 전부 지우면 삭제 확인메세지 modal 이후 삭제하기
 */
