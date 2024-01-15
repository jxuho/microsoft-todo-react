import { BsXLg } from "react-icons/bs";
import { PiTag } from "react-icons/pi";

const DetailCategoryItems = ({
  taskId,
  popoverRefs,
  getPopoverReferenceProps,
  categoryHandler,
  todo
}) => {

  const todoCategory = todo?.category ?? [];

  const removeCategoryHandler = (event, category) => {
    event.stopPropagation();
    categoryHandler(category);
  };

  return (
    <div
      className="flex bg-white w-full rounded p-4 items-center justify-between text-ms-light-text hover:bg-ms-white-hover hover:text-black"
      ref={popoverRefs.setReference}
      {...getPopoverReferenceProps()}
    >
      <div className="flex w-full items-center">
        <div className="mr-1">
          <PiTag size="16px" style={{ transform: "rotate(90deg)" }} />
        </div>

        <div className="flex flex-1 px-3 items-center flex-wrap">
          {todoCategory.includes("blue") && (
            <div
              className="flex m-1 h-6 items-center rounded box-border border border-transparent hover:border hover:border-blue-800"
              style={{
                backgroundColor: "#E0F7FD",
                color: "#007899",
              }}
            >
              <div className="flex items-center text-xs pb-0.5 h-full  px-1.5 hover:bg-blue-600 hover:text-ms-white-hover">
                Blue category
              </div>
              <div
                className="flex items-center px-1 h-full hover:bg-blue-600 text-blue-500 hover:text-ms-white-hover"
                onClick={(event) => removeCategoryHandler(event, "blue")}
              >
                <BsXLg />
              </div>
            </div>
          )}

          {todoCategory.includes("green") && (
            <div
              className="flex m-1 h-6 items-center rounded border border-transparent hover:border hover:border-green-800"
              style={{
                backgroundColor: "#E9F9E8",
                color: "#267E20",
              }}
            >
              <div className="flex items-center text-xs pb-0.5 h-full  px-1.5 hover:bg-green-600 hover:text-ms-white-hover">
                Green category
              </div>
              <div
                className="flex items-center px-1 h-full hover:bg-green-600 text-green-500 hover:text-ms-white-hover"
                onClick={(event) => removeCategoryHandler(event, "green")}
              >
                <BsXLg />
              </div>
            </div>
          )}

          {todoCategory.includes("orange") && (
            <div
              className="flex m-1 h-6 items-center rounded border border-transparent hover:border hover:border-orange-800"
              style={{
                backgroundColor: "#FFF1E0",
                color: "#A35A00",
              }}
            >
              <div className="flex items-center text-xs pb-0.5 h-full  px-1.5 hover:bg-orange-600 hover:text-ms-white-hover">
                Orange category
              </div>
              <div
                className="flex items-center px-1 h-full hover:bg-orange-600 text-orange-500 hover:text-ms-white-hover"
                onClick={(event) => removeCategoryHandler(event, "orange")}
              >
                <BsXLg />
              </div>
            </div>
          )}

          {todoCategory.includes("purple") && (
            <div
              className="flex m-1 h-6 items-center rounded border border-transparent hover:border hover:border-purple-800"
              style={{
                backgroundColor: "#F0ECF6",
                color: "#7D57B2",
              }}
            >
              <div className="flex items-center text-xs pb-0.5 h-full  px-1.5 hover:bg-purple-600 hover:text-ms-white-hover">
                Purple category
              </div>
              <div
                className="flex items-center px-1 h-full hover:bg-purple-600 text-purple-500 hover:text-ms-white-hover"
                onClick={(event) => removeCategoryHandler(event, "purple")}
              >
                <BsXLg />
              </div>
            </div>
          )}

          {todoCategory.includes("red") && (
            <div
              className="flex m-1 h-6 items-center rounded border border-transparent hover:border hover:border-red-800"
              style={{
                backgroundColor: "rgb(252, 233, 234)",
                color: "rgb(208, 27, 42)",
              }}
            >
              <div className="flex items-center text-xs pb-0.5 h-full  px-1.5 hover:bg-red-600 hover:text-ms-white-hover">
                Red category
              </div>
              <div
                className="flex items-center px-1 h-full hover:bg-red-600 text-red-500 hover:text-ms-white-hover"
                onClick={(event) => removeCategoryHandler(event, "red")}
              >
                <BsXLg />
              </div>
            </div>
          )}

          {todoCategory.includes("yellow") && (
            <div
              className="flex m-1 h-6 items-center rounded border border-transparent hover:border hover:border-yellow-800"
              style={{
                backgroundColor: "#FFFDE0",
                color: "#7A7400",
              }}
            >
              <div className="flex items-center text-xs pb-0.5 h-full  px-1.5 hover:bg-yellow-600 hover:text-ms-white-hover">
                Yellow category
              </div>
              <div
                className="flex items-center px-1 h-full hover:bg-yellow-600 text-yellow-500 hover:text-ms-white-hover"
                onClick={(event) => removeCategoryHandler(event, "yellow")}
              >
                <BsXLg />
              </div>
            </div>
          )}

          <div className="inline-block">Pick a Category</div>
        </div>
      </div>
    </div>
  );
};

export default DetailCategoryItems;
