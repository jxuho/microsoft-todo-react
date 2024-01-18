import { useDispatch, useSelector } from "react-redux";
import useViewport from "../../hooks/useViewPort";
import { closeDetail, closeSidebar } from "../../store/uiSlice";
import { useGetUiApiQuery } from "../../api/uiApiSlice";

const SidebarOverlay = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.ui.sidebar);
  const isDetailOpen = useSelector((state) => state.ui.detail);
  const { width: viewportWidth } = useViewport();

  const user = useSelector((state) => state.auth.user);

  const {
    data: uiData,
    isLoading: isUiLoading,
    isSuccess: isUiSuccess,
    isError: isUiError,
    error: uiError,
  } = useGetUiApiQuery(user?.uid);

  const detailWidth = uiData?.detailWidth;

  const overlayClickHandler = () => {
    dispatch(closeDetail());
    dispatch(closeSidebar());
  };

  return (
    <>
      {viewportWidth - detailWidth < 560 && (isSidebarOpen || isDetailOpen) && (
        <div
          className="absolute w-full h-full z-20 opacity-40 animate-fadeFill"
          style={{ backgroundColor: "#333" }}
          onClick={overlayClickHandler}
        ></div>
      )}
    </>
  );
};

export default SidebarOverlay;
