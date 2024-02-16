import getLastTimeOfDay, { getNextMonday9AM } from "../../utils/getDates";
import {
  BsTrash3,
  BsCalendarPlus,
  BsCalendarDate,
  BsCalendarCheck,
} from "react-icons/bs";

const DueItems = ({
  onItemClick,
  getCalendarReferenceProps,
  onPickADateClick,
  isRemoveDueButtonShow,
  onRemoveDueButtonClick,
}) => {
  const today = getLastTimeOfDay();
  const todayDayString = today.toString().slice(0, 3);

  const tomorrow = getLastTimeOfDay(1);
  const tomorrowDayString = tomorrow.toString().slice(0, 3);

  const nextMonday = new Date(getNextMonday9AM().setHours(23, 59, 59));
  const nextMondayDayString = nextMonday.toString().slice(0, 3);

  const addDueDateHandler = (input) => {
    switch (input) {
      case "today":
        onItemClick(today);
        break;
      case "tomorrow":
        onItemClick(tomorrow);
        break;
      case "nextWeek":
        onItemClick(nextMonday);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="bg-white py-1.5 rounded-sm min-w-[200px] max-w-[290px] animate-slideFadeDown5 text-black"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
      }}
    >
      <div
        className="font-semibold text-sm px-2 pt-2 pb-3 text-center mb-1.5"
        style={{ borderBottom: "1px solid #edebe9" }}
      >
        Due
      </div>
      <ul>
        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
            onClick={() => addDueDateHandler("today")}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
              <BsCalendarDate
                style={{ marginLeft: "4px", marginRight: "14px" }}
              />
              <span className="px-1 py-0 grow">Today </span>
              <span className="pl-5 text-right" style={{ color: "#797775" }}>
                {todayDayString}
              </span>
            </div>
          </button>
        </li>
        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
            onClick={() => addDueDateHandler("tomorrow")}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
              <BsCalendarPlus
                style={{ marginLeft: "4px", marginRight: "14px" }}
              />
              <span className="px-1 py-0 grow">Tomorrow </span>
              <span className="pl-5 text-right" style={{ color: "#797775" }}>
                {tomorrowDayString}
              </span>
            </div>
          </button>
        </li>
        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
            onClick={() => addDueDateHandler("nextWeek")}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
              <BsCalendarPlus
                style={{ marginLeft: "4px", marginRight: "14px" }}
              />
              <span className="px-1 py-0 grow">Next week </span>
              <span className="pl-5 text-right" style={{ color: "#797775" }}>
                {nextMondayDayString}
              </span>
            </div>
          </button>
        </li>
        <li
          className="mx-0 my-1.5 h-0 p-0 border-none "
          style={{
            borderBottom: "1px solid #edebe9",
            backgroundColor: "#edebe9",
          }}
        />
        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
            {...getCalendarReferenceProps({
              onClick() {
                onPickADateClick();
              },
            })}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
              <BsCalendarCheck
                style={{ marginLeft: "4px", marginRight: "14px" }}
              />
              <span className="px-1 py-0 grow">Pick a date</span>
            </div>
          </button>
        </li>
        {isRemoveDueButtonShow && (
          <>
          <li
          className="mx-0 my-1.5 h-0 p-0 border-none "
          style={{
            borderBottom: "1px solid #edebe9",
            backgroundColor: "#edebe9",
          }}
        />
          <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
            <button
              onClick={onRemoveDueButtonClick}
              className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
            >
              <div className="flex items-center max-w-full text-ms-warning">
                <BsTrash3 style={{ marginLeft: "4px", marginRight: "14px" }} />
                <span className="px-1 py-0 grow">Remove due date</span>
              </div>
            </button>
          </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default DueItems;