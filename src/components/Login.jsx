// src/components/Login.js

import React, {useState} from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if(input.email === loggedUser.email && input.password === loggedUser.password)
    {
      localStorage.setItem("loggedin",true);
      navigate("/");
    }
    else {
      alert("Wrong Email or Password");
    }
  }
  return (
    <form className="login-container" onSubmit={handleLogin}>
      <h1>Login</h1>
      <div className="login-form">
        <input type="email" placeholder="Email" name="email" value={input.email}
          onChange={(e) =>
            setInput({ ...input, [e.target.name]: e.target.value })
          } />
        <input type="password" placeholder="Password" name="password" value={input.password}
          onChange={(e) =>
            setInput({ ...input, [e.target.name]: e.target.value })
          } />
        {/* <div className="login-options">
          <section>
            <input type="checkbox" id="check" />
            <label className=" ps-2" htmlFor="check">Remember me</label>
          </section>
          <section>
            <a href="#">Forgot Password</a>
          </section>
        </div> */}
        <button type="submit">Sign In</button>
        <div className="signup-link">
          <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
        </div>
      </div>
    </form>
  );
}

export default Login;
