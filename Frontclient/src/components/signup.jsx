import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css";
import BASE_URL from "../config/config";

function Signup() {
  const [signUpData, setSignUpData] = useState({
    Name: "",
    Email: "",
    Password: "",
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Additional logic can be added if needed
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!signUpData.Name || !signUpData.Email || !signUpData.Password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/signUp`, signUpData);
      if (response.status >= 200 && response.status <= 299) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      setError("Error during sign up. Please try again.");
      toast.error("Error during sign up. Please try again.");
    }
  };

  return (
    <div className="signup">
      <ToastContainer />
      <div className="signup-container">
        <form onSubmit={handleSubmit} className="signup-form">
          <h1>Sign Up</h1>
          {error && <span className="error-message">{error}</span>}
          <div className="form-group">
            <label htmlFor="signupFullname">Full Name</label>
            <input
              type="text"
              id="signupFullname"
              placeholder="Name"
              value={signUpData.Name}
              onChange={(e) =>
                setSignUpData({ ...signUpData, Name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="name@example.com"
              value={signUpData.Email}
              onChange={(e) =>
                setSignUpData({ ...signUpData, Email: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              id="Password"
              placeholder="Password"
              value={signUpData.Password}
              onChange={(e) =>
                setSignUpData({ ...signUpData, Password: e.target.value })
              }
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>

            <p className="helper-text">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Login
              </Link>
              .
            </p>
          </div>
        </form>
        <Link to="/home" className="go-back-link">
          <button className="go-back-button">Back</button>
        </Link>
      </div>
    </div>
  );
}

export default Signup;
