import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Alert, Spinner, Modal } from "react-bootstrap";
import apiService from "../../services/api";
import "./TaskManager.css";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    subject: "",
    priority: "Medium",
    dueDate: "",
    estimatedTime: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTasks();
      if (response.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error("Fetch tasks error:", error);
      setError(error.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.title || !newTask.subject || !newTask.dueDate) {
      setError("Title, Subject, and Due Date are required");
      return;
    }

    try {
      const taskData = {
        ...newTask,
        estimatedTime: newTask.estimatedTime ? parseInt(newTask.estimatedTime) : undefined
      };
      
      const response = await apiService.createTask(taskData);
      if (response.success) {
        setTasks([...tasks, response.data.task]);
        setNewTask({
          title: "",
          description: "",
          subject: "",
          priority: "Medium",
          dueDate: "",
          estimatedTime: ""
        });
        setShowModal(false);
        setError("");
      }
    } catch (error) {
      console.error("Create task error:", error);
      setError(error.message || "Failed to create task");
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    try {
      const response = await apiService.completeTask(taskId);
      if (response.success) {
        setTasks(tasks.map(task => 
          task._id === taskId 
            ? { ...task, status: 'Completed', isCompleted: true }
            : task
        ));
      }
    } catch (error) {
      console.error("Toggle task error:", error);
      setError(error.message || "Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await apiService.deleteTask(taskId);
      if (response.success) {
        setTasks(tasks.filter(task => task._id !== taskId));
      }
    } catch (error) {
      console.error("Delete task error:", error);
      setError(error.message || "Failed to delete task");
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Overdue': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading tasks...</span>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="d-inline">✅ Task Manager</h2>
            </div>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Add New Task
            </Button>
          </div>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Row>
            <Col md={8}>
              <Card>
                <Card.Header>
                  <h5>All Tasks ({tasks.length})</h5>
                </Card.Header>
                <Card.Body>
                  {tasks.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted">No tasks yet. Add your first task to get started!</p>
                    </div>
                  ) : (
                    <ListGroup variant="flush">
                      {tasks.map((task) => (
                        <ListGroup.Item key={task._id} className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className={`mb-1 ${task.isCompleted ? 'text-decoration-line-through text-muted' : ''}`}>
                                {task.title}
                              </h6>
                              <div>
                                <Badge bg={getPriorityVariant(task.priority)} className="me-1">
                                  {task.priority}
                                </Badge>
                                <Badge bg={getStatusVariant(task.status)}>
                                  {task.status}
                                </Badge>
                              </div>
                            </div>
                            
                            {task.description && (
                              <p className="mb-1 text-muted small">{task.description}</p>
                            )}
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <small className="text-muted">
                                  <strong>Subject:</strong> {task.subject} | 
                                  <strong> Due:</strong> {formatDate(task.dueDate)}
                                  {task.estimatedTime && (
                                    <span> | <strong>Est. Time:</strong> {task.estimatedTime} min</span>
                                  )}
                                </small>
                              </div>
                              
                              <div>
                                {!task.isCompleted && (
                                  <Button
                                    variant="outline-success"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => toggleTaskCompletion(task._id)}
                                  >
                                    ✓ Complete
                                  </Button>
                                )}
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => deleteTask(task._id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card>
                <Card.Header>
                  <h6>Task Statistics</h6>
                </Card.Header>
                <Card.Body>
                  <div className="mb-2">
                    <Badge bg="secondary" className="me-2">Total: {tasks.length}</Badge>
                  </div>
                  <div className="mb-2">
                    <Badge bg="success" className="me-2">
                      Completed: {tasks.filter(t => t.isCompleted).length}
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <Badge bg="info" className="me-2">
                      Pending: {tasks.filter(t => !t.isCompleted && t.status !== 'Overdue').length}
                    </Badge>
                  </div>
                  <div>
                    <Badge bg="danger">
                      Overdue: {tasks.filter(t => t.status === 'Overdue').length}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Add Task Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddTask}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Task Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={newTask.subject}
                    onChange={handleInputChange}
                    placeholder="e.g., Mathematics, Science"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                placeholder="Task description (optional)"
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Estimated Time (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    name="estimatedTime"
                    value={newTask.estimatedTime}
                    onChange={handleInputChange}
                    placeholder="60"
                    min="1"
                    max="600"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTask}>
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TaskManager;
