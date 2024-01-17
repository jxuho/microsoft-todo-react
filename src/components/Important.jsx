import AddTask from "./addtask/AddTask";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../store/uiSlice";
import { RxHamburgerMenu } from "react-icons/rx";
import { BsStar } from "react-icons/bs";
import { PiDotsThreeBold } from "react-icons/pi";
import SortPopover from "./toolbar/SortPopover";
import SortIndicator from "./toolbar/SortIndicator";
import { useEffect } from "react";
import { setSortBy } from "../store/sortSlice";
import ImportantList from "./tasks/ImportantList";
import { useGetSortApiQuery } from "../api/sortApiSlice";

const Important = () => {
  const isSidebarOpen = useSelector((state) => state.ui.sidebar);
  const dispatch = useDispatch();



  // const isSortOptionSelected = useSelector(
  //   (state) => state.sort.important.sortBy
  // );
  const user = useSelector((state) => state.auth.user);
  const {
    data: sortData,
    isError: isSortError,
    error: sortError,
  } = useGetSortApiQuery(user?.uid);
  const isSortOptionSelected = sortData.important.sortBy;


  const openSidebarHandler = () => {
    dispatch(openSidebar());
  };

  useEffect(() => {
    // 수정 필요
    dispatch(setSortBy({ option: "creationDate", location: "important" }));
  }, []);

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
                  <div className="px-2 py-1.5 text-ms-blue">
                    <BsStar size="22px" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-medium py-2 text-ms-blue">Important</h2>
              </div>
              <div className="px-3">
                <PiDotsThreeBold />
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <SortPopover currentLocation="important" />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-end">
          {isSortOptionSelected && (
            <SortIndicator currentLocation="important" />
          )}
        </div>
        <AddTask currentLocation={"important"} />
        <ImportantList currentLocation={"important"}/>
      </div>
    </>
  );
};

export default Important;

/**
 * TODO
 * MyDayList 컴포넌트 만들기
 * CompletedMydayList를 분리하지 않음
 *
 *
 */
