import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/Register/Register";
import TaskList from "./pages/Tasks/TaskList";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import "./App.css";

const App = () => {
  return (
    <>
      <BrowserRouter>
        {window.location.pathname === "/" ? "" : <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<TaskList />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
};

export default App;
