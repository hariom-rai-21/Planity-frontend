import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Layout Components
import NavigationBar from "./Components/Layout/NavigationBar";
import Footer from "./Components/Layout/Footer";

// Page Components
import Home from "./Components/Pages/Home/Home";
import Login from "./Components/Pages/LoginPage/Login";
import Student from "./Components/Pages/StudentPage/Student";
import TaskSchedule from "./Components/Pages/TaskSchedule/TaskSchedule";
import SubjectPage from "./Components/Pages/SubjectPage/SubjectPage";
import StudySessionTracker from "./Components/Pages/StudySessionTracker/StudySessionTracker";
import Signup from "./Components/Pages/SignupPage/Signup";

// Feature Components
import Timetable from "./Components/Features/Timetable";
import TaskManager from "./Components/Features/TaskManager";
import Reminders from "./Components/Features/Reminders";
import ProgressTracker from "./Components/Features/progressTracker";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("loggedInUser");
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Layout wrapper component
const Layout = ({ children, showNavAndFooter = true }) => {
  return (
    <div className="app-layout">
      {showNavAndFooter && <NavigationBar />}
      <main className={`main-content ${showNavAndFooter ? 'with-nav-footer' : ''}`}>
        {children}
      </main>
      {showNavAndFooter && <Footer />}
    </div>
  );
};

const App = () => {
  useEffect(() => {
    // Remove dummy user creation - let users register properly
    // This was for testing only
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <Layout>
                <Home />
              </Layout>
            } 
          />
          <Route 
            path="/login" 
            element={
              <Layout showNavAndFooter={false}>
                <Login />
              </Layout>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <Layout showNavAndFooter={false}>
                <Signup />
              </Layout>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/student" 
            element={
              <Layout>
                <ProtectedRoute>
                  <Student />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <Layout>
                <ProtectedRoute>
                  <TaskManager />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route 
            path="/timetable" 
            element={
              <Layout>
                <ProtectedRoute>
                  <Timetable />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route 
            path="/reminders" 
            element={
              <Layout>
                <ProtectedRoute>
                  <Reminders />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route 
            path="/progress" 
            element={
              <Layout>
                <ProtectedRoute>
                  <ProgressTracker />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route 
            path="/subjects" 
            element={
              <Layout>
                <ProtectedRoute>
                  <SubjectPage />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route 
            path="/study-sessions" 
            element={
              <Layout>
                <ProtectedRoute>
                  <StudySessionTracker />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route 
            path="/task-schedule" 
            element={
              <Layout>
                <ProtectedRoute>
                  <TaskSchedule />
                </ProtectedRoute>
              </Layout>
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
};

export default App;
