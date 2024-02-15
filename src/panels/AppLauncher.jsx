import { TbGridDots } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { setAppLauncherActive } from "../store/uiSlice";
import { useEffect, useRef } from "react";

const AppLauncher = () => {
  const dispatch = useDispatch();
  const appLauncherRef = useRef();
  const appLauncherActive = useSelector((state) => state.ui.appLauncherActive);

  useEffect(() => {
    const closeModalOnClickOutside = (event) => {
      if (
        appLauncherRef.current &&
        !appLauncherRef.current.contains(event.target)
      ) {
        dispatch(setAppLauncherActive(false));
      }
    };
    if (appLauncherActive) {
      document.addEventListener("click", closeModalOnClickOutside, true);
    }
    return () => {
      document.removeEventListener("click", closeModalOnClickOutside, true);
    };
  }, [appLauncherActive]);

  return (
    <>
      {appLauncherActive && (
        <div
          className="flex flex-col fixed z-50 bg-white w-80 min-w-[320px] max-w-[320px] top-0 left-0 right-auto h-screen origin-top-left animate-slideInFrames overflow-y-auto"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.22) 0px 25.6px 57.6px 0px, rgba(0, 0, 0, 0.18) 0px 4.8px 14.4px 0px",
          }}
          ref={appLauncherRef}
        >
          <div>
            <button
              className="m-4 p-1.5 rounded hover:bg-ms-white-hover transition-colors ease-linear duration-100"
              onClick={() => dispatch(setAppLauncherActive(false))}
            >
              <TbGridDots size="20px" />
            </button>
          </div>
          <div className="mx-5 my-3 flex flex-col animate-slideFadeDown5">
            <h2 className="text-4xl font-semibold">About</h2>
            <div className="pl-0.5">
              <div className="pt-6 pb-8 text-xl italic font-medium">Developed by Juho Lee</div>
              <div className="pb-6 text-lg font-semibold">
                <h3 className="pr-4">Dev Log</h3>
                <a
                  href="https://shimmer-catsup-02a.notion.site/MS-todo-app-038e582f80254b2095bbd0134bfe5a56?pvs=4"
                  target="_blank"
                  className="font-normal text-ms-blue"
                >
                  Link
                </a>
              </div>
              <div className="pb-6 text-lg font-semibold">
                <h3 className="pr-4">Git Repo (Currently private)</h3>
                <a
                  href="https://github.com/JXUHO"
                  target="_blank"
                  className="font-normal text-ms-blue"
                >
                  Link
                </a>
              </div>
              <div className="pb-6 text-lg">
                <h3 className="pr-4 pb-2 font-semibold">
                  Technologies
                </h3>
                <ul className="pl-1 text-base list-disc ml-4">
                  <li>HTML, CSS, JS</li>
                  <li>React</li>
                  <li>React Router</li>
                  <li>Redux Toolkit</li>
                  <li>RTK Query</li>
                  <br />
                  <li>TailwindCSS</li>
                  <li>Vite</li>
                  <li>npm</li>
                  <br />
                  <li>Firebase Authentication</li>
                  <li>Firebase Firestore</li>
                  <li>Firebase Storage</li>
                  <li>Firebase Hosting</li>
                  <br />
                  <li>@floating-ui/react</li>
                  <li>react-icons</li>
                  <li>react-datepicker</li>
                  <li>react-uuid</li>
                  <li>react-textarea-autosize</li>
                  <li>react-loader-spinner</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppLauncher;
