import { useDispatch, useSelector } from "react-redux";
import Panel from "../components/ui/Panel";
import { BsXLg } from "react-icons/bs";
import { setHeaderButton } from "../store/uiSlice";
import { useGetUiApiQuery, useSetThemeApiMutation } from "../api/uiApiSlice";
import { auth } from "../firebase";

const Settings = () => {
  const dispatch = useDispatch();
  const isSettingsActive = useSelector((state) => state.ui.settingsActive);
  const userId = auth.currentUser?.uid;

  const [setThemeApi] = useSetThemeApiMutation();

  const {
    data: uiData,
    isLoading: isUiLoading,
    isSuccess: isUiSuccess,
    isError: isUiError,
    error: uiError,
  } = useGetUiApiQuery(userId, { skip: !userId });

  return (
    <>
      {isSettingsActive && (
        <Panel>
          <div className="animate-slideInFrames overflow-x-hidden overflow-y-auto flex flex-col">
            <div className="flex justify-between">
              <h2 className="py-5 px-4 text-xl font-semibold">Settings</h2>
              <button
                className="flex items-center justify-center hover:bg-ms-button-hover mr-1 mt-3 w-10 h-10 "
                onClick={() =>
                  dispatch(
                    setHeaderButton({
                      property: "settingsActive",
                      value: false,
                    })
                  )
                }
              >
                <BsXLg size="16px" />
              </button>
            </div>
            <div className="flex justify-between px-4">
              <h2 className="py-5 text-base font-semibold">Dark Mode</h2>
              {uiData?.theme === "dark" ? (
                <div className="flex items-center opacity-70 pt-2">
                  <button
                    className="w-11 h-5 border border-ms-blue rounded-xl flex justify-end items-center bg-ms-blue"
                    onClick={() => setThemeApi({ userId, value: "light" })}
                  >
                    <div className="w-3 h-3 rounded-full bg-ms-header border border-ms-header mr-1"></div>
                  </button>
                </div>
              ) : (
                <div className="flex items-center opacity-70 pt-2">
                  <button
                    className="w-11 h-5 border border-black rounded-xl flex justify-start items-center"
                    onClick={() => setThemeApi({ userId, value: "dark" })}
                  >
                    <div className="w-3 h-3 rounded-full bg-black border border-black ml-1"></div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </Panel>
      )}
    </>
  );
};

export default Settings;
