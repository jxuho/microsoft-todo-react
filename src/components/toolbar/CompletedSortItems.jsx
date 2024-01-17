import { useSelector } from "react-redux";
import SortDueDateItem from "./sortListItems/SortDueDateItem";
import SortAlphabeticallyItem from "./sortListItems/SortAlphabeticallyItem";
import SortCreationDateItem from "./sortListItems/SortCreationDateItem";
import SortAddMydayItem from "./sortListItems/SortAddMydayItem";
import SortImportanceItem from "./sortListItems/SortImportanceItem";
import { useSetSortByApiMutation } from "../../api/sortApiSlice";

const CompletedSortItems = ({ onItemClick, currentLocation }) => {
  // 현재 페이지 가지고와서, 페이지에 따라 render 다르게해야 한다
  const user = useSelector((state) => state.auth.user);
  const [setSortByApi] = useSetSortByApiMutation();

  const importanceHandler = async () => {
    onItemClick();
    try {
      setSortByApi({
        userId: user.uid,
        location: currentLocation,
        sortBy: "importance",
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const dueDateHandler = async () => {
    onItemClick();
    try {
      setSortByApi({
        userId: user.uid,
        location: currentLocation,
        sortBy: "dueDate",
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const alphabeticallyHandler = async () => {
    onItemClick();
    try {
      setSortByApi({
        userId: user.uid,
        location: currentLocation,
        sortBy: "alphabetically",
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const creationDateHandler = async () => {
    onItemClick();
    try {
      setSortByApi({
        userId: user.uid,
        location: currentLocation,
        sortBy: "creationDate",
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const addMydayHandler = async () => {
    onItemClick();
    try {
      setSortByApi({
        userId: user.uid,
        location: currentLocation,
        sortBy: "myday",
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
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
        Sort By
      </div>
      <ul>
        <SortImportanceItem importanceHandler={importanceHandler} />
        <SortDueDateItem dueDateHandler={dueDateHandler} />
        <SortAddMydayItem addMydayHandler={addMydayHandler} />
        <SortAlphabeticallyItem alphabeticallyHandler={alphabeticallyHandler} />
        <SortCreationDateItem creationDateHandler={creationDateHandler} />
      </ul>
    </div>
  );
};

export default CompletedSortItems;
