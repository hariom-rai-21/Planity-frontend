import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faEye, 
  faEyeSlash, 
  faSignInAlt,
  faUserPlus,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import apiService from "../../../services/api";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      navigate("/student");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.login(formData);
      
      if (response.success) {
        // Store user data and token in localStorage
        const userData = {
          ...response.data.user,
          token: response.data.token
        };
        
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        
        if (rememberMe) {
          localStorage.setItem("rememberUser", formData.email);
        }
        
        toast.success(`Welcome back, ${response.data.user.name}!`);
        navigate("/student");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-particles"></div>
      </div>
      
      <div className="container-fluid">
        <div className="row min-vh-100">
          {/* Left Side - Branding */}
          <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center login-brand">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <FontAwesomeIcon icon={faGraduationCap} className="brand-icon mb-4" />
              <h1 className="brand-title mb-3">Study Planner</h1>
              <p className="brand-subtitle">
                Your journey to academic excellence starts here
              </p>
              <div className="brand-features">
                <div className="feature-item">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Personalized Learning
                </div>
                <div className="feature-item">
                  <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                  Track Progress
                </div>
                <div className="feature-item">
                  <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                  Achieve Goals
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Login Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="login-form-container"
            >
              <div className="login-card">
                <div className="login-header">
                  <h2 className="login-title">Welcome Back!</h2>
                  <p className="login-subtitle">Sign in to continue your learning journey</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div className="input-group">
                      <span className="input-icon">
                        <FontAwesomeIcon icon={faUser} />
                      </span>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <span className="input-icon">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>

                  <div className="form-group form-options">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="forgot-link">
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gradient btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="loading-spinner me-2"></div>
                    ) : (
                      <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                    )}
                    {loading ? "Signing In..." : "Sign In"}
                  </button>

                  <div className="divider">
                    <span>New to Study Planner?</span>
                  </div>

                  <Link to="/signup" className="btn btn-outline-primary btn-lg w-100">
                    <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                    Create Account
                  </Link>
                </form>

                <div className="login-footer">
                  <Link to="/" className="back-home">
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;