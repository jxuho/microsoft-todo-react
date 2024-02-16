import { BsChevronRight } from "react-icons/bs";

const TaskHeader = ({
  isHeaderOpen,
  headerOpenHandler,
  taskCount,
  categoryName,
}) => {
  const categories = ["blue", "green", "orange", "purple", "red", "yellow"];

  let headerText = "";
  if (categories.includes(categoryName)) {
    headerText =
      categoryName.charAt(0).toUpperCase() +
      categoryName.slice(1) +
      " category";
  } else if (categoryName === "uncategorized") {
    headerText = "Uncategorized";
  }

  return (
    <>
      <div
        className="flex items-center min-h-52 cursor-pointer"
        style={isHeaderOpen ? null : { boxShadow: "0 17px 0 -16px #e1dfdd" }}
        onClick={() => headerOpenHandler(categoryName)}
      >
        <div className="flex items-center justify-center w-8 h-8 cursor-pointer">
          <div>
            <BsChevronRight
              className="mt-1 ml-1"
              style={{
                color: "#797775",
                transform: isHeaderOpen ? "rotate(90deg)" : "rotate(0)",
                transition: "all 0.1s linear",
              }}
            />
          </div>
        </div>
        <div className="flex p-2">
          <h3 className="font-medium">{headerText}</h3>
          <h3 className="ml-2" style={{ color: "#797775" }}>
            {taskCount}
          </h3>
        </div>
      </div>
    </>
  );
};

export default TaskHeader;
