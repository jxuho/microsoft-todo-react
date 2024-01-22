import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../store/uiSlice";
import { RxHamburgerMenu } from "react-icons/rx";
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
import { switchShowCompleted } from "../store/searchSlice";
import { GoCheckCircle } from "react-icons/go";
import { useEffect, useState } from "react";
import sortTasks from "../utils/sortTasks";
import SearchedTasks from "./tasks/searchedLists/SearchedTasks";
import SearchedNotes from "./tasks/searchedLists/SearchedNotes";
import SearchedCategories from "./tasks/searchedLists/SearchedCategories";
import SearchedSteps from "./tasks/searchedLists/SearchedSteps";
import { useGetTodosApiQuery } from "../api/todoApiSlice";

const Search = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.ui.sidebar);
  const showCompleted = useSelector((state) => state.search.showCompleted);
  const searchQuery = useSelector((state) => state.search.query);
  const [searchedTasks, setSearchedTasks] = useState([]);
  const [searchedNotes, setSearchedNotes] = useState([]);
  const [searchedSteps, setSearchedSteps] = useState([]);
  const [searchedCategories, setSearchedCategories] = useState([]);
  


  const userId = useSelector((state) => state.auth.user.uid);

  const {
    data: todos,
    error,
    isLoading: isTodosLoading,
    refetch,
  } = useGetTodosApiQuery(userId, { skip: !userId });



  const openSidebarHandler = () => {
    dispatch(openSidebar());
  };

  useEffect(() => {
    let sortedArr = sortTasks("alphabetically", "ascending", todos);

    if (!showCompleted) {
      sortedArr = sortedArr.filter((task) => !task.complete);
    }

    const query = searchQuery.toLowerCase();
    setSearchedTasks(
      sortedArr.filter((todo) => todo.task.toLowerCase().includes(query))
    );
    setSearchedNotes(
      sortedArr.filter((todo) =>
        todo.note.content.toLowerCase().includes(query)
      )
    );

    const stepsTemp = [];
    sortedArr.forEach((todo) => {
      todo.steps.forEach((step) => {
        if (step.content.toLowerCase().includes(query)) {
          if (!showCompleted && !step.complete) {
            stepsTemp.push({ todo, step });
          } else if (showCompleted) {
            stepsTemp.push({ todo, step });
          }
        }
      });
    });

    const categoriesTemp = [];
    sortedArr.forEach((todo) => {
      todo.category.forEach((item) => {
        if (
          item.toLowerCase().includes(query) &&
          !categoriesTemp.includes(todo)
        ) {
          categoriesTemp.push(todo);
        }
      });
    });
    setSearchedSteps(stepsTemp);
    setSearchedCategories(categoriesTemp);
  }, [searchQuery, todos, showCompleted]);

  const isEmpty =
    (searchedTasks.length === 0 &&
      searchedNotes.length === 0 &&
      searchedSteps.length === 0 &&
      searchedCategories.length === 0) ||
    searchQuery.length === 0;

  // const [isDark, setIsDark] = useState(
  //   window.matchMedia("(prefers-color-scheme: dark)").matches
  // );

  // useEffect(() => {
  //   const darkModeListener = window.matchMedia("(prefers-color-scheme: dark)");
  //   const handleDarkModeChange = (event) => {
  //     setIsDark(event.matches);
  //   };
  //   darkModeListener.addEventListener("change", handleDarkModeChange);
  //   return () => {
  //     darkModeListener.removeEventListener("change", handleDarkModeChange);
  //   };
  // }, []);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const rootElement = document.documentElement;
    const dataThemeValue = rootElement.dataset.theme;
    if (dataThemeValue) {
      setIsDark(dataThemeValue === "dark");
    }

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.attributeName === "data-theme") {
          const newDataThemeValue = mutation.target.dataset.theme;
          setIsDark(newDataThemeValue === "dark");
        }
      }
    });
    const observerConfig = { attributes: true };
    observer.observe(rootElement, observerConfig);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="flex flex-shrink-0 relative items-center justify-center h-12 mx-6 my-4 ">
        <div className="flex items-center flex-1 min-w-100 mr-5 py-2 ml-1">
          <div className="flex flex-col pt-1">
            <div className="flex items-center">
              <div>
                {!isSidebarOpen && (
                  <button onClick={openSidebarHandler} className="mr-2">
                    <RxHamburgerMenu size="20px" />
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-xl font-medium py-2 text-ms-blue">
                  Searching for "{searchQuery}"
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center text-ms-blue pt-1">
          <OptionPopover />
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-xl h-full">
            <img
              className={`${isDark ? "invert" : "invert-0"}`}
              src="/public\error-404.png"
              alt="not found icon"
              style={{ width: "50px", paddingBottom: "4px" }}
            />
            <div
              className=" text-ms-light-text font-semibold text-center"
              style={{ maxWidth: "350px" }}
            >
              We searched high and low but couldn't find what you're looking
              for.
            </div>
          </div>
        ) : (
          <div className="flex flex-col overflow-y-auto pb-6 px-6">
            <SearchedTasks todoArr={searchedTasks} />
            <SearchedNotes todoArr={searchedNotes} />
            <SearchedSteps todoArr={searchedSteps} />
            <SearchedCategories todoArr={searchedCategories} />
          </div>
        )}
      </div>
    </>
  );
};

export default Search;

const OptionPopover = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const showCompleted = useSelector((state) => state.search.showCompleted);
  const dispatch = useDispatch();

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

  const buttonClickHandler = () => {
    setPopoverOpen(false);
    dispatch(switchShowCompleted());
  };

  return (
    <>
      <div
        className="shrink-0 cursor-pointer px-3 ml-0.5"
        ref={floatingRef}
        onClick={popoverOpenHandler}
        {...getPopoverReferenceProps()}
        {...getTooltipReferenceProps()}
      >
        <span className="ml-1 text-sm">Options</span>
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
          <div
            className="bg-white py-1.5 rounded-sm min-w-[200px] max-w-[290px] animate-slideFadeDown5 text-ms-text-dark"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
            }}
          >
            <div
              className="font-semibold text-sm px-2 pt-2 pb-3 text-center mb-1.5"
              style={{ borderBottom: "1px solid #edebe9" }}
            >
              Options
            </div>
            <ul>
              <li className="text-left min-h-[38px] flex relative items-center font-normal text-sm hover:bg-ms-white-hover">
                <button
                  onClick={buttonClickHandler}
                  className="py-0 pr-4 pl-3 w-full h-9 cursor-pointer text-left"
                >
                  <div className="flex items-center max-w-full">
                    <GoCheckCircle size="18px" />
                    <span className="pl-3 py-0 grow">
                      {showCompleted
                        ? "Hide completed tasks"
                        : "Show completed tasks"}
                    </span>
                  </div>
                </button>
              </li>
            </ul>
          </div>
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
          Options
        </div>
      )}
    </>
  );
};
