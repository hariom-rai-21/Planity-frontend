import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaBook,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="custom-footer">
      <Container fluid className="footer-content">
        <Container>
          <Row className="py-5">
            {/* Company Info */}
            <Col lg={4} md={6} className="mb-4">
              <div className="footer-section">
                <h5 className="footer-title text-center">
                  <img
                    src="./src/Assets/logo2.png"
                    alt="Logo"
                    className="mx-auto object-contain"
                    style={{ width: "80px", height: "80px" }}
                  />
                </h5>

                <div className="text-center">
                  <h4 className="font-bold">
                    <span>Planity</span>
                  </h4>
                  <h5 className="text-lg">Where Study Meets Harmony</h5>
                </div>

                <p className="footer-description">
                  Empowering students to achieve academic excellence through
                  smart planning, task management, and progress tracking. Your
                  journey to success starts here.
                </p>
                <div className="social-links">
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="social-btn me-2"
                  >
                    <FaFacebook />
                  </Button>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="social-btn me-2"
                  >
                    <FaTwitter />
                  </Button>
                  <a
                    href="https://www.instagram.com/gooluukr/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline-light"
                      size="sm"
                      className="social-btn me-2"
                    >
                      <FaInstagram />
                    </Button>
                  </a>

                  <Button
                    variant="outline-light"
                    size="sm"
                    className="social-btn me-2"
                  >
                    <FaLinkedin />
                  </Button>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="social-btn"
                  >
                    <FaGithub />
                  </Button>
                </div>
              </div>
            </Col>

            {/* Quick Links */}
            <Col lg={2} md={6} className="mb-4">
              <div className="footer-section">
                <h6 className="footer-subtitle">Quick Links</h6>
                <ul className="footer-links">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/student">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/tasks">Tasks</Link>
                  </li>
                  <li>
                    <Link to="/timetable">Timetable</Link>
                  </li>
                  <li>
                    <Link to="/progress">Progress</Link>
                  </li>
                </ul>
              </div>
            </Col>

            {/* Features */}
            <Col lg={2} md={6} className="mb-4">
              <div className="footer-section">
                <h6 className="footer-subtitle">Features</h6>
                <ul className="footer-links">
                  <li>
                    <Link to="/tasks">Task Manager</Link>
                  </li>
                  <li>
                    <Link to="/reminders">Reminders</Link>
                  </li>
                  <li>
                    <Link to="/study-sessions">Study Sessions</Link>
                  </li>
                  <li>
                    <Link to="/progress">Progress Tracker</Link>
                  </li>
                  <li>
                    <Link to="/subjects">Subjects</Link>
                  </li>
                </ul>
              </div>
            </Col>

            {/* Support */}
            <Col lg={2} md={6} className="mb-4">
              <div className="footer-section">
                <h6 className="footer-subtitle">Support</h6>
                <ul className="footer-links">
                  <li>
                    <a href="#help">Help Center</a>
                  </li>
                  <li>
                    <a href="#contact">Contact Us</a>
                  </li>
                  <li>
                    <a href="#privacy">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#terms">Terms of Service</a>
                  </li>
                  <li>
                    <a href="#faq">FAQ</a>
                  </li>
                </ul>
              </div>
            </Col>

            {/* Contact Info */}
            <Col lg={2} md={6} className="mb-4">
              <div className="footer-section">
                <h6 className="footer-subtitle">Contact</h6>
                <div className="contact-info">
                  <div className="contact-item">
                    <FaEnvelope className="contact-icon" />
                    <span>info@planity.com</span>
                  </div>
                  <div className="contact-item">
                    <FaPhone className="contact-icon" />
                    <span>+91 9999999999</span>
                  </div>
                  <div className="contact-item">
                    <FaMapMarkerAlt className="contact-icon" />
                    <span>Bailey Road, Patna</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Footer Bottom */}
          <Row className="footer-bottom pt-4 mt-4">
            <Col md={6} className="text-center text-md-start">
              <p className="copyright-text">
                © {currentYear} Planity – Where Study Meets Harmony. All rights
                reserved.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <p className="made-with-love">
                Made with <FaHeart className="heart-icon" /> by @Hariom & @Praveer
              </p>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Decorative Wave */}
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
