# Microsoft To Do clone project
---


## Description
First personal project.

The goal is to make it as similar as possible to the original Microsoft todo app.
[Original](https://to-do.office.com/)


## Deployment
---

[Here](https://ms-todo-clone-9156d.web.app/)



## Dev Logs
---

[Here](https://shimmer-catsup-02a.notion.site/MS-todo-app-038e582f80254b2095bbd0134bfe5a56)



## Development Duration
---

- approx. 5 months
- Started : Aug, 2023
- Deployed : Feb, 2024



## Features
---

- Add task with Due date, Reminder, Repeat options.
- Set complete and importance.
- Render Lists. (Myday, Important, Completed, Planned, Tasks)
- Search tasks and steps.
- Additional task options. (importance, complete, steps, categories, note, file)
- Sort tasks by importance, due date, alphabetically, creation date, added to myday.
- Group tasks by categories.
- Notification from reminder

- Responsive design.
- Tasks multi-selection ctrl or shift keydown.
- Task list infinite scrolling.
- Adjustable width sidebar.
- Customized react-datepicker calender design.
- Dark Mode.

- Sign-up and Sign-in using email and password.
- Sign-in using Google account.
- User profile update. (password, photo)
- Change password.
- Delete account.




## Technologies used
---

- HTML, CSS, JS
- React
- Redux Toolkit
- RTK Query
- React Router
- TailwindCSS
- Vite

- Firebase Firestore
- Firebase Authentication
- Firebase Storage
- Firebase Hosting

- @floating-ui/react
- react-datepicker
- react-uuid
- react-icons
- react-textarea-autosize
- react-loader-spinner



## Project Structure
---

<details>
	<summary>Structure</summary>
    
```
├─ src
│  ├─ api
│  │  ├─ firestoreApi.js
│  │  ├─ groupApiSlice.js
│  │  ├─ sortApiSlice.js
│  │  ├─ todoApiSlice.js
│  │  ├─ uiApiSlice.js
│  │  └─ userApiSlice.js
│  ├─ App.jsx
│  ├─ components
│  │  ├─ addtask
│  │  │  ├─ AddTask.jsx
│  │  │  ├─ AddTask.module.css
│  │  │  ├─ DueCalendar.jsx
│  │  │  ├─ DueItems.jsx
│  │  │  ├─ DuePopover.jsx
│  │  │  ├─ RemindCalendar.jsx
│  │  │  ├─ RemindItems.jsx
│  │  │  ├─ RemindPopover.jsx
│  │  │  ├─ RepeatCustom.jsx
│  │  │  ├─ RepeatItems.jsx
│  │  │  └─ RepeatPopover.jsx
│  │  ├─ Completed.jsx
│  │  ├─ details
│  │  │  ├─ DetailAddFile.jsx
│  │  │  ├─ DetailCategories.jsx
│  │  │  ├─ DetailCategoryItems.jsx
│  │  │  ├─ DetailDuePopover.jsx
│  │  │  ├─ DetailFileItem.jsx
│  │  │  ├─ DetailHeader.jsx
│  │  │  ├─ DetailNote.jsx
│  │  │  ├─ DetailOptions.jsx
│  │  │  ├─ DetailRemindPopover.jsx
│  │  │  ├─ DetailRepeatPopover.jsx
│  │  │  ├─ Details.jsx
│  │  │  ├─ DetailStepItem.jsx
│  │  │  ├─ DetailSteps.jsx
│  │  │  └─ TaskDetail.jsx
│  │  ├─ header
│  │  │  ├─ Header.jsx
│  │  │  └─ Searchbar.jsx
│  │  ├─ Important.jsx
│  │  ├─ Inbox.jsx
│  │  ├─ Loading.jsx
│  │  ├─ modals
│  │  │  ├─ ContextMenu.jsx
│  │  │  ├─ DeleteDialog.jsx
│  │  │  ├─ InformationModal.jsx
│  │  │  └─ TaskItemContextMenu.jsx
│  │  ├─ myaccount
│  │  │  ├─ ChangePassword.jsx
│  │  │  ├─ DeleteAccount.jsx
│  │  │  ├─ MyAccount.jsx
│  │  │  ├─ RegisterPassword.jsx
│  │  │  └─ UpdateProfile.jsx
│  │  ├─ Myday.jsx
│  │  ├─ Planned.jsx
│  │  ├─ ProtectedLayout.jsx
│  │  ├─ ResetPassword.jsx
│  │  ├─ Search.jsx
│  │  ├─ sidebar
│  │  │  └─ Sidebar.jsx
│  │  ├─ SignIn.jsx
│  │  ├─ SignUp.jsx
│  │  ├─ tasks
│  │  │  ├─ BasicList.jsx
│  │  │  ├─ CompleteList.jsx
│  │  │  ├─ GroupLists.jsx
│  │  │  ├─ ImportantList.jsx
│  │  │  ├─ MydayList.jsx
│  │  │  ├─ PlannedList.jsx
│  │  │  ├─ searchedLists
│  │  │  │  ├─ SearchedCategories.jsx
│  │  │  │  ├─ SearchedNotes.jsx
│  │  │  │  ├─ SearchedSteps.jsx
│  │  │  │  └─ SearchedTasks.jsx
│  │  │  ├─ TaskHeader.jsx
│  │  │  ├─ TaskItem.jsx
│  │  │  ├─ TaskItemCategories.jsx
│  │  │  ├─ TaskItemHeader.jsx
│  │  │  └─ TaskItemOptions.jsx
│  │  ├─ toolbar
│  │  │  ├─ CompletedSortItems.jsx
│  │  │  ├─ GroupIndicator.jsx
│  │  │  ├─ GroupItems.jsx
│  │  │  ├─ GroupPopover.jsx
│  │  │  ├─ ImportantSortItems.jsx
│  │  │  ├─ MydaySortItems.jsx
│  │  │  ├─ SortIndicator.jsx
│  │  │  ├─ sortListItems
│  │  │  │  ├─ SortAddMydayItem.jsx
│  │  │  │  ├─ SortAlphabeticallyItem.jsx
│  │  │  │  ├─ SortCreationDateItem.jsx
│  │  │  │  ├─ SortDueDateItem.jsx
│  │  │  │  └─ SortImportanceItem.jsx
│  │  │  ├─ SortPopover.jsx
│  │  │  └─ TasksSortItems.jsx
│  │  └─ ui
│  │     ├─ Panel.jsx
│  │     ├─ Popper.jsx
│  │     ├─ SidebarOverlay.jsx
│  │     └─ UsePopper.jsx
│  ├─ hooks
│  │  ├─ useAuth.js
│  │  ├─ useInfiniteScroll.js
│  │  ├─ useLocalStorage.js
│  │  ├─ useOutsideClick.js
│  │  ├─ useRemindNotification.js
│  │  ├─ useTheme.js
│  │  ├─ useTitle.js
│  │  ├─ useUpdateMyday.js
│  │  └─ useViewport.js
│  ├─ index.css
│  ├─ index.jsx
│  ├─ pages
│  │  ├─ CompletedPage.jsx
│  │  ├─ ImportantPage.jsx
│  │  ├─ InboxPage.jsx
│  │  ├─ MyAccountPage.jsx
│  │  ├─ MydayPage.jsx
│  │  ├─ NotFoundPage.jsx
│  │  ├─ PlannedPage.jsx
│  │  ├─ RootPage.jsx
│  │  ├─ SearchPage.jsx
│  │  ├─ SignInPage.jsx
│  │  └─ SignUpPage.jsx
│  ├─ panels
│  │  ├─ AccountManager.jsx
│  │  ├─ AppLauncher.jsx
│  │  ├─ HeaderPanels.jsx
│  │  ├─ Help.jsx
│  │  ├─ Settings.jsx
│  │  └─ WhatsNew.jsx
│  ├─ store
│  │  ├─ activeSlice.js
│  │  ├─ searchSlice.js
│  │  ├─ sortSlice.js
│  │  ├─ store.js
│  │  └─ uiSlice.js
│  └─ utils
│     ├─ getDates.js
│     ├─ groupTasks.js
│     ├─ repeatTask.js
│     └─ sortTasks.js
```
</details>
