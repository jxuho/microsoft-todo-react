import { BsStar, BsCalendarPlus } from "react-icons/bs";
import { IoCalendarOutline } from "react-icons/io5";
import { PiArrowsDownUpThin } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
// import { setSortBy } from "../../store/sortSlice";
import { useSetSortByApiMutation } from "../api/sortApiSlice";
const SortItems = ({onItemClick, currentLocation}) => {
  // 현재 페이지 가지고와서, 페이지에 따라 render 다르게해야 한다
  const dispatch = useDispatch()
  const userId = auth.currentUser?.uid;
  const [setSortByApi] = useSetSortByApiMutation();

  
  if (currentLocation === "today") currentLocation = 'myday'

  const importanceHandler = () => {
    onItemClick()

      setSortByApi({
        userId: userId,
        location: currentLocation,
        sortBy: "importance",
      })

    // dispatch(setSortBy({option: "importance", location: currentLocation}))
  }

  const dueDateHandler = () => {
    onItemClick()

      setSortByApi({
        userId: userId,
        location: currentLocation,
        sortBy: "dueDate",
      })

    // dispatch(setSortBy({option: "dueDate", location: currentLocation}))
  }

  const alphabeticallyHandler =() => {
    onItemClick()

      setSortByApi({
        userId: userId,
        location: currentLocation,
        sortBy: "alphabetically",
      })

    // dispatch(setSortBy({option: "alphabetically", location: currentLocation}))
  }

  const creationDateHandler = () => {
    onItemClick()

      setSortByApi({
        userId: userId,
        location: currentLocation,
        sortBy: "creationDate",
      })

    // dispatch(setSortBy({option: "creationDate", location: currentLocation}))
  }

  return (
    <div
      className="bg-white py-1.5 rounded-sm min-w-[200px] max-w-[290px]"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
          color:'#323130'
      }}
    >
      <div
        className="font-semibold text-sm px-2 pt-2 pb-3 text-center mb-1.5"
        style={{ borderBottom: "1px solid #edebe9" }}
      >
        Sort By
      </div>
      <ul>
        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
            onClick={importanceHandler}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
            <BsStar
              size='16px'
                style={{ marginLeft: "4px", marginRight: "14px" }}
              />
              <span className="px-1 py-0 grow">Importance</span>
            </div>
          </button>
        </li>
        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
            onClick={dueDateHandler}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
            <IoCalendarOutline
                size='16px'
                style={{ marginLeft: "4px", marginRight: "12px" }}
              />
              <span className="px-1 py-0 grow">Due date</span>
            </div>
          </button>
        </li>
        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
            onClick={alphabeticallyHandler}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
            <PiArrowsDownUpThin 
            size='20px'
                style={{ marginLeft: "2px", marginRight: "10px", color:'black' }}
              />
              <span className="px-1 py-0 grow">Alphabetically</span>
            </div>
          </button>
        </li>

        <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
          <button
             onClick={creationDateHandler}
            className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
          >
            <div className="flex items-center max-w-full">
            <BsCalendarPlus
                size='16px'
                style={{ marginLeft: "4px", marginRight: "12px"}}
              />
              <span className="px-1 py-0 grow">Creation Date</span>
            </div>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SortItems;
