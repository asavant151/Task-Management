import React from "react";
import "./Home.scss";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="d-flex align-items-center justify-content-center vh-100 home-section">
        <div className="text-center p-4 bg-white bg-opacity-75 rounded-lg shadow-lg">
          {/* main Title */}
          <h1 className="display-6 fw-bold">
            Welcome to Task Manager
          </h1>

          {/* Button Section */}
          <div className="mt-4 d-flex gap-3 justify-content-center">
            {/* Login Button */}
            <Link to="/login">
              <button className="btn btn-primary px-4 py-2 fs-5 rounded-pill shadow transition-all">
                Login
              </button>
            </Link>

            {/* Register Button */}
            <Link to="/register">
              <button className="btn btn-success px-4 py-2 fs-5 rounded-pill shadow transition-all">
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
