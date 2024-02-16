import {
  BsCalendarDate,
  BsCalendarDay,
  BsCalendarMinus,
  BsCalendar3,
  BsCalendarMonth,
  BsCalendarPlus,
  BsTrash3,
} from "react-icons/bs";

const RepeatItems = ({
  onItemClick,
  getCustomReferenceProps,
  isNeverRepeatShow,
  onNeverRepeatClick,
  onCustomClick,
}) => {
  return (
    <div
      className="bg-white py-1.5 rounded-sm min-w-[200px] max-w-[290px] overflow-auto max-h-[15%] animate-slideFadeDown5 text-black"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
      }}
    >
      <div
        className="font-semibold text-sm px-2 pt-2 pb-3 text-center mb-1.5"
        style={{ borderBottom: "1px solid #edebe9" }}
      >
        Repeat
      </div>
      <ul>
        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
            onClick={() => onItemClick("daily")}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
              <BsCalendarDate
                style={{ marginLeft: "6px", marginRight: "6px" }}
              />
              <span className="px-1">Daily</span>
            </div>
          </button>
        </li>
        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
            onClick={() => onItemClick("weekdays")}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
              <BsCalendarDay
                style={{ marginLeft: "6px", marginRight: "6px" }}
              />
              <span className="px-1">Weekdays</span>
            </div>
          </button>
        </li>
        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
            onClick={() => onItemClick("weekly")}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
              <BsCalendarMinus
                style={{ marginLeft: "6px", marginRight: "6px" }}
              />
              <span className="px-1">Weekly</span>
            </div>
          </button>
        </li>
        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
            onClick={() => onItemClick("monthly")}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
              <BsCalendarMonth
                style={{ marginLeft: "6px", marginRight: "6px" }}
              />
              <span className="px-1">Monthly</span>
            </div>
          </button>
        </li>
        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
            onClick={() => onItemClick("yearly")}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
              <BsCalendar3 style={{ marginLeft: "6px", marginRight: "6px" }} />
              <span className="px-1">Yearly</span>
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
            {...getCustomReferenceProps({
              onClick() {
                onCustomClick();
              },
            })}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
              <BsCalendarPlus
                style={{ marginLeft: "6px", marginRight: "6px" }}
              />
              <span className="px-1">Custom</span>
            </div>
          </button>
        </li>
        {isNeverRepeatShow && (
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
                onClick={onNeverRepeatClick}
                className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
              >
                <div className="flex items-center max-w-full text-ms-warning">
                  <BsTrash3 style={{ marginLeft: "6px", marginRight: "6px" }} />
                  <span className="px-1">Never Repeat</span>
                </div>
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default RepeatItems;