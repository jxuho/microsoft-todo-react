import {
  useFloating,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
} from "@floating-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setInformationModal } from "../../store/uiSlice";

const InformationModal = () => {
  const dispatch = useDispatch();

  const isInformationModalOpen = useSelector(
    (state) => state.ui.informationModalActive
  );
  const informationModalText = useSelector(
    (state) => state.ui.informationModalText
  );

  const { refs, context } = useFloating({
    open: isInformationModalOpen,
  });
  const click = useClick(context);
  const role = useRole(context);
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });
  const { getFloatingProps } = useInteractions([click, role, dismiss]);

  return (
    isInformationModalOpen && (
      <div>
        <FloatingPortal id="root">
          <FloatingOverlay
            className="flex items-center justify-center z-50"
            lockScroll
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
          >
            <FloatingFocusManager context={context}>
              <div
                className="bg-white min-w-[288px] min-h-[176px] rounded flex flex-col"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.22) 0px 25.6px 57.6px 0px, rgba(0, 0, 0, 0.18) 0px 4.8px 14.4px 0px",
                  border: "solid 1px #edebe9",
                }}
                ref={refs.setFloating}
                {...getFloatingProps()}
              >
                <div className="p-4 mt-4">
                  {/* <div className="font-semibold mb-3">{headerContent}</div> */}
                  <span className="text-ms-light-text">
                    {informationModalText}
                  </span>
                </div>
                <div className="flex justify-end p-4 my-4">
                  <button
                    className="bg-ms-input-hover font-semibold py-2 px-3 w-auto h-auto rounded hover:bg-gray-200 transition-colors"
                    style={{ color: "#34373d" }}
                    onClick={() =>
                      dispatch(setInformationModal({ active: false, text: "" }))
                    }
                  >
                    OK
                  </button>
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      </div>
    )
  );
};

export default InformationModal;
