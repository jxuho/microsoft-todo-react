import { useEffect } from "react";
import { useGetUiApiQuery } from "../api/uiApiSlice";

const useTheme = ({userId}) => {
  const {
    data: uiData,
    isLoading: isUiLoading,
    isSuccess: isUiSuccess,
    isError: isUiError,
    error: uiError,
  } = useGetUiApiQuery(userId, { skip: !userId });

  useEffect(() => {
    if (!userId) return;
    const htmlElement = document.querySelector("html");
    if (!htmlElement) return;

    if (!userId) {
      htmlElement.setAttribute("data-theme", "light");
      return;
    } 

    if (uiData && uiData.theme) {
      if (uiData.theme === "light") {
        htmlElement.setAttribute("data-theme", "light");
      } else if (uiData.theme === "dark") {
        htmlElement.setAttribute("data-theme", "dark");
      }
    }
  }, [uiData]);
};

export default useTheme;
