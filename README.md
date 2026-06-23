# Microsoft To Do Clone

A feature-rich clone of Microsoft To Do built with **React**, **Redux Toolkit**, **RTK Query**, **Firebase**, and **TailwindCSS**.

This project started as a React practice project after completing a Udemy course, but it gradually evolved into a full application clone as I analyzed and implemented the core features of Microsoft To Do.

Through this project, I experienced the full development flow of a web application, including feature analysis, UI implementation, state management, authentication, database integration, file upload, optimization, and deployment.

<br />

## Table of Contents

- [Overview](#overview)
- [Tech Stack & Deployment](#️-tech-stack--deployment)
- [Screenshots](#screenshots)
- [Live Demo](#live-demo)
- [Project Summary](#project-summary)
- [Main Features](#main-features)
- [Performance](#performance)
- [Calendar UI Customization](#calendar-ui-customization)
- [Architecture Overview](#architecture-overview)
- [Key Implementation Details](#key-implementation-details)
- [Development Process and Refactors](#development-process-and-refactors)
- [What I Learned](#what-i-learned)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)
- [Review](#review)

<br />

## Overview

This project is a Microsoft To Do clone built to practice and deepen my understanding of modern frontend development.

Although it began as a React practice project, it gradually expanded into a full-featured application as I analyzed Microsoft To Do and implemented its core task management features.

The project focuses on:

- Task management logic
- Firebase integration
- Authentication and account handling
- Server-state management with RTK Query
- UI/UX cloning
- Performance optimization
- Deployment

<br />

## 🛠️ Tech Stack & Deployment

| Category | Tech |
| :--- | :--- |
| **Deployment** | [![Firebase Hosting](https://img.shields.io/badge/Firebase_Hosting-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://ms-todo-clone-9156d.web.app/) |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) |
| **State Management** | ![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white) ![RTK Query](https://img.shields.io/badge/RTK_Query-764ABC?style=flat-square&logo=redux&logoColor=white) |
| **Backend / Infra** | ![Firebase Authentication](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black) ![Cloud Firestore](https://img.shields.io/badge/Cloud_Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black) ![Firebase Storage](https://img.shields.io/badge/Firebase_Storage-FFCA28?style=flat-square&logo=firebase&logoColor=black) |
| **UI Libraries** | ![Floating UI](https://img.shields.io/badge/Floating_UI-222222?style=flat-square) ![React Datepicker](https://img.shields.io/badge/React_Datepicker-61DAFB?style=flat-square&logo=react&logoColor=black) ![React Icons](https://img.shields.io/badge/React_Icons-E91E63?style=flat-square&logo=react&logoColor=white) |

<br />

## Screenshots

### Light Mode

<img width="1920" height="991" alt="Microsoft To Do Clone Screenshot" src="https://github.com/user-attachments/assets/caa8cc4b-20dd-4b1e-83b2-3f92337e94b1" />

<br />

### Dark Mode

<img width="1920" height="992" alt="Microsoft To Do Clone Dark Mode Screenshot" src="https://github.com/user-attachments/assets/cc6f8995-e33d-44f8-ae46-6a64dc533164" />

<br />

## Live Demo

- Live App: https://ms-todo-clone-9156d.web.app/
- Repository: `Add your GitHub repository URL here`

<br />

## Project Summary

| Category | Description |
| --- | --- |
| Project Type | Microsoft To Do clone |
| Main Focus | Task management logic, Firebase integration, server-state management, UI/UX cloning, performance optimization |
| Core Experience | End-to-end web application development from feature analysis to deployment |

<br />

## Main Features

### Authentication

- Email/password sign-up and sign-in
- Google OAuth sign-in
- User profile update
- Password change
- Account deletion
- Re-authentication for sensitive actions

### Task Management

- Add, edit, complete, and delete tasks
- Mark tasks as important
- Add due dates, reminders, and repeat options
- Add steps, categories, notes, and files to tasks
- Upload and manage files with Firebase Storage

### Lists and Search

- My Day, Important, Completed, Planned, and Tasks lists
- Search tasks and steps
- Sort tasks by importance, due date, alphabetically, creation date, and My Day status
- Group tasks by category

### UI / UX

- Reminder notifications using the Notification API
- Custom context menu
- Multi-selection with Ctrl and Shift keys
- Infinite scrolling for task lists
- Resizable task detail sidebar
- Responsive design
- Dark mode
- Custom-styled `react-datepicker` calendar

<br />

## Performance

### Lighthouse Results

| Category | Desktop | Mobile |
| --- | ---: | ---: |
| Performance | 100 | 74 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 90 | 92 |

### Desktop Metrics

| Metric | Result |
| --- | ---: |
| First Contentful Paint | 0.6s |
| Largest Contentful Paint | 0.6s |
| Total Blocking Time | 0ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 0.6s |

### Mobile Metrics

| Metric | Result |
| --- | ---: |
| First Contentful Paint | 3.7s |
| Largest Contentful Paint | 4.7s |
| Total Blocking Time | 100ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 3.7s |

### Desktop Report

<img width="390" height="500" alt="Lighthouse Desktop Report" src="https://github.com/user-attachments/assets/906bd31b-d36c-4fcf-a526-ae6bc891ee64" />

<br />

## Calendar UI Customization

I used `react-datepicker` for date selection and customized its default design by overriding the library's CSS classes.

### Before Custom Styling

<img width="355" height="443" alt="Calendar Before Custom Styling" src="https://github.com/user-attachments/assets/ff87ac85-cf20-4121-8b17-7c072a4a9c48" />

### After Custom Styling

<img width="250" height="430" alt="Calendar After Custom Styling" src="https://github.com/user-attachments/assets/2f757cdf-a563-4447-ae5a-50ee2650deff" />

<br />

## Architecture Overview

The application is a React single-page application deployed with Firebase Hosting.

Firebase Authentication handles user authentication, while Firestore stores user-specific task data, UI preferences, task options, and metadata. Firebase Storage is used for task file uploads.

RTK Query connects the frontend with Firestore data operations. It manages data fetching, caching, and optimistic updates for a smoother user experience.

Architecture flow:

    React + Vite
       |
    Redux Toolkit / RTK Query
       |
    Firebase Authentication
    Firebase Firestore
    Firebase Storage
    Firebase Hosting

<br />

## Key Implementation Details

### 1. Task Due Date, Repeat, and Reminder Logic

One of the most complex parts of the project was implementing the relationship between due dates, repeat options, and reminders.

For example, when a repeating task is completed, the app calculates the next due date based on the repeat interval and automatically creates or updates the next task instance.

Because the project only uses Firebase Firestore, Authentication, and Storage without a custom backend, this logic is handled on the client side using utility functions.

Main considerations included:

- Calculating the next due date for repeating tasks
- Handling tasks with both due date and repeat options
- Updating My Day status based on the current date
- Displaying dynamic button labels depending on the task date
- Triggering reminder notifications at the correct time

<br />

### 2. Popovers and Calendar UI

At first, I tried to implement popovers manually using outside-click handlers and event propagation logic. However, managing multiple popovers, nested interactions, and calendar placement became too complex.

I researched popover libraries and eventually adopted `@floating-ui/react`. This allowed me to build reliable popovers, tooltips, context menus, and calendar dropdowns.

For date selection, I used `react-datepicker` and customized its default styles by overriding its CSS classes.

Through this process, I learned:

- Event propagation
- Outside-click handling
- Floating element positioning
- Library documentation reading
- CSS override strategies for third-party components

<br />

### 3. RTK Query and Optimistic Updates

Initially, task data was managed with Redux slices. After connecting the app to Firestore, I needed a better way to handle server state, caching, and request lifecycle management.

Since the project already used Redux Toolkit, I adopted RTK Query.

RTK Query was used for:

- Fetching task data from Firestore
- Updating task status
- Creating and deleting tasks
- Updating task options
- Managing cache updates
- Applying optimistic updates

Optimistic updates were especially important because task interactions such as completing a task or marking it as important should feel instant.

Instead of waiting for the Firebase response before updating the UI, the app updates the UI immediately and then synchronizes with Firestore.

<br />

### 4. Resizable Detail Sidebar

The task detail panel is resizable through mouse drag interaction.

The implementation uses:

- `mousedown`
- `mousemove`
- `mouseup`
- `event.clientX`
- `getBoundingClientRect()`

The sidebar width is synchronized with Firestore so that each user can keep their preferred detail panel width.

This feature helped me better understand browser mouse events, layout measurement, and UI state synchronization.

<br />

### 5. Multi-selection with Ctrl and Shift

The task list supports multi-selection using Ctrl and Shift keys, similar to desktop file managers.

At first, I stored Ctrl and Shift key states in Redux. However, this caused unnecessary re-renders across all task items whenever a modifier key changed.

I later discovered that native mouse events already provide `event.ctrlKey` and `event.shiftKey`, which solved the problem without global key state management.

This experience taught me the importance of understanding native browser APIs before adding unnecessary application-level state.

<br />

### 6. Infinite Scrolling

I implemented infinite scrolling to reduce the rendering cost of large task lists.

The first idea was to fetch the next page of data from the server when the observer was triggered. However, because sorting and grouping logic is handled on the client side, true server-side pagination was not practical in this architecture.

As a result, the current infinite scrolling implementation improves rendering performance by gradually rendering task items on the client side, but it does not reduce Firestore read load.

This became one of the architectural limitations I identified during the project.

<br />

### 7. Firebase Authentication and Account Handling

The app supports both email/password authentication and Google OAuth.

I also implemented:

- Profile update
- Password change
- Password reset
- Account deletion
- Re-authentication flow for sensitive actions

While implementing Google OAuth, I had to handle edge cases where Google provider accounts and email/password accounts could collide.

This helped me understand authentication provider management and account lifecycle handling more deeply.

<br />

## Development Process and Refactors

During development, I changed several technical decisions as the project requirements became clearer.

| Before | After |
| --- | --- |
| Create React App | Vite |
| CSS Modules | TailwindCSS |
| Manual popover / Popper.js | Floating UI |
| Redux slice server data | RTK Query |
| Local task state | Firestore-based user data |

These migrations took time, but they helped me understand how technical decisions affect scalability, maintainability, and developer experience.

<br />

## What I Learned

Through this project, I learned how to:

- Analyze a real-world reference application and reproduce its core behavior
- Structure a React application with multiple complex features
- Use Redux Toolkit and RTK Query for client and server state management
- Integrate Firebase Authentication, Firestore, Storage, and Hosting
- Read official documentation and apply libraries to real problems
- Handle mouse events, popovers, custom calendars, and context menus
- Improve UX with optimistic updates
- Think about trade-offs between frontend-only logic and backend-driven logic
- Document problems, attempts, solutions, and lessons learned during development

<br />

## Limitations

Because this project was built only with Firebase Firestore, Authentication, and Storage, most business logic is handled on the frontend.

This created several limitations:

- Sorting and grouping are handled on the client side
- All task data needs to be fetched before client-side processing
- Repeat task logic and My Day updates run on the client
- Time-related logic depends on client time instead of server time
- Reminder logic is limited to the client environment
- Server-side validation is limited
- True backend pagination is not implemented
- Drag-and-drop ordering was not completed
- Accessibility improvements were not fully implemented
- Some popover and tooltip components could be more reusable

<br />

## Future Improvements

- Build a Node.js backend or Firebase Cloud Functions
- Move repeat, reminder, My Day, sorting, and grouping logic to the server
- Add server-side validation
- Improve authentication provider linking
- Implement drag-and-drop task ordering
- Add better accessibility support
- Improve component reusability
- Add automated tests
- Improve mobile performance
- Implement true server-side pagination
- Add better error handling and loading states

<br />

## Review

This was my first project where I went through the full process of analyzing, designing, implementing, optimizing, and deploying a web application.

Although I had a completed reference application, I faced many technical challenges because I did not know in advance which technologies would be needed.

As a result, I had to repeatedly solve problems, adopt new tools, migrate existing code, and refactor the project.

However, this process was valuable because it helped me learn how to approach problems structurally, compare technical options, read documentation, and make better implementation decisions.

The biggest lesson from this project was that planning the architecture and technology stack before implementation is important, but solving real problems during development is also one of the most effective ways to learn.
