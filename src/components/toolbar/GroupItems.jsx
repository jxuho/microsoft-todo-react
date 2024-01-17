import { PiTag } from "react-icons/pi";
import { useSelector } from "react-redux";
import { useSetGroupByApiMutation } from "../../api/groupApiSlice";

const GroupItems = ({ onItemClick, currentLocation }) => {
  if (currentLocation === "today") currentLocation = "myday";

  const user = useSelector((state) => state.auth.user);

  const [setGroupByApi] = useSetGroupByApiMutation();

  const categoryHandler = () => {
    onItemClick();
    try {
      setGroupByApi({
        userId: user.uid,
        location: currentLocation,
        groupBy: "category",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        className="bg-white py-1.5 rounded-sm min-w-[200px] max-w-[290px] animate-slideFadeDown5 text-ms-text-dark"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
        }}
      >
        <div
          className="font-semibold text-sm px-2 pt-2 pb-3 text-center mb-1.5"
          style={{ borderBottom: "1px solid #edebe9" }}
        >
          Group By
        </div>
        <ul>
          <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
            <button
              onClick={categoryHandler}
              className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
            >
              <div className="flex items-center max-w-full">
                <PiTag
                  size="16px"
                  style={{
                    transform: "rotate(90deg)",
                    marginLeft: "4px",
                    marginRight: "14px",
                  }}
                />
                <span className="px-1 py-0 grow">Categories</span>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default GroupItems;
