import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";
import {
  BsPlusCircle,
  BsPlayFill,
  BsStopFill,
  BsTrash,
  BsPencilSquare,
} from "react-icons/bs";
import "./SubjectPage.css";

const SubjectPage = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Mathematics", time: 900 },
    { id: 2, name: "Science", time: 600 },
  ]);
  const [timers, setTimers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: "", time: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };
        for (let key in updated) {
          if (updated[key].running && updated[key].remaining > 0) {
            updated[key].remaining -= 1;
          }
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleTimer = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    setTimers((prev) => {
      const current = prev[subjectId] || {
        remaining: subject.time,
        running: false,
      };
      return {
        ...prev,
        [subjectId]: {
          ...current,
          running: !current.running,
        },
      };
    });
  };

  const handleAddSubject = () => {
    const timeInSeconds = parseInt(newSubject.time) * 60;
    if (!newSubject.name || isNaN(timeInSeconds)) return;

    if (isEditing) {
      // Update
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === editId ? { ...s, name: newSubject.name, time: timeInSeconds } : s
        )
      );
      setTimers((prev) => ({
        ...prev,
        [editId]: {
          remaining: timeInSeconds,
          running: false,
        },
      }));
      setIsEditing(false);
      setEditId(null);
    } else {
      // Add
      const id = Date.now();
      setSubjects([...subjects, { id, name: newSubject.name, time: timeInSeconds }]);
      setTimers((prev) => ({
        ...prev,
        [id]: {
          remaining: timeInSeconds,
          running: false,
        },
      }));
    }

    setNewSubject({ name: "", time: "" });
    setShowModal(false);
  };

  const handleEdit = (subject) => {
    setNewSubject({ name: subject.name, time: subject.time / 60 });
    setIsEditing(true);
    setEditId(subject.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    const updatedTimers = { ...timers };
    delete updatedTimers[id];
    setTimers(updatedTimers);
  };

  return (
    <Container className="subject-page mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Subjects & Countdown Timer</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <BsPlusCircle className="me-2" />
          Add Subject
        </Button>
      </div>

      <Row>
        {subjects.map((subject) => {
          const t = timers[subject.id] || {
            remaining: subject.time,
            running: false,
          };
          return (
            <Col key={subject.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow subject-card">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title>{subject.name}</Card.Title>
                    <Card.Text>
                      Remaining Time: <strong>{formatTime(t.remaining)}</strong>
                    </Card.Text>
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant={t.running ? "danger" : "success"}
                      onClick={() => toggleTimer(subject.id)}
                    >
                      {t.running ? (
                        <>
                          <BsStopFill className="me-2" /> Stop
                        </>
                      ) : (
                        <>
                          <BsPlayFill className="me-2" /> Start
                        </>
                      )}
                    </Button>
                    <Button variant="warning" onClick={() => handleEdit(subject)}>
                      <BsPencilSquare />
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(subject.id)}>
                      <BsTrash />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setIsEditing(false);
        setNewSubject({ name: "", time: "" });
      }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Subject" : "Add New Subject"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Subject Name</Form.Label>
              <Form.Control
                type="text"
                value={newSubject.name}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time (minutes)</Form.Label>
              <Form.Control
                type="number"
                value={newSubject.time}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, time: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddSubject}>
              {isEditing ? "Update Subject" : "Add Subject"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SubjectPage;
