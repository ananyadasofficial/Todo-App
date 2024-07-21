import React, { useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  
    localStorage.setItem("user", JSON.stringify(input));
    console.log("User data stored in localStorage", localStorage.getItem("user")); 
    navigate("/login");
  };

  return (
    <form className="login-container" onSubmit={handleSubmit}>
      <h1>Register</h1>
      <div className="login-form">
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={input.name}
          onChange={(e) =>
            setInput({ ...input, [e.target.name]: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={input.email}
          onChange={(e) =>
            setInput({ ...input, [e.target.name]: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={input.password}
          onChange={(e) =>
            setInput({ ...input, [e.target.name]: e.target.value })
          }
        />
        <button type="submit">Sign Up</button>
        <div className="signup-link">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default Register;
