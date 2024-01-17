import {
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useHover,
  useMergeRefs,
} from "@floating-ui/react";
import { useState } from "react";
import { PiArrowsDownUpThin } from "react-icons/pi";
import MydaySortItems from "./MydaySortItems";
import ImportantSortItems from "./ImportantSortItems";
import CompletedSortItems from "./CompletedSortItems";
import useViewport from "../../hooks/useViewPort";
import { useSelector } from "react-redux";

const SortPopover = ({ currentLocation }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const {
    refs: popoverRefs,
    floatingStyles: popoverFloatingStyles,
    context: popoverContext,
  } = useFloating({
    open: popoverOpen,
    onOpenChange: setPopoverOpen,
    middleware: [offset(5), flip(), shift({ padding: 10 })],
  });

  const {
    getReferenceProps: getPopoverReferenceProps,
    getFloatingProps: getPopoverFloatingProps,
  } = useInteractions([
    useClick(popoverContext),
    useDismiss(popoverContext, {
      referencePress: true,
    }),
  ]);
  const {
    refs: tooltipRefs,
    floatingStyles: tooltipFloatingStyles,
    context: tooltipContext,
  } = useFloating({
    open: tooltipOpen,
    placement: "top",
    onOpenChange: setTooltipOpen,
    middleware: [offset(5), flip(), shift({ padding: 10 })],
  });
  const {
    getReferenceProps: getTooltipReferenceProps,
    getFloatingProps: getTooltipFloatingProps,
  } = useInteractions([
    useHover(tooltipContext, { delay: { open: 200, close: 0 } }),
    useDismiss(tooltipContext, {
      referencePress: true,
    }),
  ]);

  const floatingRef = useMergeRefs([
    tooltipRefs.setReference,
    popoverRefs.setReference,
  ]);

  const popoverOpenHandler = () => {
    setPopoverOpen(true);
  };
  const popoverCloseHandler = () => {
    setPopoverOpen(false);
  };

  let sortItemsComponent;
  switch (currentLocation) {
    case "myday":
      sortItemsComponent = (
        <MydaySortItems
          onItemClick={popoverCloseHandler}
          currentLocation={"myday"}
        />
      );
      break;
    case "important":
      sortItemsComponent = (
        <ImportantSortItems
          onItemClick={popoverCloseHandler}
          currentLocation={"important"}
        />
      );
      break;
    case "completed":
      sortItemsComponent = (
        <CompletedSortItems
          onItemClick={popoverCloseHandler}
          currentLocation={"completed"}
        />
      );
      break;
    case "tasks":
      sortItemsComponent = (
        <CompletedSortItems
          onItemClick={popoverCloseHandler}
          currentLocation={"tasks"}
        />
      );
      break;

    default:
      break;
  }

  const { width: viewportWidth } = useViewport();
  const detailWidth = useSelector((state) => state.ui.detailWidth);

  return (
    <>
      <div
        className="shrink-0 cursor-pointer px-3 ml-0.5"
        ref={floatingRef}
        onClick={popoverOpenHandler}
        {...getPopoverReferenceProps()}
        {...getTooltipReferenceProps()}
      >
        <div className="flex items-center">
          <PiArrowsDownUpThin size="20px" />
          {viewportWidth - detailWidth > 700 && (
            <span className="ml-1 text-sm">Sort</span>
          )}
        </div>
      </div>
      {popoverOpen && (
        <div
          ref={popoverRefs.setFloating}
          style={{
            ...popoverFloatingStyles,
            zIndex: 40,
          }}
          {...getPopoverFloatingProps()}
        >
          {sortItemsComponent}
        </div>
      )}
      {tooltipOpen && (
        <div
          ref={tooltipRefs.setFloating}
          style={{
            ...tooltipFloatingStyles,
            boxShadow:
              "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
            zIndex: 50,
            color: "black",
          }}
          {...getTooltipFloatingProps()}
          className="bg-white py-1.5 rounded-sm px-2 text-xs"
        >
          Sort
        </div>
      )}
    </>
  );
};

export default SortPopover;
