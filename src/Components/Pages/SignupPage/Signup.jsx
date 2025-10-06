import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faLock, 
  faEye, 
  faEyeSlash, 
  faUserPlus,
  faSignInAlt,
  faGraduationCap,
  faSchool,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import apiService from "../../../services/api";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    class: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
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

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name can only contain letters and spaces";
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.class.trim()) {
      newErrors.class = "Class/Grade is required";
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
      const { confirmPassword, ...userData } = formData;
      const response = await apiService.register(userData);
      
      if (response.success) {
        toast.success("Account created successfully! Please sign in.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    const texts = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    return texts[passwordStrength] || "Very Weak";
  };

  const getPasswordStrengthColor = () => {
    const colors = ["#dc3545", "#fd7e14", "#ffc107", "#20c997", "#28a745"];
    return colors[passwordStrength] || "#dc3545";
  };

  return (
    <div className="signup-page">
      <div className="signup-background">
        <div className="signup-particles"></div>
      </div>
      
      <div className="container-fluid">
        <div className="row min-vh-100">
          {/* Left Side - Branding */}
          <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center signup-brand">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <FontAwesomeIcon icon={faGraduationCap} className="brand-icon mb-4" />
              <h1 className="brand-title mb-3">Join Study Planner</h1>
              <p className="brand-subtitle">
                Start your journey to academic success today
              </p>
              <div className="brand-benefits">
                <div className="benefit-item">
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  Free Forever
                </div>
                <div className="benefit-item">
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  Personalized Dashboard
                </div>
                <div className="benefit-item">
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  Smart Reminders
                </div>
                <div className="benefit-item">
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  Progress Tracking
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="signup-form-container"
            >
              <div className="signup-card">
                <div className="signup-header">
                  <h2 className="signup-title">Create Account</h2>
                  <p className="signup-subtitle">Join thousands of successful students</p>
                </div>

                <form onSubmit={handleSubmit} className="signup-form">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div className="custom-input-group">
                      <span className="input-icon">
                        <FontAwesomeIcon icon={faUser} />
                      </span>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div className="custom-input-group">
                      <span className="input-icon">
                        <FontAwesomeIcon icon={faEnvelope} />
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
                    <label className="form-label">Class/Grade</label>
                    <div className="custom-input-group">
                      <span className="input-icon">
                        <FontAwesomeIcon icon={faSchool} />
                      </span>
                      <select
                        name="class"
                        className={`form-control ${errors.class ? 'is-invalid' : ''}`}
                        value={formData.class}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="">Select your class/grade</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {errors.class && <div className="invalid-feedback">{errors.class}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password (Password must be  of 6 mix characters long)</label>
                    <div className="custom-input-group">
                      <span className="input-icon">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Create a password"
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
                    {formData.password && (
                      <div className="password-strength">
                        <div className="strength-bar">
                          <div 
                            className="strength-fill" 
                            style={{ 
                              width: `${(passwordStrength / 5) * 100}%`,
                              backgroundColor: getPasswordStrengthColor()
                            }}
                          ></div>
                        </div>
                        <span 
                          className="strength-text"
                          style={{ color: getPasswordStrengthColor() }}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                    )}
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <div className="custom-input-group">
                      <span className="input-icon">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gradient btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="loading-spinner me-2"></div>
                    ) : (
                      <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                    )}
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>

                  <div className="divider">
                    <span>Already have an account?</span>
                  </div>

                  <Link to="/login" className="btn btn-outline-primary btn-lg w-100">
                    <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                    Sign In
                  </Link>
                </form>

                <div className="signup-footer">
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

export default Signup;