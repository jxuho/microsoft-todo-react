import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import getNextRepeatTask, { repeatDueSynchronizer } from "../utils/repeatTask";
import { isDateToday } from "../utils/getDates";
import { firestoreApi } from "./firestoreApi";
import popSound from "../../public/popSound.mp3";

export const todoApiSlice = firestoreApi.injectEndpoints({
  baseQuery: fakeBaseQuery(),
  tagTypes: ["todos"],
  endpoints: (builder) => ({

    getTodosApi: builder.query({
      async queryFn(userId) {
        if (!userId) {
          return { data: null };
        }
        try {
          // console.log('getTodosApi');
          const querySnapshot = await getDocs(
            collection(db, `users/${userId}/todos`)
          );
          let todosArr = [];
          querySnapshot?.forEach((doc) => {
            todosArr.push(doc.data());
          });

          return { data: todosArr };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },
      providesTags: ["todos"],
    }),

    addTodoApi: builder.mutation({
      async queryFn({ todo, userId }) {
        try {
          const created = new Date().toISOString();

          const modifiedDue = repeatDueSynchronizer(todo);
          if (modifiedDue) {
            todo = {
              ...todo,
              dueDate: modifiedDue.toISOString(),
            };
          }
          if (!todo.myday) {
            if (isDateToday(new Date(todo.dueDate))) {
              await setDoc(doc(db, `users/${userId}/todos`, todo.id), {
                ...todo,
                myday: true,
                created,
              });
            } else {
              await setDoc(doc(db, `users/${userId}/todos`, todo.id), {
                ...todo,
                myday: false,
                created,
              });
            }
          } else {
            await setDoc(doc(db, `users/${userId}/todos`, todo.id), {
              ...todo,
              created,
            });
          }

          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },

      async onQueryStarted({ todo, userId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData(
            "getTodosApi",
            userId,
            (draft) => {
              const created = new Date().toISOString();
              const modifiedDue = repeatDueSynchronizer(todo);
              if (modifiedDue) {
                todo = {
                  ...todo,
                  dueDate: modifiedDue.toISOString(),
                };
              }
              if (!todo.myday) {
                if (isDateToday(new Date(todo.dueDate))) {
                  todo.myday = true;
                } else {
                  todo.myday = false;
                }
              }
              // todo.created = Timestamp.fromDate(new Date())
              todo.created = created;
              draft.push(todo);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: ["todos"],
    }),

    removeTodoApi: builder.mutation({
      async queryFn({ todoId, userId }) {
        try {
          await deleteDoc(doc(db, `users/${userId}/todos`, todoId));
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData(
            "getTodosApi",
            args.userId,
            (draft) => {
              return draft.filter((taskItem) => taskItem.id !== args.todoId);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: ["todos"],
    }),

    setCompleteTodoApi: builder.mutation({
      async queryFn({ todoId, userId, value, newTaskId }) {
        // console.log("setCompleteTodo");
        try {
          const docSnap = await getDoc(
            doc(db, `users/${userId}/todos`, todoId)
          );
          const docData = docSnap.data();
          if (!value) {
            await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
              complete: "",
            });
          } else {
            await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
              complete: new Date().toISOString(),
            });
            if (docData.repeatRule && !docData.repeated) {
              await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
                repeated: true,
              });
              const newRepeatTask = getNextRepeatTask(docData, newTaskId);
              await setDoc(
                doc(db, `users/${userId}/todos`, newRepeatTask.id),
                newRepeatTask
              );
            }
          }
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },

      async onQueryStarted(
        { todoId, userId, value, newTaskId },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData(
            "getTodosApi",
            userId,
            (draft) => {
              const taskToChange = draft.find((task) => task.id === todoId);
              if (value === true) new Audio(popSound).play();
              taskToChange.complete = value;

              if (!value) {
                taskToChange.complete = "";
              } else {
                taskToChange.complete = new Date().toISOString();

                if (taskToChange.repeatRule && !taskToChange.repeated) {
                  taskToChange.repeated = true;

                  const newRepeatTask = getNextRepeatTask(
                    taskToChange,
                    newTaskId
                  );
                  draft.push(newRepeatTask);
                }
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["todos"],
    }),

    setImportanceTodoApi: builder.mutation({
      async queryFn({ todoId, userId, value }) {
        try {
          await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
            importance: value,
          });
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },

      async onQueryStarted(
        { todoId, userId, value },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData(
            "getTodosApi",
            userId,
            (draft) => {
              const taskToChange = draft.find((task) => task.id === todoId);
              taskToChange.importance = value;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: ["todos"],
    }),

    changeTaskTodoApi: builder.mutation({
      async queryFn({ todoId, userId, value }) {
        try {
          await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
            task: value,
          });
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },

      async onQueryStarted(
        { todoId, userId, value },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData(
            "getTodosApi",
            userId,
            (draft) => {
              const taskToChange = draft.find((task) => task.id === todoId);
              taskToChange.task = value;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: ["todos"],
    }),

    setMydayTodoApi: builder.mutation({
      async queryFn({ todoId, userId, value }) {
        try {
          await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
            myday: value,
          });
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },

      async onQueryStarted(
        { todoId, userId, value },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData(
            "getTodosApi",
            userId,
            (draft) => {
              const taskToChange = draft.find((task) => task.id === todoId);
              taskToChange.myday = value;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: ["todos"],
    }),

    changeOptionTodoApi: builder.mutation({
      async queryFn({ todoId, userId, option, content, currentLocation }) {
        try {
          const docSnap = await getDoc(
            doc(db, `users/${userId}/todos`, todoId)
          );
          const docData = docSnap.data();

          await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
            [option]: content,
          });

          const modifiedDue = repeatDueSynchronizer(docData);
          if (modifiedDue) {
            await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
              dueDate: modifiedDue.toISOString(),
            });
          }

          if (
            currentLocation !== "/myday" &&
            option === "dueDate" &&
            isDateToday(new Date(content))
          ) {
            await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
              myday: true,
            });
          }
          // else if (
          //   currentLocation !== "/myday" &&
          //   option === "dueDate" &&
          //   !isDateToday(new Date(content))
          // ) {
          //   await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
          //     myday: false,
          //   });
          // }
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },

      async onQueryStarted(
        { todoId, userId, option, content, currentLocation },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData(
            "getTodosApi",
            userId,
            (draft) => {
              const taskToChange = draft.find((task) => task.id === todoId);
              taskToChange[option] = content;
              if (
                currentLocation !== "/myday" &&
                option === "dueDate" &&
                isDateToday(new Date(content))
              ) {
                taskToChange.myday = true;
              }
              // else if (
              //   currentLocation !== "/myday" &&
              //   option === "dueDate" &&
              //   !isDateToday(new Date(content))
              // ) {
              //   taskToChange.myday = false;
              // }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: ["todos"],
    }),

    setRemindedTodoApi: builder.mutation({
      // change reminded value
      async queryFn({ todoId, userId, value }) {
        try {
          await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
            reminded: value,
          });
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },

      async onQueryStarted(
        { todoId, userId, value },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData(
            "getTodosApi",
            userId,
            (draft) => {
              const taskToChange = draft.find((task) => task.id === todoId);
              taskToChange.reminded = value;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: ["todos"],
    }),

    addCategoryTodoApi: builder.mutation({
      async queryFn({ todoId, userId, category }) {
        try {
          await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
            category: arrayUnion(category),
          });
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },
      async onQueryStarted(
        { todoId, userId, category },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData(
            "getTodosApi",
            userId,
            (draft) => {
              const taskToChange = draft.find((task) => task.id === todoId);
              taskToChange.category.push(category);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: ["todos"],
    }),

    removeCategoryTodoApi: builder.mutation({
      async queryFn({ todoId, userId, category }) {
        try {
          await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
            category: arrayRemove(category),
          });
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },

      async onQueryStarted(
        { todoId, userId, category },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData(
            "getTodosApi",
            userId,
            (draft) => {
              const taskToChange = draft.find((task) => task.id === todoId);
              taskToChange.category = taskToChange.category.filter(
                (categoryItem) => categoryItem !== category
              );
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: ["todos"],
    }),

    addNoteTodoApi: builder.mutation({
      async queryFn({ todoId, userId, content }) {
        try {
          const updated = new Date().toISOString();
          await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
            "note.content": content,
            "note.updated": updated,
          });
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },

      async onQueryStarted(
        { todoId, userId, content },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData(
            "getTodosApi",
            userId,
            (draft) => {
              const taskToChange = draft.find((task) => task.id === todoId);
              taskToChange.note.content = content;
              taskToChange.note.updated = new Date().toISOString();
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },

      invalidatesTags: ["todos"],
    }),

    addFileTodoApi: builder.mutation({
      async queryFn({ todoId, userId, content }) {
        try {
          await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
            file: arrayUnion(content),
          });
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ["todos"],
    }),

    removeFileTodoApi: builder.mutation({
      async queryFn({ todoId, userId, fileRef }) {
        try {
          const docSnap = await getDoc(
            doc(db, `users/${userId}/todos`, todoId)
          );
          const docData = docSnap.data();
          const flieToRemove = docData.file.find(
            (fileItem) => fileItem.fileRef === fileRef
          );

          await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
            file: arrayRemove(flieToRemove),
          });
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ["todos"],
    }),

    addStepApi: builder.mutation({
      async queryFn({ todoId, userId, value }) {
        try {
          await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
            steps: arrayUnion(value),
          });
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },

      async onQueryStarted(
        { todoId, userId, value },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData(
            "getTodosApi",
            userId,
            (draft) => {
              const taskToChange = draft.find((task) => task.id === todoId);
              taskToChange.steps.push(value);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },

      invalidatesTags: ["todos"],
    }),

    completeStepApi: builder.mutation({
      async queryFn({ todoId, userId, stepId }) {
        try {
          const docSnap = await getDoc(
            doc(db, `users/${userId}/todos`, todoId)
          );
          const docData = docSnap.data();
          const index = docData.steps.findIndex((step) => step.id === stepId);
          docData.steps[index].complete = !docData.steps[index].complete;
          await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
            steps: docData.steps,
          });
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },

      async onQueryStarted(
        { todoId, userId, stepId },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData(
            "getTodosApi",
            userId,
            (draft) => {
              const taskToChange = draft.find((task) => task.id === todoId);
              const stepToChange = taskToChange.steps.find(
                (step) => step.id === stepId
              );
              if (!stepToChange.complete) new Audio(popSound).play();
              stepToChange.complete = !stepToChange.complete;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },

      invalidatesTags: ["todos"],
    }),

    removeStepApi: builder.mutation({
      async queryFn({ todoId, userId, stepId }) {
        try {
          const docSnap = await getDoc(
            doc(db, `users/${userId}/todos`, todoId)
          );
          const docData = docSnap.data();
          const docToRemove = docData.steps.find((step) => step.id === stepId);

          await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
            steps: arrayRemove(docToRemove),
          });
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },

      async onQueryStarted(
        { todoId, userId, stepId },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData(
            "getTodosApi",
            userId,
            (draft) => {
              const taskToChange = draft.find((task) => task.id === todoId);
              taskToChange.steps = taskToChange.steps.filter(
                (step) => step.id !== stepId
              );
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: ["todos"],
    }),

    changeStepApi: builder.mutation({
      async queryFn({ todoId, userId, stepId, value }) {
        try {
          const docSnap = await getDoc(
            doc(db, `users/${userId}/todos`, todoId)
          );
          const docData = docSnap.data();
          const index = docData.steps.findIndex((step) => step.id === stepId);
          docData.steps[index].content = value;
          await updateDoc(doc(db, `users/${userId}/todos`, todoId), {
            steps: docData.steps,
          });

          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },

      async onQueryStarted(
        { todoId, userId, stepId, value },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData(
            "getTodosApi",
            userId,
            (draft) => {
              const taskToChange = draft.find((task) => task.id === todoId);
              const stepToChange = taskToChange.steps.find(
                (step) => step.id === stepId
              );
              stepToChange.content = value;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },

      invalidatesTags: ["todos"],
    }),
  }),
});

export const {
  useGetTodosApiQuery,
  useAddTodoApiMutation,
  useRemoveTodoApiMutation,
  useSetCompleteTodoApiMutation,
  useSetImportanceTodoApiMutation,
  useChangeTaskTodoApiMutation,
  useSetMydayTodoApiMutation,
  useChangeOptionTodoApiMutation,
  useSetRemindedTodoApiMutation,
  useAddCategoryTodoApiMutation,
  useRemoveCategoryTodoApiMutation,
  useAddNoteTodoApiMutation,
  useAddFileTodoApiMutation,
  useRemoveFileTodoApiMutation,
  useAddStepApiMutation,
  useCompleteStepApiMutation,
  useRemoveStepApiMutation,
  useChangeStepApiMutation,
} = todoApiSlice;
