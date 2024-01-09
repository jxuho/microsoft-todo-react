import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useFloating,
  autoUpdate,
  flip,
  offset,
  shift,
  useRole,
  useDismiss,
  useInteractions,
  useListNavigation,
  useTypeahead,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { closeContextMenu } from "../../store/uiSlice";

export const MenuItem = forwardRef(({ children, disabled, ...props }, ref) => {
  return (
    <button
      {...props}
      className="flex text-sm hover:bg-ms-white-hover items-center min-h-[38px] pl-3 pr-4 text-ms-text-dark"
      ref={ref}
      role="menuitem"
      disabled={disabled}
    >
      {children}
    </button>
  );
});

export const MenuSeparator = forwardRef((props, ref) => {
  return (
    <div className="border-b border-solid border-ms-input-hover my-1.5 mx-0" />
  );
});

export const Menu = forwardRef(({ children }, forwardedRef) => {
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const isRightClicked = useSelector((state) => state.ui.contextMenu);

  const listItemsRef = useRef([]);
  const listContentRef = useRef(
    Children.map(children, (child) =>
      isValidElement(child) ? child.props.label : null
    )
  );

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset({ mainAxis: 5, alignmentAxis: 4 }),
      flip({
        fallbackPlacements: ["left-start"],
      }),
      shift({ padding: 10 }),
    ],
    placement: "right-start",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
  });

  const role = useRole(context, { role: "menu" });
  const dismiss = useDismiss(context);
  const listNavigation = useListNavigation(context, {
    listRef: listItemsRef,
    onNavigate: setActiveIndex,
    activeIndex,
  });
  const typeahead = useTypeahead(context, {
    enabled: isOpen,
    listRef: listContentRef,
    onMatch: setActiveIndex,
    activeIndex,
  });

  const { getFloatingProps, getItemProps } = useInteractions([
    role,
    dismiss,
    listNavigation,
    typeahead,
  ]);

  useEffect(() => {
    function onContextMenu(e) {
      if (isRightClicked) {
        e.preventDefault();
        refs.setPositionReference({
          getBoundingClientRect() {
            return {
              width: 0,
              height: 0,
              x: e.clientX,
              y: e.clientY,
              top: e.clientY,
              right: e.clientX,
              bottom: e.clientY,
              left: e.clientX,
            };
          },
        });

        setIsOpen(true);
        dispatch(closeContextMenu());
      }
    }

    document.addEventListener("contextmenu", onContextMenu);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
    };
  }, [refs, isRightClicked]);

  return (
    <FloatingPortal id="root">
      {isOpen && (
        <FloatingFocusManager context={context} initialFocus={refs.floating}>
          <div
            className="min-w-[250px] max-w-[290px] rounded bg-white flex flex-col overflow-hidden py-1.5 z-50"
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              boxShadow:
                "0px 0.3px 0.9px rgba(0,0,0,0.1), 0px 1.6px 3.6px rgba(0,0,0,0.1)",
            }}
            {...getFloatingProps()}
          >
            {Children.map(children, (child, index) => {
              return (
                isValidElement(child) &&
                cloneElement(
                  child,
                  getItemProps({
                    tabIndex: activeIndex === index ? 0 : -1,
                    ref(node) {
                      listItemsRef.current[index] = node;
                    },
                    onClick() {
                      child.props.onClick?.();
                      setIsOpen(false);
                    },
                    onMouseUp() {
                      child.props.onClick?.();
                      setIsOpen(false);
                    },
                  })
                )
              );
            })}
          </div>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
});
