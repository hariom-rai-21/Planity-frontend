import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBook, FaTasks, FaClock, FaChartLine, FaBell, FaHome, FaBookOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './NavigationBar.css';
import logo from '../../Assets/logo2.png';

const NavigationBar = () => {
  const [user, setUser] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('loggedInUser');
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
    toast.success('👋 Successfully logged out! See you soon!');
    navigate('/');
    setExpanded(false);
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar 
      bg="primary" 
      variant="dark" 
      expand="lg" 
      fixed="top"
      className="custom-navbar shadow-sm"
      expanded={expanded}
      onToggle={(expanded) => setExpanded(expanded)}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-4 brand-logo me-auto flex items-center gap-2"
        >
          {/* Logo */}
          <img
            src={logo}
            alt="Logo"
            className="object-contain"
            style={{ width: "50px", height: "50px" }}
          />

          {/* Text block */}
          <div className="flex flex-col leading-tight">
            <h4 className="font-bold m-0">Planity</h4>
            <h5 className="text-xs font-normal m-0">Where Study Meets Harmony</h5>
          </div>
        </Navbar.Brand>

        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Center nav links */}
          <Nav className="mx-auto align-items-center">
            {user && (
              <>
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`nav-link-custom ${isActive('/') ? 'active' : ''}`}
              onClick={handleNavClick}
            >
              <FaHome className="me-1" /> Home
            </Nav.Link>
                {/* Dashboard moved to user dropdown per request */}
                
                <Nav.Link 
                  as={Link} 
                  to="/tasks" 
                  className={`nav-link-custom ${isActive('/tasks') ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <FaTasks className="me-1" /> Tasks
                </Nav.Link>
                
                {/* Timetable and Progress added back to main nav */}
                <Nav.Link 
                  as={Link} 
                  to="/timetable" 
                  className={`nav-link-custom ${isActive('/timetable') ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <FaClock className="me-1" /> Timetable
                </Nav.Link>

                 <Nav.Link 
                  as={Link} 
                  to="/reminders" 
                  className={`nav-link-custom ${isActive('/reminders') ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <FaBell className="me-2" /> Reminders
                </Nav.Link>

                 <Nav.Link 
                  as={Link} 
                  to="/study-sessions" 
                  className={`nav-link-custom ${isActive('/study-sessions') ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <FaClock className="me-2" /> Study Sessions
                </Nav.Link>

                <Nav.Link 
                  as={Link} 
                  to="/progress" 
                  className={`nav-link-custom ${isActive('/progress') ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <FaChartLine className="me-1" /> Progress
                </Nav.Link>
              </>
            )}
          </Nav>
          
          {/* Right-aligned user/auth section */}
          <Nav className="ms-auto">
            {user ? (
              <>
                {/* Mobile user actions (visible on < lg) */}
                <div className="d-lg-none w-100 mobile-user-actions">
                  <div className="d-flex align-items-center gap-2 mb-2 mobile-user-info">
                    <div className="user-avatar">
                      <FaUser />
                    </div>
                    <div className="d-flex flex-column">
                      <strong className="text-white">{user.name}</strong>
                      <small className="text-light opacity-75">{user.email}</small>
                    </div>
                  </div>
                  <Nav.Link
                    as={Link}
                    to="/student"
                    onClick={handleNavClick}
                    className="nav-link-custom w-100 text-center"
                  >
                    <FaChartLine className="me-2" /> Dashboard
                  </Nav.Link>
                  <Button
                    variant="outline-light"
                    onClick={handleLogout}
                    className="w-100 mt-2 mobile-logout-btn"
                  >
                    <FaSignOutAlt className="me-2" /> Logout
                  </Button>
                </div>

                {/* Desktop dropdown (visible on >= lg) */}
                <NavDropdown 
                title={
                  <span className="d-flex align-items-center">
                    <div className="user-avatar me-2">
                      <FaUser />
                    </div>
                    <span className="d-none d-lg-inline">{user.name}</span>
                  </span>
                } 
                id="user-dropdown"
                className="nav-dropdown-custom user-dropdown d-none d-lg-block"
                align="end"
                  renderMenuOnMount
              >
                <NavDropdown.Header className="text-center">
                  <div className="user-info">
                    <strong>{user.name}</strong>
                    <br />
                    <small className="text-muted">{user.email}</small>
                    <br />
                    <Badge bg="info" className="mt-1">{user.class}</Badge>
                  </div>
                </NavDropdown.Header>
                <NavDropdown.Divider />
                {/* Move Dashboard into the user dropdown */}
                <NavDropdown.Item 
                  as={Link} 
                  to="/student" 
                  onClick={handleNavClick}
                  className="dropdown-item-custom"
                >
                  <FaChartLine className="me-2" /> Dashboard
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item 
                  onClick={handleLogout}
                  className="dropdown-item-custom text-danger"
                >
                  <FaSignOutAlt className="me-2" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
              </>
            ) : (
              <div className="d-flex">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-light" 
                  className="me-2 auth-btn"
                  onClick={handleNavClick}
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/signup" 
                  variant="light" 
                  className="auth-btn"
                  onClick={handleNavClick}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;