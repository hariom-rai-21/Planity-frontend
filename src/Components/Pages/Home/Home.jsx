import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faTasks, 
  faBell, 
  faChartLine, 
  faGraduationCap, 
  faUsers, 
  faTrophy, 
  faRocket,
  faCheckCircle,
  faArrowRight,
  faPlay
} from '@fortawesome/free-solid-svg-icons';
import "./Home_new.css";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    setIsLoggedIn(!!user);
  }, []);

  const features = [
    {
      icon: faCalendarAlt,
      title: "Smart Timetable",
      desc: "AI-powered schedule optimization that adapts to your study patterns and preferences.",
      color: "primary",
      path: "/timetable"
    },
    {
      icon: faTasks,
      title: "Task Manager",
      desc: "Organize assignments with priority levels, deadlines, and progress tracking.",
      color: "success",
      path: "/tasks"
    },
    {
      icon: faBell,
      title: "Smart Reminders",
      desc: "Never miss a deadline with intelligent notifications and custom alerts.",
      color: "warning",
      path: "/reminders"
    },
    {
      icon: faChartLine,
      title: "Progress Analytics",
      desc: "Visualize your academic journey with detailed insights and performance metrics.",
      color: "info",
      path: "/progress"
    }
  ];

  const stats = [
    { icon: faGraduationCap, number: "50K+", label: "Students" },
    { icon: faUsers, number: "500+", label: "Universities" },
    { icon: faTrophy, number: "95%", label: "Success Rate" },
    { icon: faRocket, number: "1M+", label: "Tasks Completed" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      text: "This app revolutionized my study routine. I increased my productivity by 40% in just one semester!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "Medical Student",
      text: "The smart reminders and progress tracking kept me on track during my most challenging year.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "Engineering Student",
      text: "Finally, a study planner that understands how students actually work. Game-changer!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-particles"></div>
        </div>
        <div className="container">
          <div className="row align-items-center min-vh-100 py-5">
            <div className="col-lg-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="hero-title">
                  Transform Your
                  <span className="gradient-text"> Study Journey</span>
                </h1>
                <p className="hero-subtitle">
                  The ultimate study companion that adapts to your learning style. 
                  Plan smarter, study better, achieve more.
                </p>
                <div className="hero-buttons">
                  {isLoggedIn ? (
                    <Link to="/student" className="btn btn-gradient btn-lg me-3">
                      <FontAwesomeIcon icon={faRocket} className="me-2" />
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link to="/signup" className="btn btn-gradient btn-lg me-3">
                      <FontAwesomeIcon icon={faRocket} className="me-2" />
                      Start Free Today
                    </Link>
                  )}
                  <button className="btn btn-outline-light btn-lg">
                    <FontAwesomeIcon icon={faPlay} className="me-2" />
                    Watch Demo
                  </button>
                </div>
                <div className="hero-features">
                  <div className="feature-badge">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Free Forever</span>
                  </div>
                  <div className="feature-badge">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>No Credit Card</span>
                  </div>
                  <div className="feature-badge">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Instant Setup</span>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="col-lg-6">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hero-image"
              >
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop" 
                  alt="Students studying together"
                  className="img-fluid rounded-3 shadow-lg"
                />
                <div className="floating-card card-1">
  <FontAwesomeIcon icon={faTasks} className="text-success" />
  <span className="text-black">15 Tasks Completed</span>
</div>

<div className="floating-card card-2">
  <FontAwesomeIcon icon={faChartLine} className="text-primary" />
  <span className="text-black">85% Progress</span>
</div>

<div className="floating-card card-3">
  <FontAwesomeIcon icon={faTrophy} className="text-warning" />
  <span className="text-black">Goal Achieved!</span>
</div>

              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <div className="container">
          <div className="row">
            {stats.map((stat, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="stat-card text-center"
                >
                  <FontAwesomeIcon icon={stat.icon} className="stat-icon" />
                  <h3 className="stat-number">{stat.number}</h3>
                  <p className="stat-label">{stat.label}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="section-title">Powerful Features for Success</h2>
              <p className="section-subtitle">
                Everything you need to excel in your academic journey
              </p>
            </motion.div>
          </div>
          <div className="row">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="feature-card card-modern h-100"
                >
                  <div className="feature-icon-wrapper">
                    <FontAwesomeIcon icon={feature.icon} className={`feature-icon text-${feature.color}`} />
                  </div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.desc}</p>
                  <Link to={feature.path} className="feature-link">
                    Learn More <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="section-title text-white">What Students Say</h2>
              <p className="section-subtitle text-white-50">
                Join thousands of successful students
              </p>
            </motion.div>
          </div>
          <div className="row">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-lg-4 mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="testimonial-card"
                >
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="author-avatar"
                    />
                    <div>
                      <h6 className="author-name">{testimonial.name}</h6>
                      <p className="author-role">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="cta-title">Ready to Transform Your Studies?</h3>
                <p className="cta-subtitle">
                  Join thousands of students who have already improved their academic performance
                </p>
              </motion.div>
            </div>
            <div className="col-lg-4 text-lg-end">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {isLoggedIn ? (
                  <Link to="/student" className="btn btn-gradient btn-lg">
                    <FontAwesomeIcon icon={faRocket} className="me-2" />
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link to="/signup" className="btn btn-gradient btn-lg">
                    <FontAwesomeIcon icon={faRocket} className="me-2" />
                    Get Started Now
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
