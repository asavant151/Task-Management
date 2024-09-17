import React, { useState } from "react";
import "./TaskList.scss";

const TaskList = () => {
  const [showInput, setShowInput] = useState({
    todo: false,
    doing: false,
    done: false,
  });

  const handleAddClick = (listName) => {
    setShowInput({ ...showInput, [listName]: true });
  };

  const handleCloseClick = (listName) => {
    setShowInput({ ...showInput, [listName]: false });
  };
  return (
    <div className="task-section">
      <ul className="task-list mx-md-5 mx-0 mt-5 row">
        <li className="col-xl-2 col-lg-4 col-md-6 col-12 mb-md-0 mb-4">
          <div className="task-bg">
            <h2 className="task-heading mb-3 mt-2 ms-2">To do</h2>
            <div className="task-item fade-in">
              <span className="task">Task 1</span>
              <div className="icons">
                <i className="fa-solid fa-pen check"></i>
                <i className="fa-solid fa-trash-can delete"></i>
              </div>
            </div>
            <div className="add-task">
              {showInput.todo ? (
                <div>
                  <textarea
                    className="add-card-box"
                    placeholder="Enter a name for this card...."
                  ></textarea>
                  <button className="add-btn mt-2">Add card</button>
                  <button
                    className="close-btn mt-2 ms-2"
                    onClick={() => handleCloseClick("todo")}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="add-task-btn"
                  onClick={() => handleAddClick("todo")}
                >
                  <i className="fa-solid fa-plus pluse-icon"></i> Add a card
                </button>
              )}
            </div>
          </div>
        </li>
        <li className="col-xl-2 col-lg-4 col-md-6 col-12 mb-md-0 mb-4">
          <div className="task-bg">
            <h2 className="task-heading mb-3 mt-2 ms-2">In Progress</h2>
            <div className="task-item fade-in">
              <span className="task">Task 2</span>
              <div className="icons">
                <i className="fa-solid fa-pen check"></i>
                <i className="fa-solid fa-trash-can delete"></i>
              </div>
            </div>
            <div className="add-task">
              {showInput.doing ? (
                <div>
                  <textarea
                    className="add-card-box"
                    placeholder="Enter a name for this card...."
                  ></textarea>
                  <button className="add-btn mt-2">Add card</button>
                  <button
                    className="close-btn mt-2 ms-2"
                    onClick={() => handleCloseClick("doing")}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="add-task-btn"
                  onClick={() => handleAddClick("doing")}
                >
                  <i className="fa-solid fa-plus pluse-icon"></i> Add a card
                </button>
              )}
            </div>
          </div>
        </li>
        <li className="col-xl-2 col-lg-4 col-md-6 col-12">
          <div className="task-bg">
            <h2 className="task-heading mb-3 mt-2 ms-2">Completed</h2>
            <div className="task-item fade-in">
              <span className="task">Task 3</span>
              <div className="icons">
                <i className="fa-solid fa-pen check"></i>
                <i className="fa-solid fa-trash-can delete"></i>
              </div>
            </div>
            <div className="add-task">
              {showInput.done ? (
                <div>
                  <textarea
                    className="add-card-box"
                    placeholder="Enter a name for this card...."
                  ></textarea>
                  <button className="add-btn mt-2">Add card</button>
                  <button
                    className="close-btn mt-2 ms-2"
                    onClick={() => handleCloseClick("done")}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="add-task-btn"
                  onClick={() => handleAddClick("done")}
                >
                  <i className="fa-solid fa-plus pluse-icon"></i> Add a card
                </button>
              )}
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default TaskList;