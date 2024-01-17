import { useSelector } from "react-redux";
import { BsXLg, BsChevronUp, BsChevronDown } from "react-icons/bs";
import {
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useHover,
} from "@floating-ui/react";
import { useEffect, useState } from "react";
import {
  useChangeSortOrderApiMutation,
  useGetSortApiQuery,
  useInitializeSortApiMutation,
} from "../../api/sortApiSlice";

const SortIndicator = ({ currentLocation }) => {
  const [reverseTooltipOpen, setReverseTooltipOpen] = useState(false);
  const [closeTooltipOpen, setCloseTooltipOpen] = useState(false);
  const [sortIndicatorText, setSortIndicatorText] = useState("");

  const user = useSelector((state) => state.auth.user);
  const [initializeSortApi] = useInitializeSortApiMutation();
  const [changeSortOrderApi] = useChangeSortOrderApiMutation();

  const {
    data: sortData,
  } = useGetSortApiQuery(user?.uid, { skip: !user });

  const sortOption = sortData?.[currentLocation]?.sortBy;
  const sortOrder = sortData?.[currentLocation]?.order;


  const initializeSortHandler = async () => {
    try {
      initializeSortApi({ userId: user.uid, location: currentLocation });
    } catch (error) {
      console.error(error);
    }
  };

  const changeOrderHandler = async () => {
    try {
      if (sortOrder === "ascending") {
        changeSortOrderApi({
          userId: user.uid,
          location: currentLocation,
          order: "descending",
        });
      } else if (sortOrder === "descending") {
        changeSortOrderApi({
          userId: user.uid,
          location: currentLocation,
          order: "ascending",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    switch (sortData[currentLocation].sortBy) {
      // switch (sortOption) {
      case "importance":
        setSortIndicatorText("Sorted by importance");
        break;
      case "dueDate":
        setSortIndicatorText("Sorted by due date");
        break;
      case "alphabetically":
        setSortIndicatorText("Sorted alphabetically");
        break;
      case "creationDate":
        setSortIndicatorText("Sorted by creation date");
        break;
      case "myday":
        setSortIndicatorText("Sorted by added to My Day");
        break;
      case "completed":
        setSortIndicatorText("Sorted by Completed");
        break;

      default:
        break;
    }
  }, [sortOption]);

  const {
    refs: reverseTooltipRefs,
    floatingStyles: reverseTooltipFloatingStyles,
    context: reverseTooltipContext,
  } = useFloating({
    open: reverseTooltipOpen,
    placement: "top",
    onOpenChange: setReverseTooltipOpen,
    middleware: [offset(5), flip(), shift({ padding: 10 })],
  });
  const {
    getReferenceProps: getReverseTooltipReferenceProps,
    getFloatingProps: getReverseTooltipFloatingProps,
  } = useInteractions([
    useHover(reverseTooltipContext, { delay: { open: 200, close: 0 } }),
    useDismiss(reverseTooltipContext, {
      referencePress: true,
    }),
  ]);
  const {
    refs: closeTooltipRefs,
    floatingStyles: closeTooltipFloatingStyles,
    context: closeTooltipContext,
  } = useFloating({
    open: closeTooltipOpen,
    placement: "top",
    onOpenChange: setCloseTooltipOpen,
    middleware: [offset(5), flip(), shift({ padding: 10 })],
  });
  const {
    getReferenceProps: getCloseTooltipReferenceProps,
    getFloatingProps: getCloseTooltipFloatingProps,
  } = useInteractions([
    useHover(closeTooltipContext, { delay: { open: 200, close: 0 } }),
    useDismiss(closeTooltipContext, {
      referencePress: true,
    }),
  ]);

  return (
    <>
      <div className="h-10 text-ms-text-dark">
        <div className="flex items-center justify-end py-2.5 pr-0.5 pl-7 font-semibold text-xs">
          <div className="flex items-center">
            <button
              onClick={changeOrderHandler}
              className="inline-block h-6 w-6 p-1 align-middle mx-1 cursor-pointer"
              ref={reverseTooltipRefs.setReference}
              {...getReverseTooltipReferenceProps()}
            >
              {sortOrder === "descending" ? <BsChevronDown /> : <BsChevronUp />}
            </button>

            {sortIndicatorText}
          </div>
          <div
            className="flex items-center cursor-pointer w-6 h-6 p-1 pt-1.5 mx-1"
            ref={closeTooltipRefs.setReference}
            {...getCloseTooltipReferenceProps()}
            onClick={initializeSortHandler}
          >
            <button>
              <BsXLg />
            </button>
          </div>
        </div>
      </div>

      {reverseTooltipOpen && (
        <div
          ref={reverseTooltipRefs.setFloating}
          style={{
            ...reverseTooltipFloatingStyles,
            boxShadow:
              "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
            zIndex: 50,
          }}
          {...getReverseTooltipFloatingProps()}
          className="bg-white py-1.5 rounded-sm px-2 text-xs"
        >
          Reverse sort order
        </div>
      )}
      {closeTooltipOpen && (
        <div
          ref={closeTooltipRefs.setFloating}
          style={{
            ...closeTooltipFloatingStyles,
            boxShadow:
              "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
            zIndex: 50,
          }}
          {...getCloseTooltipFloatingProps()}
          className="bg-white py-1.5 rounded-sm px-2 text-xs"
        >
          Remove sort order option
        </div>
      )}
    </>
  );
};

export default SortIndicator;
