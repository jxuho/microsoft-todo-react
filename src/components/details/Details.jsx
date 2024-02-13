import getLastTimeOfDay, {
  getNextClosestDayOfWeekFromDate,
} from "../../utils/getDates";
import { Suspense, lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useChangeOptionTodoApiMutation } from "../../api/todoApiSlice";
import { Oval } from "react-loader-spinner";
import { auth } from "../../firebase";

const DetailHeader = lazy(() => import("./DetailHeader"));
const DetailSteps = lazy(() => import("./DetailSteps"));
const DetailOptions = lazy(() => import("./DetailOptions"));
const DetailCategories = lazy(() => import("./DetailCategories"));
const DetailAddFile = lazy(() => import("./DetailAddFile"));
const DetailNote = lazy(() => import("./DetailNote"));

const Details = ({ taskId, todos }) => {
  const location = useLocation();
  const todo = todos.find((todo) => todo.id === taskId);
  const userId = auth.currentUser?.uid;
  const [changeOptionTodoApi] = useChangeOptionTodoApiMutation();

  useEffect(() => {
    // due 제거되면 repeat도 제거
    if (!todo) return;
    if (!todo.dueDate && todo.repeatRule) {
      changeOptionTodoApi({
        todoId: taskId,
        userId,
        option: "repeatRule",
        content: "",
        currentLocation: location.pathname,
      });
    }
  }, [todo?.dueDate]);

  useEffect(() => {
    // repeat설정했을때, due버튼 설정
    if (!todo) return;
    if (todo.repeatRule && !todo.dueDate) {
      if (todo.repeatRule.split("-").length === 2) {
        // due를 getLastTimeOfDay()로 설정

        changeOptionTodoApi({
          todoId: taskId,
          userId,
          option: "dueDate",
          content: getLastTimeOfDay().toISOString(),
          currentLocation: location.pathname,
        });
      } else {
        const today = new Date();

        changeOptionTodoApi({
          todoId: taskId,
          userId,
          option: "dueDate",
          content: getNextClosestDayOfWeekFromDate(
            today,
            todo.repeatRule.split("-").slice(2)
          ).toISOString(),
          currentLocation: location.pathname,
        });
      }
    }
  }, [todo?.repeatRule]);

  return (
    <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto py-0 pr-4 pl-6 mt-4 h-20">
      <Suspense
        fallback={
          <div className="w-full h-full flex justify-center items-center">
            <Oval
              height={50}
              width={50}
              color="#2564cf"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#78bafd"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        }
      >
        <DetailHeader taskId={taskId} todo={todo} />
        <DetailSteps taskId={taskId} todo={todo} />
        <DetailOptions taskId={taskId} todo={todo} />
        <DetailCategories taskId={taskId} todo={todo} />
        <DetailAddFile taskId={taskId} todo={todo} />
        <DetailNote taskId={taskId} todo={todo} />
      </Suspense>
    </div>
  );
};

export default Details;

