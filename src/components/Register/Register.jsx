import React, { useState } from "react";
import "./Register.scss";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (existingUsers.find((user) => user.email === email)) {
      toast.error("Account already exists");
      return;
    }

    const newUser = { name, email, password, role };
    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    toast.success("Registration successful");
  };
  return (
    <>
      <section className="signup">
        <div className="container">
          <div className="signup-content">
            <div className="signup-form">
              <h2 className="form-title">Sign up</h2>
              <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="label">
                    <i className="zmdi zmdi-account material-icons-name" />
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    className="input"
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your Name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="label">
                    <i className="zmdi zmdi-email" />
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    className="input"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Your Email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pass" className="label">
                    <i className="zmdi zmdi-lock" />
                  </label>
                  <input
                    type="password"
                    name="pass"
                    id="pass"
                    value={password}
                    className="input"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-pass" className="label">
                    <i className="zmdi zmdi-lock" />
                  </label>
                  <input
                    type="password"
                    name="confirm-pass"
                    id="confirm-pass"
                    placeholder="Confirm Password"
                    className="input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <select
                    className="form-select role-select"
                    onChange={(e) => setRole(e.target.value)}
                    value={role}
                    name="role"
                  >
                    <option value="role">Role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group form-button">
                  <input
                    type="submit"
                    name="signup"
                    id="signup"
                    className="form-submit"
                    value={"Register"}
                  />
                </div>
              </form>
            </div>
            <div className="signup-image">
              <figure>
                <img src="./images/signup-image.jpg" alt="sing up image" />
              </figure>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
