# ✅ Microsoft To Do Clone

A feature-rich Microsoft To Do clone built with **React**, **Redux Toolkit**, **RTK Query**, **Firebase**, and **Tailwind CSS**.

This project recreates the core experience of Microsoft To Do, including task organization, reminders, repeat schedules, file attachments, search, sorting, grouping, multi-selection, dark mode, and user account management.

The primary focus was building a complete frontend-driven productivity application while handling real application concerns such as authentication, server-state synchronization, optimistic updates, client-side business logic, UI interaction complexity, and deployment.

---

## 🛠️ Tech Stack & Deployment

| Category | Tech |
| :--- | :--- |
| **Deployment** | [![Firebase Hosting](https://img.shields.io/badge/Firebase_Hosting-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://ms-todo-clone-9156d.web.app/) |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) |
| **State Management** | ![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white) ![RTK Query](https://img.shields.io/badge/RTK_Query-764ABC?style=flat-square&logo=redux&logoColor=white) |
| **Backend / Infra** | ![Firebase Authentication](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black) ![Cloud Firestore](https://img.shields.io/badge/Cloud_Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black) ![Firebase Storage](https://img.shields.io/badge/Firebase_Storage-FFCA28?style=flat-square&logo=firebase&logoColor=black) |
| **UI Libraries** | ![Floating UI](https://img.shields.io/badge/Floating_UI-222222?style=flat-square) ![React Datepicker](https://img.shields.io/badge/React_Datepicker-61DAFB?style=flat-square&logo=react&logoColor=black) ![React Icons](https://img.shields.io/badge/React_Icons-E91E63?style=flat-square&logo=react&logoColor=white) |

### 🔗 **[Live Demo](https://ms-todo-clone-9156d.web.app/)** · **Repository: Add your GitHub repository URL here**

---

## 📌 Project Summary

| Category | Description |
| :--- | :--- |
| **Project Type** | Microsoft To Do clone |
| **Main Focus** | Task management logic, Firebase integration, server-state management, UI/UX cloning, performance optimization |
| **Core Experience** | End-to-end web application development from feature analysis to deployment |
| **Architecture** | Frontend-driven React SPA backed by Firebase services |
| **Key Challenge** | Managing complex task behavior without a custom backend |

This application was developed as a full-featured productivity app clone rather than a static UI reproduction. The implementation focuses on reproducing real task-management behavior, synchronizing user-specific data through Firebase, and maintaining a responsive user experience through RTK Query caching and optimistic updates.

---

## 📊 Lighthouse Scores

| Category | Desktop | Mobile |
| :--- | :---: | :---: |
| **Performance** | 100 | 74 |
| **Accessibility** | 100 | 100 |
| **Best Practices** | 100 | 100 |
| **SEO** | 90 | 92 |

### Desktop Metrics

| Metric | Result |
| :--- | :---: |
| **First Contentful Paint** | 0.6s |
| **Largest Contentful Paint** | 0.6s |
| **Total Blocking Time** | 0ms |
| **Cumulative Layout Shift** | 0 |
| **Speed Index** | 0.6s |

### Mobile Metrics

| Metric | Result |
| :--- | :---: |
| **First Contentful Paint** | 3.7s |
| **Largest Contentful Paint** | 4.7s |
| **Total Blocking Time** | 100ms |
| **Cumulative Layout Shift** | 0 |
| **Speed Index** | 3.7s |

<img width="390" height="500" alt="Lighthouse Desktop Report" src="https://github.com/user-attachments/assets/906bd31b-d36c-4fcf-a526-ae6bc891ee64" />

---

## 🖼️ Screenshots

### Light Mode

<img width="1920" height="991" alt="Microsoft To Do Clone Screenshot" src="https://github.com/user-attachments/assets/caa8cc4b-20dd-4b1e-83b2-3f92337e94b1" />

### Dark Mode

<img width="1920" height="992" alt="Microsoft To Do Clone Dark Mode Screenshot" src="https://github.com/user-attachments/assets/cc6f8995-e33d-44f8-ae46-6a64dc533164" />

<details>
<summary><b>📅 Calendar UI Customization</b></summary>

The app uses `react-datepicker` for date selection and overrides the library's default CSS classes to match the Microsoft To Do-inspired UI.

### Before Custom Styling

<img width="355" height="443" alt="Calendar Before Custom Styling" src="https://github.com/user-attachments/assets/ff87ac85-cf20-4121-8b17-7c072a4a9c48" />

### After Custom Styling

<img width="250" height="430" alt="Calendar After Custom Styling" src="https://github.com/user-attachments/assets/2f757cdf-a563-4447-ae5a-50ee2650deff" />

</details>

---

## ✨ Features

| Feature | Details |
| :--- | :--- |
| 🔐 **Authentication** | Email/password auth, Google OAuth, profile update, password change, account deletion, and re-authentication for sensitive actions |
| ✅ **Task CRUD** | Add, edit, complete, delete, and mark tasks as important |
| 📅 **Scheduling** | Due dates, reminders, repeat options, and dynamic date-based labels |
| 🧩 **Task Details** | Steps, categories, notes, file attachments, and Firebase Storage integration |
| 📂 **Smart Lists** | My Day, Important, Completed, Planned, and Tasks views |
| 🔎 **Search & Organization** | Task and step search, sorting, category grouping, and My Day filtering |
| 🖱️ **Advanced Interaction** | Custom context menus, popovers, multi-selection with Ctrl/Shift, and resizable detail sidebar |
| ⚡ **Rendering Optimization** | Infinite scrolling for large task lists and optimistic UI updates |
| 🌙 **Responsive UI** | Dark mode, responsive layout, and custom-styled calendar components |

---

## 🧱 Architecture Overview

The application is a React single-page application deployed through Firebase Hosting. Firebase Authentication manages user identity, Firestore stores user-specific task data and preferences, and Firebase Storage handles task file uploads.

RTK Query acts as the data access layer between React components and Firestore operations. It centralizes request lifecycle management, caching, invalidation, and optimistic updates.

```txt
┌──────────────────────────────────────────────┐
│              React + Vite SPA                │
│   Tailwind CSS · React Router · UI logic     │
└─────────────────────┬────────────────────────┘
                      │
┌─────────────────────▼────────────────────────┐
│       Redux Toolkit / RTK Query Layer        │
│   Cache · Optimistic Updates · API Slices    │
└─────────────────────┬────────────────────────┘
                      │
┌─────────────────────▼────────────────────────┐
│              Firebase Services               │
│   Authentication · Firestore · Storage       │
└─────────────────────┬────────────────────────┘
                      │
┌─────────────────────▼────────────────────────┐
│              Firebase Hosting                │
└──────────────────────────────────────────────┘
```

---

## 🔑 Engineering Details

### 1. Task Due Date, Repeat, and Reminder Logic

The most complex domain logic involved coordinating due dates, repeat rules, reminders, and My Day behavior.

When a repeating task is completed, the app calculates the next due date based on the selected repeat interval and updates the next task state accordingly. Since the project uses Firebase services without a custom backend, this business logic is handled on the client through dedicated utility functions.

Key considerations included:

- Calculating the next due date for recurring tasks
- Handling tasks that combine due dates with repeat options
- Updating My Day status based on the current date
- Rendering dynamic button labels according to task timing
- Triggering reminder notifications at the correct time

---

### 2. Popovers, Context Menus, and Calendar Positioning

Manual popover handling became difficult as the app grew to include nested menus, outside-click behavior, tooltips, context menus, and calendar dropdowns.

`@floating-ui/react` was adopted to centralize floating element behavior and improve positioning reliability. This reduced fragile event propagation logic and made popovers, tooltips, context menus, and calendar dropdowns easier to maintain.

The date picker UI was built with `react-datepicker` and customized through CSS class overrides to better match the target application design.

---

### 3. RTK Query and Optimistic Updates

Initial task state was managed with Redux slices. After Firestore integration, the data layer needed stronger support for server state, cache management, loading states, and mutation lifecycle handling.

RTK Query was introduced to manage:

- Firestore-backed task fetching
- Task creation, update, completion, and deletion
- Task option updates
- Cache invalidation and cache patching
- Optimistic updates for instant UI feedback

Optimistic updates were especially important for frequent interactions such as completing tasks or toggling importance. The UI updates immediately, then synchronizes with Firestore in the background.

---

### 4. Resizable Detail Sidebar

The task detail panel supports mouse-driven resizing and persists each user's preferred width through Firestore.

The implementation uses native browser mouse events and layout measurements:

- `mousedown`
- `mousemove`
- `mouseup`
- `event.clientX`
- `getBoundingClientRect()`

This feature connects direct DOM interaction, React state updates, and persistent user preferences.

---

### 5. Multi-selection with Ctrl and Shift

The task list supports desktop-like multi-selection using Ctrl and Shift keys.

An early implementation stored modifier key state globally in Redux, which caused unnecessary re-renders across task items whenever key state changed. The final implementation relies on native event properties such as `event.ctrlKey` and `event.shiftKey`, avoiding global state updates and reducing render overhead.

This change simplified the interaction model and improved task list performance.

---

### 6. Infinite Scrolling and Rendering Trade-offs

Infinite scrolling was implemented to reduce rendering cost for large task lists.

Because sorting and grouping are handled on the client, true Firestore pagination was not practical within the current architecture. Instead, all task data is fetched first, then task items are progressively rendered on the client.

This improves DOM rendering performance, but it does not reduce Firestore read load. The trade-off is documented as an architectural limitation and a future backend improvement target.

---

### 7. Firebase Authentication and Account Lifecycle

The app supports both email/password authentication and Google OAuth.

Implemented account flows include:

- Profile update
- Password change
- Password reset
- Account deletion
- Re-authentication for sensitive actions

Google OAuth also introduced provider-collision edge cases between Google accounts and email/password accounts. Handling these scenarios required more deliberate account lifecycle management and provider-aware authentication logic.

---

## 🔄 Development Process and Major Refactors

Several implementation decisions changed as the project expanded from a React practice project into a complete application clone.

| Before | After |
| :--- | :--- |
| Create React App | Vite |
| CSS Modules | Tailwind CSS |
| Manual popover logic / Popper.js | Floating UI |
| Redux slice server data | RTK Query |
| Local task state | Firestore-backed user data |

These migrations improved scalability, maintainability, and developer experience while also exposing trade-offs around frontend-only business logic and Firebase-based architecture.

---

## 📊 Project Stats

- Full Microsoft To Do-inspired task management flow
- Firebase Authentication with email/password and Google OAuth
- Firestore-backed user-specific task data
- Firebase Storage-based task file uploads
- RTK Query-based server-state management
- Lighthouse Desktop Performance score: **100**
- Lighthouse Accessibility score: **100** on both desktop and mobile

---

## 🚧 Limitations

Because the project is built with Firebase Firestore, Authentication, and Storage without a custom backend, most business logic currently runs on the frontend.

| Limitation | Impact |
| :--- | :--- |
| Client-side sorting and grouping | All task data must be fetched before processing |
| Client-side repeat and My Day logic | Time-sensitive behavior depends on the client environment |
| Client-side reminders | Notifications are limited by browser and device conditions |
| Limited server-side validation | Data integrity relies heavily on frontend rules and Firestore security rules |
| No true backend pagination | Infinite scrolling improves rendering but not Firestore read load |
| Drag-and-drop ordering incomplete | Manual task ordering remains a future enhancement |
| Accessibility improvements incomplete | More keyboard and screen-reader refinement is needed |
| Some floating UI components could be more reusable | Further abstraction would improve maintainability |

---

## 🧭 Roadmap

- [ ] Build a Node.js backend or Firebase Cloud Functions
- [ ] Move repeat, reminder, My Day, sorting, and grouping logic to the server
- [ ] Add stronger server-side validation
- [ ] Improve authentication provider linking
- [ ] Implement drag-and-drop task ordering
- [ ] Improve keyboard and screen-reader accessibility
- [ ] Increase component reusability
- [ ] Add automated tests
- [ ] Improve mobile performance
- [ ] Implement true server-side pagination
- [ ] Add more robust error handling and loading states

---

## 💡 Reflection

This project provided end-to-end experience with analyzing a real-world reference application, decomposing features, selecting libraries, integrating Firebase services, optimizing interaction-heavy UI, and deploying a production-like web application.

The development process involved multiple migrations and refactors as requirements became clearer. These changes highlighted the importance of choosing architecture and tooling based on actual product behavior rather than initial assumptions.

The biggest takeaway was that frontend architecture decisions directly affect scalability, performance, and maintainability — especially when complex business logic is handled without a dedicated backend.
