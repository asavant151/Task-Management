import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import "./Login.scss";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [emailNotEmpty, setEmailNotEmpty] = useState(false);
  const [passwordNotEmpty, setPasswordNotEmpty] = useState(false);

  useEffect(() => {
    setEmailNotEmpty(email !== "");
  }, [email]);

  useEffect(() => {
    setPasswordNotEmpty(password !== "");
  }, [password]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User logged in:", user);
      toast.success("Login successful");
      navigate("/tasks");
    } catch (error) {
      console.error("Login error", error);
      toast.error("Invalid credentials or user not registered");
    }
  };
  return (
    <>
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-md-6 order-md-2">
              <img
                src="./images/undraw_file_sync_ot38.svg"
                alt="Image"
                className="img-fluid"
              />
            </div>
            <div className="col-md-6 contents">
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <div className="mb-4">
                    <h3>
                      Sign In to <strong>Task Manager</strong>
                    </h3>
                    <p className="mb-4">
                      Lorem ipsum dolor sit amet elit. Sapiente sit aut eos
                      consectetur adipisicing.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className={`form-group first ${
                        emailNotEmpty ? "field--not-empty" : ""
                      }`}>
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className={`form-group last mb-4 ${
                        passwordNotEmpty ? "field--not-empty" : ""
                      }`}>
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="d-flex mb-5 align-items-center">
                      <span className="caption">You Don't have any account</span>
                      <span className="ms-auto">
                        <Link to={"/register"} className="forgot-pass">
                          Register
                        </Link>
                      </span>
                    </div>
                    <button
                      type="submit"
                      className="btn text-white btn-block btn-primary w-100"
                    >
                      Login
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;