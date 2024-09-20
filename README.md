# Task Manager React Application

A Task Management application built with React and Bootstrap. This app allows users to manage their tasks with role-based access (Admin and User).

## Features
- **User authentication** (Login & Registration)
- **Role-based access control** (Admin/User)
- **Task creation, assignment, and tracking**
- **Task status management** (e.g., To Do, In Progress, Completed)
- **Notifications** using `react-hot-toast`
- **Responsive UI** with SCSS, and Bootstrap
- **Smooth popups** using Bootstrap's JavaScript classes

## Technologies Used
- **React JS** - Frontend framework
- **Firebase** - Authentication and Task CRUD implementation
- **Axios** - API requests
- **Bootstrap** - Responsive design and popups
- **React Router** - Client-side routing
- **react-hot-toast** - Notification system

## Project Setup

1. Clone the project repository.
2. Navigate to the project directory and install dependencies:
    ```bash
    npm install
    ```
3. Run the project locally:
    ```bash
    npm run dev
    ```

## Task Description

This project allows users to create and manage tasks with the following features:
- **Task Creation**: Add tasks with title, description, priority, and assignee fields.
- **Task Management**: Update task status (To Do, In Progress, Completed), assign tasks, and set task priority (Low, Medium, High).
- **Task Filtering**: Filter tasks by status, priority, and assignee.
- **Task CRUD**: Implemented with Firebase backend for real-time task management.
- **CSV Import/Export**: Export tasks to CSV and import tasks from CSV files with validation.
- **Drag and Drop**: Move tasks between columns (To Do, In Progress, Completed) using drag-and-drop.
- **Pagination**: Manage large task lists by paginating tasks in batches.
- **Notifications**: Display toast notifications for task creation, updates, and deletions.

## Notes
- This application uses Firebase for authentication and real-time task CRUD operations.
- Form validation is handled using Formik and Yup.
- Notifications are handled by `react-hot-toast`.
- SCSS and Bootstrap are used for the responsive design.

## Future Enhancements
- **Task Reminders**: Set due dates and get reminders for upcoming tasks.
- **Comments on Tasks**: Allow users to comment on tasks.
- **Performance Optimization**: Optimize task rendering and improve overall application performance.
