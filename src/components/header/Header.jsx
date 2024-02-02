import { Link } from "react-router-dom";
import Searchbar from "./Searchbar";
import { TbGridDots } from "react-icons/tb";
import { AiOutlineSetting } from "react-icons/ai";
import { RxQuestionMark } from "react-icons/rx";
import { TbSpeakerphone } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import useViewport from "../hooks/useViewport";
import { setAppLauncherActive, setHeaderButton } from "../../store/uiSlice";

const Header = () => {
  const dispatch = useDispatch();
  const isSearchbarActive = useSelector((state) => state.ui.searchbarActive);
  const { width: viewportWidth } = useViewport();

  const isSettingsActive = useSelector((state) => state.ui.settingsActive);
  const isHelpActive = useSelector((state) => state.ui.helpActive);
  const isWhatsNewActive = useSelector((state) => state.ui.whatsNewActive);
  const isAccountManagerActive = useSelector(
    (state) => state.ui.accountManagerActive
  );

  const headerButtonsClickHandler = (option) => {
    switch (option) {
      case "settings":
        dispatch(
          setHeaderButton({
            property: "settingsActive",
            value: !isSettingsActive,
          })
        );
        dispatch(setHeaderButton({ property: "helpActive", value: false }));
        dispatch(setHeaderButton({ property: "whatsNewActive", value: false }));
        dispatch(
          setHeaderButton({ property: "accountManagerActive", value: false })
        );
        break;
      case "help":
        dispatch(
          setHeaderButton({ property: "helpActive", value: !isHelpActive })
        );
        dispatch(setHeaderButton({ property: "settingsActive", value: false }));
        dispatch(setHeaderButton({ property: "whatsNewActive", value: false }));
        dispatch(
          setHeaderButton({ property: "accountManagerActive", value: false })
        );
        break;
      case "whatsNew":
        dispatch(
          setHeaderButton({
            property: "whatsNewActive",
            value: !isWhatsNewActive,
          })
        );
        dispatch(setHeaderButton({ property: "settingsActive", value: false }));
        dispatch(setHeaderButton({ property: "helpActive", value: false }));
        dispatch(
          setHeaderButton({ property: "accountManagerActive", value: false })
        );
        break;
      case "accountManager":
        dispatch(
          setHeaderButton({
            property: "accountManagerActive",
            value: !isAccountManagerActive,
          })
        );
        dispatch(setHeaderButton({ property: "settingsActive", value: false }));
        dispatch(setHeaderButton({ property: "helpActive", value: false }));
        dispatch(setHeaderButton({ property: "whatsNewActive", value: false }));
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-row justify-between items-center h-12 text-white-text bg-ms-header">
      <div
        className="flex justify-center items-center h-12 w-12 hover:bg-ms-blue-hover transition ease-in-out duration-100 hover:cursor-pointer"
        onClick={() => dispatch(setAppLauncherActive(true))}
        title="App launcher"
      >
        <TbGridDots size="20px" />
      </div>

      <div className="flex flex-1 justify-start items-center">
        <div className="pl-2 pr-3 hover:underline text-base font-semibold whitespace-nowrap">
          <a href="/">To Do</a>
        </div>
        <Searchbar />

        {!(isSearchbarActive && viewportWidth < 430) && (
          <div
            className={`flex justify-center items-center h-12 w-12 hover:bg-ms-blue-hover hover:text-white transition ease-in-out duration-100 hover:cursor-pointer ${
              isSettingsActive ? "bg-ms-active-tertiary text-gray-500" : ""
            }`}
            title="Settings"
            onClick={() => headerButtonsClickHandler("settings")}
          >
            <AiOutlineSetting size="20px" />
          </div>
        )}
        {!(isSearchbarActive && viewportWidth < 478) && (
          <div
            className={`flex justify-center items-center h-12 w-12 hover:bg-ms-blue-hover hover:text-white transition ease-in-out duration-100 hover:cursor-pointer ${
              isHelpActive ? "bg-ms-active-tertiary text-gray-500" : ""
            }`}
            title="Help"
            onClick={() => headerButtonsClickHandler("help")}
          >
            <RxQuestionMark size="20px" />
          </div>
        )}
        {!(isSearchbarActive && viewportWidth < 525) && (
          <div
            className={`flex justify-center items-center h-12 w-12 hover:bg-ms-blue-hover hover:text-white transition ease-in-out duration-100 hover:cursor-pointer ${
              isWhatsNewActive ? "bg-ms-active-tertiary text-gray-500" : ""
            }`}
            title="What's new"
            onClick={() => headerButtonsClickHandler("whatsNew")}
          >
            <TbSpeakerphone size="20px" />
          </div>
        )}
      </div>
      {!(isSearchbarActive && viewportWidth < 400) ? (
        <div
          id="accountManagerButton"
          className={`flex justify-center items-center h-12 w-12 hover:bg-ms-blue-hover hover:text-white transition ease-in-out duration-100 hover:cursor-pointer ${
            isAccountManagerActive ? "bg-ms-blue-hover" : ""
          }`}
          onClick={() => headerButtonsClickHandler("accountManager")}
          title="Account manager"
        >
          <CgProfile size="20px" />
        </div>
      ) : (
        <div className="w-8"></div>
      )}
    </div>
  );
};

export default Header;
