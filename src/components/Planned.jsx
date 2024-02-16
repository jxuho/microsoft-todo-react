import AddTask from "./addtask/AddTask";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../store/uiSlice";
import { RxHamburgerMenu } from "react-icons/rx";
import { PiDotsThreeBold } from "react-icons/pi";
import { IoCalendarOutline } from "react-icons/io5";
import PlannedList from "./tasks/PlannedList";

const Planned = () => {
  const isSidebarOpen = useSelector((state) => state.ui.sidebar);
  const dispatch = useDispatch();

  const openSidebarHandler = () => {
    dispatch(openSidebar());
  };

  return (
    <>
      <div className="flex flex-shrink-0 relative items-center justify-center h-12 mx-6 my-4 ">
        <div className="flex items-center flex-1 min-w-100 mr-5 py-2 ml-1">
          <div className="flex flex-col pt-1">
            <div className="flex items-center">
              <div>
                {!isSidebarOpen ? (
                  <button onClick={openSidebarHandler} className="mr-2">
                    <RxHamburgerMenu size="20px" />
                  </button>
                ) : (
                  <div className="px-2 py-1.5 text-ms-blue" >
                    <IoCalendarOutline size="22px" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-medium py-2 text-ms-blue">Planned</h2>
              </div>
              <div className="px-3">
                <PiDotsThreeBold />
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <AddTask currentLocation={"planned"} />
        <PlannedList currentLocation={"planned"}/>
      </div>
    </>
  );
};

export default Planned;
