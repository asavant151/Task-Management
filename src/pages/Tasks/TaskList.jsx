import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
        createdAt: new Date(),
      });
      toast.success("Task added!");
      setNewTaskText("");
    } catch (error) {
      toast.error("Error adding task!");
    }
  };

  // Handle task update
  const updateTask = async (taskId, newText) => {
    try {
      const taskDoc = doc(db, "tasks", taskId);
      await updateDoc(taskDoc, { text: newText });
      toast.success("Task updated!");
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

  // Handle input visibility for adding new tasks
  const handleAddClick = (listName) => {
    setShowInput({ ...showInput, [listName]: true });
  };

  const handleCloseClick = (listName) => {
    setShowInput({ ...showInput, [listName]: false });
    setNewTaskText("");
  };

  // Handle drag end
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

    // Update the task's status
    movedTask.status = destinationStatus;

    // Update Firestore
    try {
      const taskDoc = doc(db, "tasks", movedTask.id);
      await updateDoc(taskDoc, { status: destinationStatus });

      // Insert task into the new list
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

  return (
    <div className="task-section">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <ul className="task-list mx-md-5 mx-0 row">
          {["todo", "doing", "done"].map((status) => (
            <li
              className="col-xl-2 col-lg-4 col-md-6 col-12 mt-5 mb-md-0 mb-4 me-lg-4 me-0 task-bg"
              key={status}
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
                    {tasks[status].map((task, index) => (
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
                            <span className="task">{task.text}</span>
                            <div className="icons">
                              <i
                                className="fa-solid fa-pen check"
                                onClick={() => {
                                  const newText = prompt(
                                    "Edit task:",
                                    task.text
                                  );
                                  if (newText) updateTask(task.id, newText);
                                }}
                              ></i>
                              <i
                                className="fa-solid fa-trash-can delete"
                                onClick={() => deleteTask(task.id)}
                              ></i>
                            </div>
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
                    <button
                      className="add-btn mt-2"
                      onClick={() => {
                        createTask(status);
                        setShowInput({ ...showInput, [status]: false });
                      }}
                    >
                      Add card
                    </button>
                    <button
                      className="close-btn mt-2 ms-2"
                      onClick={() => handleCloseClick(status)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="add-task-btn"
                    onClick={() => handleAddClick(status)}
                  >
                    <i className="fa-solid fa-plus pluse-icon"></i> Add a card
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
