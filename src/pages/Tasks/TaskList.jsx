import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  limit,
  startAfter,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import "./TaskList.scss";

const TaskList = () => {
  const [showInput, setShowInput] = useState({
    todo: false,
    doing: false,
    done: false,
  });
  const [tasks, setTasks] = useState({
    todo: [],
    doing: [],
    done: [],
  });
  const [newTaskText, setNewTaskText] = useState("");
  const [newPriority, setNewPriority] = useState("low");
  const [newAssignee, setNewAssignee] = useState("");
  const [filter, setFilter] = useState({
    status: "",
    priority: "",
    assignee: "",
  });
  const [file, setFile] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks in real-time from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const taskData = { todo: [], doing: [], done: [] };
      snapshot.forEach((doc) => {
        const task = { id: doc.id, ...doc.data() };
        taskData[task.status].push(task);
      });
      setTasks(taskData);
    });

    return () => unsubscribe();
  }, []);

  // Handle task creation
  const createTask = async (listName) => {
    if (!newTaskText.trim()) {
      toast.error("Task name cannot be empty.");
      return;
    }
    try {
      await addDoc(collection(db, "tasks"), {
        text: newTaskText,
        status: listName,
        priority: newPriority,
        assignee: newAssignee,
        createdAt: new Date(),
      });
      toast.success("Task added!");
      setNewTaskText("");
      setNewPriority("low");
      setNewAssignee("");
    } catch (error) {
      toast.error("Error adding task!");
    }
  };

  // Handle task update
  const updateTask = async (taskId) => {
    const { text, priority, assignee } = editingTask;
    try {
      const taskDoc = doc(db, "tasks", taskId);
      await updateDoc(taskDoc, { text, priority, assignee });
      toast.success("Task updated!");
      setEditingTask(null);
    } catch (error) {
      toast.error("Error updating task!");
    }
  };

  // Handle task deletion
  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      toast.success("Task deleted!");
    } catch (error) {
      toast.error("Error deleting task!");
    }
  };

  // Handle drag and drop
  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;

    // Clone the task that is being moved
    const [movedTask] = tasks[sourceStatus].splice(source.index, 1);
    movedTask.status = destinationStatus;

    // Update Firestore
    try {
      const taskDoc = doc(db, "tasks", movedTask.id);
      await updateDoc(taskDoc, { status: destinationStatus });

      const updatedTasks = {
        ...tasks,
        [destinationStatus]: [
          ...tasks[destinationStatus].slice(0, destination.index),
          movedTask,
          ...tasks[destinationStatus].slice(destination.index),
        ],
      };
      setTasks(updatedTasks);

      toast.success("Task moved successfully!");
    } catch (error) {
      toast.error("Error moving task!");
    }
  };

  // Handle CSV Export
  const exportToCSV = () => {
    const data = [];
    Object.keys(tasks).forEach((status) => {
      tasks[status].forEach((task) => {
        data.push({
          Title: task.text,
          Status: task.status,
          Description: task.description || "",
          DueDate: task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "",
          Priority: task.priority || "",
          Assignee: task.assignee || "",
        });
      });
    });
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "tasks.csv");
  };

  // Handle CSV Import
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const importFromCSV = () => {
    if (file) {
      Papa.parse(file, {
        complete: async (result) => {
          const tasks = result.data;
          const errors = validateAndProcessTasks(tasks);
          if (errors.length > 0) {
            downloadErrorReport(errors);
          } else {
            toast.success("Tasks imported successfully!");
          }
        },
        header: true,
      });
    }
  };

  // Validate tasks from CSV
  const validateAndProcessTasks = (tasks) => {
    const errors = [];
    tasks.forEach(async (task, index) => {
      if (!task.Title || !task.Status) {
        errors.push({ row: index + 1, error: "Missing required fields" });
      } else if (new Date(task.DueDate) < new Date()) {
        errors.push({ row: index + 1, error: "Due date is in the past" });
      }

      if (errors.length === 0) {
        await addDoc(collection(db, "tasks"), {
          text: task.Title,
          description: task.Description,
          dueDate: task.DueDate,
          priority: task.Priority,
          status: task.Status.toLowerCase(),
          assignee: task.Assignee,
          createdAt: new Date(),
        });
      }
    });
    return errors;
  };

  const downloadErrorReport = (errors) => {
    const csv = Papa.unparse(errors);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "error_report.csv");
  };

  // Handle Filtering
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredTasks = Object.keys(tasks).reduce((acc, status) => {
    acc[status] = tasks[status].filter((task) => {
      const statusMatch = filter.status ? task.status === filter.status : true;
      const priorityMatch = filter.priority
        ? task.priority === filter.priority
        : true;
      const assigneeMatch = filter.assignee
        ? task.assignee === filter.assignee
        : true;
      return statusMatch && priorityMatch && assigneeMatch;
    });
    return acc;
  }, {});

  const handleEditClick = (task) => {
    setEditingTask({ ...task });
  };

  return (
    <div className="task-section">
      {/* CSV Upload/Download */}
      <div className="csv-section pt-3 me-5 d-flex flex-lg-row flex-column align-items-lg-center justify-content-lg-end justify-content-center">
        <button onClick={exportToCSV} className="export-btn me-lg-3">
          <i className="fa-solid fa-download"></i> Export CSV
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="form-control me-lg-3 my-lg-0 my-3 file-upload"
        />
        <button onClick={importFromCSV} className="import-btn">
          <i className="fa-solid fa-upload"></i> Import CSV
        </button>
      </div>

      <div className="filter-section my-4 mx-md-5 mx-0 row align-items-center">
        <div className="col-md-12 mb-3">
          <label htmlFor="statusFilter" className="form-label">
            Filter by Status
          </label>
          <select
            id="statusFilter"
            name="status"
            className="form-select"
            onChange={handleFilterChange}
            value={filter.status}
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="doing">In Progress</option>
            <option value="done">Completed</option>
          </select>
        </div>
        <div className="col-md-12 mb-3">
          <label htmlFor="priorityFilter" className="form-label">
            Filter by Priority
          </label>
          <select
            id="priorityFilter"
            name="priority"
            className="form-select"
            onChange={handleFilterChange}
            value={filter.priority}
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="col-md-12 mb-3">
          <label htmlFor="assigneeFilter" className="form-label">
            Filter by Assignee
          </label>
          <input
            id="assigneeFilter"
            name="assignee"
            type="text"
            className="form-control"
            placeholder="Enter assignee name"
            onChange={handleFilterChange}
            value={filter.assignee}
          />
        </div>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <ul className="task-list mx-md-5 mx-0 row align-items-center">
          {["todo", "doing", "done"].map((status, index) => (
            <li
              className="col-xl-2 col-lg-4 col-md-6 col-12 mt-5 mb-md-0 mb-4 me-lg-4 me-0 task-bg"
              key={index}
            >
              <h2 className="task-heading mb-3 mt-2 ms-2">
                {status === "todo"
                  ? "To Do"
                  : status === "doing"
                  ? "In Progress"
                  : "Completed"}
              </h2>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="task-droppable"
                  >
                    {filteredTasks[status].map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="task-item fade-in"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {editingTask && editingTask.id === task.id ? (
                              <div className="edit-task-form">
                                <label
                                  htmlFor="editname"
                                  className="form-label"
                                >
                                  Edit Task Name
                                </label>
                                <input
                                  type="text"
                                  id="editname"
                                  value={editingTask.text}
                                  onChange={(e) =>
                                    setEditingTask({
                                      ...editingTask,
                                      text: e.target.value,
                                    })
                                  }
                                  className="form-control mb-2"
                                />
                                <label
                                  htmlFor="editpriorty"
                                  className="form-label"
                                >
                                  Edit Task Priority
                                </label>
                                <select
                                  value={editingTask.priority}
                                  onChange={(e) =>
                                    setEditingTask({
                                      ...editingTask,
                                      priority: e.target.value,
                                    })
                                  }
                                  className="form-control mb-2"
                                >
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                </select>
                                <label
                                  htmlFor="editassignee"
                                  className="form-label"
                                >
                                  Edit Task Assignee Name
                                </label>
                                <input
                                  type="text"
                                  id="editassignee"
                                  value={editingTask.assignee}
                                  onChange={(e) =>
                                    setEditingTask({
                                      ...editingTask,
                                      assignee: e.target.value,
                                    })
                                  }
                                  className="form-control mb-2"
                                  placeholder="Assignee"
                                />
                                <button
                                  onClick={() => updateTask(task.id)}
                                  className="btn btn-primary"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingTask(null)}
                                  className="btn btn-secondary ms-2"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div>
                                <div className="d-flex justify-content-between">
                                  <span className="task">{task.text}</span>
                                  <div className="icons">
                                    <i
                                      className="fa-solid fa-pen check"
                                      onClick={() => handleEditClick(task)}
                                    ></i>
                                    <i
                                      className="fa-solid fa-trash-can delete"
                                      onClick={() => deleteTask(task.id)}
                                    ></i>
                                  </div>
                                </div>
                                <p className="task-assignee">
                                  Assigned to : {task.assignee || "Unassigned"}
                                </p>
                                <p
                                  className={`task-priority priority-${task.priority}`}
                                >
                                  Priority : {task.priority}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* Add new task */}
              <div className="add-task">
                {showInput[status] ? (
                  <div>
                    <textarea
                      className="add-card-box"
                      placeholder="Enter a name for this card...."
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                    ></textarea>
                    <select
                      className="add-card-box mt-2"
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <input
                      type="text"
                      className="add-card-box mt-3"
                      placeholder="Assignee"
                      value={newAssignee}
                      onChange={(e) => setNewAssignee(e.target.value)}
                    />
                    <button
                      className="add-btn mt-2"
                      onClick={() => {
                        createTask(status);
                        setShowInput({ ...showInput, [status]: false });
                      }}
                    >
                      Add Card
                    </button>
                  </div>
                ) : (
                  <button
                    className="add-task-btn"
                    onClick={() =>
                      setShowInput({ ...showInput, [status]: true })
                    }
                  >
                    + Add Card
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </DragDropContext>
    </div>
  );
};

export default TaskList;
