import { useEffect } from "react";
import { useRef } from "react";
import { BsX } from "react-icons/bs";
import { VscSearch } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addQuery, initializeQuery } from "../../store/searchSlice";
import useViewport from "../../hooks/useViewPort";
import { setSearchbarActive } from "../../store/uiSlice";
import { useGetUiApiQuery } from "../../api/uiApiSlice";
import { auth } from "../../firebase";

const Searchbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef();
  const searchQuery = useSelector((state) => state.search.query);
  const dispatch = useDispatch();
  const isSearchbarActive = useSelector((state) => state.ui.searchbarActive);
  const { query: params } = useParams();
  const { width: viewportWidth } = useViewport();
  const isSidebarOpen = useSelector((state) => state.ui.sidebar);
  const isDetailOpen = useSelector((state) => state.ui.detail);
  const userId = auth.currentUser.uid;
  const {
    data: uiData,
    isLoading: isUiLoading,
    isSuccess: isUiSuccess,
    isError: isUiError,
    error: uiError,
  } = useGetUiApiQuery(userId, { skip: !userId });
  const detailWidth = uiData?.detailWidth;

  const searchHandler = (event) => {
    dispatch(addQuery(event.target.value));

    if (!location.pathname.includes("search")) {
      navigate(`search/${event.target.value}`);
    }

    window.history.replaceState(null, "", `/search/${event.target.value}`);
  };

  const clickHandler = () => {
    if (!isSearchbarActive) {
      dispatch(setSearchbarActive(true));
      dispatch(initializeQuery());
    }
  };

  useEffect(() => {
    if (isSearchbarActive) {
      inputRef.current.focus();
    }
  }, [isSearchbarActive]);

  const blurHandler = () => {
    if (location.pathname.includes("search") && searchQuery === "") {
      navigate("/myday");
    }
    if (!location.pathname.includes("search")) {
      dispatch(setSearchbarActive(false));
    }
  };

  const clearButtonHandler = () => {
    dispatch(setSearchbarActive(false));
    dispatch(initializeQuery());
    if (location.pathname.includes("search")) {
      navigate("/myday");
    }
  };

  useEffect(() => {
    if (!location.pathname.includes("search")) {
      dispatch(setSearchbarActive(false));
    }

    if (location.pathname.includes("search")) {
      dispatch(setSearchbarActive(true));
    }

    if (location.pathname.includes("search") && params !== searchQuery) {
      dispatch(addQuery(params ?? ""));
    }
  }, [location]);

  const keyDownHandler = (event) => {
    if (event.key === "Escape") {
      clearButtonHandler();
    }
  };

  const commonClasses =
    "flex grow shrink-0 basis-auto items-center my-2 ml-0 mr-auto h-8 rounded-md bg-white z-10 hover:bg-ms-white-hover hover:h-2.1 hover:cursor-pointer text-black";

  const searchNarrowingCondition =
    (!isDetailOpen && !isSidebarOpen && viewportWidth < 910) ||
    viewportWidth - detailWidth < 560;

  const classes = `
    ${
      searchNarrowingCondition
        ? `${
            isSearchbarActive
              ? commonClasses
              : `${commonClasses} flex grow-0 shrink-0`
          }`
        : "flex grow shrink-0 basis-auto items-center my-2 mx-auto h-8 max-w-[400px] rounded-md bg-white z-10 hover:bg-ms-white-hover hover:h-2.1 hover:cursor-pointer text-black"
    }
  `;

  return (
    <div className={classes} onClick={clickHandler}>
      <button className="z-20 text-ms-blue text-[#ffffff] mx-2">
        <VscSearch size="16px" />
      </button>

      {isSearchbarActive && (
        <div
          className={`flex flex-1 items-center h-full rounded-md ${
            viewportWidth < 350 && "w-24"
          }`}
        >
          <input
            className="flex-1 rounded-r-md outline-none bg-transparent"
            onChange={searchHandler}
            placeholder={"Search"}
            ref={inputRef}
            onBlur={blurHandler}
            value={searchQuery}
            onKeyDown={keyDownHandler}
          />
          <button
            className="flex items-center justify-center w-8 h-full"
            onClick={clearButtonHandler}
          >
            <BsX size="16px" className="text-ms-light-text" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
