import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsArrowDown, BsArrowUp, BsChevronDown } from "react-icons/bs";
import { useEffect } from "react";
import {
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";

const RemindCalendar = ({ onCalendarSaveClick, remindValue }) => {
  const initialValue = remindValue ? new Date(remindValue) : new Date();
  const [remindSelectedDate, setRemindSelectedDate] = useState(initialValue);

  const options = { year: "numeric", month: "long" };

  return (
    <div
      className="ReactDatePickerWrapper animate-slideFadeDown5"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.133) 0px 6.4px 14.4px 0px, rgba(0, 0, 0, 0.11) 0px 1.2px 3.6px 0px",
      }}
    >
      <ReactDatePicker
        selected={remindSelectedDate}
        onChange={(date) => setRemindSelectedDate(date)}
        showTimeInput
        customTimeInput={<CustomTimeInput />}
        inline
        renderCustomHeader={({ decreaseMonth, increaseMonth, date }) => (
          <div
            className="flex items-center justify-between py-1 bg-white text-ms-text-dark"
          >
            <p className="text-sm font-semibold px-4 ml-2">
              {date.toLocaleDateString(undefined, options)}
            </p>
            <div className="flex px-2">
              <button
                className="flex items-center justify-center w-7 h-7 hover:bg-ms-white-hover"
                onClick={decreaseMonth}
              >
                <BsArrowUp size="14px" />
              </button>
              <button
                className="flex items-center justify-center w-7 h-7 hover:bg-ms-white-hover"
                onClick={increaseMonth}
              >
                <BsArrowDown size="14px" />
              </button>
            </div>
          </div>
        )}
      >
        <div
          style={{
            textAlign: "center",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          <button
            className="w-44 h-8 bg-ms-blue text-white rounded-md mb-2 hover:bg-ms-blue-hover"
            style={{ transition: "background-color 0.1s" }}
            onClick={() => {
              onCalendarSaveClick(remindSelectedDate);
            }}
          >
            Save
          </button>
        </div>
      </ReactDatePicker>
    </div>
  );
};

export default RemindCalendar;

const CustomTimeInput = ({ date, value, onChange }) => {
  // date: date객체, value: 시간 string, onChange: 인자로 전달되는 값
  const [hourValue, setHourValue] = useState(value.slice(0, 2));
  const [minuteValue, setMinuteValue] = useState(value.slice(3));

  const [popoverOpen, setPopoverOpen] = useState(false);
  const {
    refs: popoverRefs,
    floatingStyles: popoverFloatingStyles,
    context: popoverContext,
  } = useFloating({
    open: popoverOpen,
    placement: "bottom",
    onOpenChange: setPopoverOpen,
    middleware: [offset(5), flip(), shift({ padding: 10 })],
  });
  const {
    getReferenceProps: getPopoverReferenceProps,
    getFloatingProps: getPopoverFloatingProps,
  } = useInteractions([useClick(popoverContext), useDismiss(popoverContext)]);
  const popoverOpenHandler = () => {
    setPopoverOpen(true);
  };
  const popoverCloseHandler = () => {
    setPopoverOpen(false);
  };

  const hourChangeHandler = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      const numberValue = parseInt(value, 10);
      if (numberValue >= 0 && numberValue <= 23 && value.length <= 2) {
        setHourValue(value);
      } else if (value === "") {
        setHourValue("");
      }
    }
  };
  const minuteChangeHandler = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      const numberValue = parseInt(value, 10);
      if (numberValue >= 0 && numberValue <= 59 && value.length <= 2) {
        setMinuteValue(value);
      } else if (value === "") {
        setMinuteValue("");
      }
    }
  };

  useEffect(() => {
    onChange(`${hourValue}:${minuteValue}`);
  }, [hourValue, minuteValue]);

  return (
    <div className="flex" ref={popoverRefs.setReference}>
      <div className="flex p-1 border border-gray-200">
        <div className="flex">
          <div className="flex justify-center">
            <input
              className="max-w-[20px] text-center bg-white"
              type="text"
              value={hourValue}
              onChange={hourChangeHandler}
            />
          </div>

          <p className="px-1">:</p>
          <div>
            <input
              className="max-w-[20px] text-center bg-white"
              type="text"
              value={minuteValue}
              onChange={minuteChangeHandler}
            />
          </div>
        </div>
        <button
          className="flex justify-center items-center w-5 ml-12"
          onClick={popoverOpenHandler}
          {...getPopoverReferenceProps()}
        >
          <BsChevronDown />
        </button>
      </div>

      {popoverOpen && (
        <div
          ref={popoverRefs.setFloating}
          style={{
            ...popoverFloatingStyles,
            zIndex: 40,
          }}
          {...getPopoverFloatingProps()}
        >
          <RemindTimeItems
            setHourValue={setHourValue}
            setMinuteValue={setMinuteValue}
            popoverCloseHandler={popoverCloseHandler}
          />
        </div>
      )}
    </div>
  );
};

const RemindTimeItems = ({
  setHourValue,
  setMinuteValue,
  popoverCloseHandler,
}) => {

  const buttonClickHandler = (option) => {
    switch (option) {
      case "morning":
        setHourValue("09");
        break;
      case "noon":
        setHourValue("12");
        break;
      case "afternoon":
        setHourValue("17");
        break;
      case "evening":
        setHourValue("20");
        break;
      default:
        break;
    }
    setMinuteValue("00");
    popoverCloseHandler();
  };

  return (
    <div
      className="bg-white py-1.5 rounded-sm min-w-[200px] max-w-[290px] animate-slideFadeDown5 text-ms-text-dark"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
      }}
    >
      <ul>
        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
            onClick={() => buttonClickHandler("morning")}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
              <span className="px-1 py-0 grow">Morning</span>
              <span className="pl-5 text-right" style={{ color: "#797775" }}>
                9:00 AM
              </span>
            </div>
          </button>
        </li>
        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
            onClick={() => buttonClickHandler("noon")}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
              <span className="px-1 py-0 grow">Noon</span>
              <span className="pl-5 text-right" style={{ color: "#797775" }}>
                12:00 PM
              </span>
            </div>
          </button>
        </li>
        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
            onClick={() => buttonClickHandler("afternoon")}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
              <span className="px-1 py-0 grow">Afternoon</span>
              <span className="pl-5 text-right" style={{ color: "#797775" }}>
                17:00 PM
              </span>
            </div>
          </button>
        </li>

        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
            onClick={() => buttonClickHandler("evening")}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
              <span className="px-1 py-0 grow">Evening</span>
              <span className="pl-5 text-right" style={{ color: "#797775" }}>
                20:00 PM
              </span>
            </div>
          </button>
        </li>
      </ul>
    </div>
  );
};
