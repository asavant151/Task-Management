import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("users"));
    
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("users");
    setUser(null);
    navigate("/login");
  };
  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <Link to={"/"} className="navbar-brand">
          Task Manager
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                <li className="nav-item me-2">
                  <span className="text-black fs-6 fw-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </li>
                <li className="nav-item me-2">
                  <button
                    onClick={handleLogout}
                    className="btn btn-link text-black text-decoration-none fs-6 fw-semibold"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link
                    to="/tasks"
                    className="text-decoration-none text-black fs-6 fw-semibold"
                  >
                    Tasks
                  </Link>
                </li>
                <li className="nav-item me-2">
                  <Link
                    to="/login"
                    className="text-decoration-none text-black fs-6 fw-semibold"
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item me-2">
                  <Link
                    to="/register"
                    className="text-decoration-none text-black fs-6 fw-semibold"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
