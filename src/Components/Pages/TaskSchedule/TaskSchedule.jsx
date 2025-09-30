import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./TaskSchedule.css";
import apiService from "../../../services/api";

const TaskSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiService.getTasks();
        const apiTasks = (res?.data?.tasks || []).map(t => ({
          id: t._id,
          title: t.title,
          description: t.description || "",
          date: t.dueDate ? new Date(t.dueDate) : null,
          status: t.status || (t.isCompleted ? "Completed" : "Pending"),
        }));
        setTasks(apiTasks);
      } catch (e) {
        console.error("Failed to load tasks", e);
        setError(e.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const handleTaskClick = (task) => setSelectedTask(task);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTask(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (!task.date) return false;
    return task.date.toDateString() === selectedDate.toDateString();
  });

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    try {
      await apiService.updateTask(task.id, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
      if (selectedTask && selectedTask.id === task.id) {
        setSelectedTask({ ...selectedTask, status: newStatus });
      }
    } catch (e) {
      console.error("Failed to update task", e);
      setError(e.message || "Failed to update task");
    }
  };

  return (
    <Container className="mt-5 task-schedule">
      <h2 className="text-center mb-4 fw-bold text-primary">📅 Task & Schedule Management</h2>
      <Row className="g-4">
        {/* Calendar Section */}
        <Col md={4}>
          <Card className="custom-card">
            <Card.Header className="bg-primary text-white fw-semibold">Calendar</Card.Header>
            <Card.Body className="d-flex justify-content-center">
              <Calendar onChange={handleDateChange} value={selectedDate} />
            </Card.Body>
          </Card>
        </Col>

        {/* Task List */}
        <Col md={4}>
          <Card className="custom-card">
            <Card.Header className="bg-info text-white fw-semibold">Tasks on {selectedDate.toDateString()}</Card.Header>
            <ListGroup variant="flush">
              {loading && <ListGroup.Item>Loading tasks…</ListGroup.Item>}
              {error && !loading && <ListGroup.Item className="text-danger">{error}</ListGroup.Item>}
              {!loading && !error && (
                filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <ListGroup.Item
                      key={task.id}
                      action
                      onClick={() => handleTaskClick(task)}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{task.title}</span>
                      <span
                        className={`badge rounded-pill ${
                          task.status === "Completed" ? "bg-success" : "bg-warning text-dark"
                        }`}
                      >
                        {task.status}
                      </span>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No tasks for this date.</ListGroup.Item>
                )
              )}
            </ListGroup>
          </Card>
        </Col>

        {/* Task Details */}
        <Col md={4}>
          <Card className="custom-card">
            <Card.Header className="bg-secondary text-white fw-semibold">Task Details</Card.Header>
            <Card.Body>
              {selectedTask ? (
                <>
                  <h5 className="fw-bold text-dark">{selectedTask.title}</h5>
                  <p className="text-muted">{selectedTask.description}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${
                        selectedTask.status === "Completed" ? "bg-success" : "bg-warning text-dark"
                      }`}
                    >
                      {selectedTask.status}
                    </span>
                  </p>
                  <Button
                    variant={selectedTask.status === "Completed" ? "outline-warning" : "outline-success"}
                    onClick={() => toggleTaskStatus(selectedTask)}
                  >
                    Mark as {selectedTask.status === "Completed" ? "Pending" : "Completed"}
                  </Button>
                </>
              ) : (
                <p className="text-muted">Select a task to view its details.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TaskSchedule;
