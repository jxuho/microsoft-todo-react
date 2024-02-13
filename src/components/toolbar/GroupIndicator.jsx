import { BsXLg } from "react-icons/bs";
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
import { useGetGroupApiQuery } from "../../api/groupApiSlice";
import { useInitializeGroupApiMutation } from "../../api/groupApiSlice";
import { auth } from "../../firebase";

const GroupIndicator = ({ currentLocation }) => {
  const userId = auth.currentUser?.uid;
  const [closeTooltipOpen, setCloseTooltipOpen] = useState(false);
  const [groupIndicatorText, setGroupIndicatorText] = useState("");

  const [initializeGroupApi] = useInitializeGroupApiMutation();
  const { data: groupData } = useGetGroupApiQuery(userId, { skip: !userId });

  const groupOption = groupData[currentLocation];

  const initializeGroupHandler = () => {
    try {
      initializeGroupApi({ userId: userId, location: currentLocation });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    switch (groupOption) {
      case "category":
        setGroupIndicatorText("Grouped by Categories");
        break;

      default:
        break;
    }
  }, [groupOption]);

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
          <div className="flex items-center">{groupIndicatorText}</div>

          <div
            className="flex items-center cursor-pointer w-6 h-6 p-1 pt-1.5 mx-1"
            ref={closeTooltipRefs.setReference}
            {...getCloseTooltipReferenceProps()}
            onClick={initializeGroupHandler}
          >
            <button>
              <BsXLg />
            </button>
          </div>
        </div>
      </div>

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
          Remove Grouping by categories option
        </div>
      )}
    </>
  );
};

export default GroupIndicator;
