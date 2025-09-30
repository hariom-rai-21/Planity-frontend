import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col, Form } from "react-bootstrap";
import apiService from "../../../services/api";
import "./StudySessionTracker.css";

const StudySessionTracker = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [workDone, setWorkDone] = useState("");

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const loadSessions = async () => {
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      const res = await apiService.getStudySessions({ startDate: start.toISOString(), endDate: end.toISOString() });
      setSessions(res?.data?.sessions || []);
    } catch (e) {
      console.error("Failed to load sessions", e);
    }
  };

  useEffect(() => { loadSessions(); }, []);

  const startTimer = async () => {
    if (isRunning) return;
    if (!subject.trim()) return;
    setLoading(true);
    try {
      const startTime = new Date();
      const res = await apiService.startStudySession({ subject: subject.trim(), startTime });
      const id = res?.data?.session?._id;
      setActiveSessionId(id || null);
      setIsRunning(true);
    } catch (e) {
      console.error("Failed to start session", e);
    } finally {
      setLoading(false);
    }
  };

  const stopTimer = async () => {
    if (!isRunning) return;
    setIsRunning(false);
    try {
      const endTime = new Date();
      if (activeSessionId) {
        await apiService.endStudySession(activeSessionId, { endTime, notes: workDone.trim() || undefined });
        setActiveSessionId(null);
        await loadSessions();
      }
    } catch (e) {
      console.error("Failed to end session", e);
    }
    setTime(0);
    setWorkDone("");
    setSubject("");
  };

  const formatTime = (t) => {
    const minutes = Math.floor(t / 60).toString().padStart(2, "0");
    const seconds = (t % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // sessions are already limited to last 7 days from API
  const last7DaysSessions = sessions;

  return (
    <Container className="study-tracker mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="text-center p-4">
            <h2>Study Session Tracker</h2>
            <h3 className="my-3">{formatTime(time)}</h3>
            <Form.Control
              className="mb-2"
              type="text"
              placeholder="Subject (e.g., Math, Physics)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isRunning || loading}
            />
            <Form.Control
              type="text"
              placeholder="Notes / What did you study? (optional)"
              value={workDone}
              onChange={(e) => setWorkDone(e.target.value)}
              disabled={loading}
            />
            <Button
              className="mt-3"
              variant={isRunning ? "danger" : "success"}
              onClick={isRunning ? stopTimer : startTimer}
              disabled={loading || (!isRunning && !subject.trim())}
            >
              {isRunning ? "Stop Session" : (loading ? "Starting..." : "Start Session")}
            </Button>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h4>Session History (Last 7 Days)</h4>
          {last7DaysSessions.length === 0 ? (
            <p>No sessions recorded in the last 7 days.</p>
          ) : (
            <ul className="list-group">
              {last7DaysSessions.map((session) => {
                const start = session.startTime ? new Date(session.startTime) : null;
                const end = session.endTime ? new Date(session.endTime) : null;
                const dur = session.duration != null ? `${session.duration} min` : (end && start ? `${Math.round((end-start)/60000)} min` : "-");
                return (
                  <li className="list-group-item" key={session._id}>
                    <strong>{session.subject || 'General'}</strong>
                    <div className="small text-muted">
                      {start ? start.toLocaleString() : ''}
                      {end ? ` → ${end.toLocaleString()}` : ''}
                    </div>
                    <div><em>Duration:</em> {dur}</div>
                    {session.notes && <div><em>Notes:</em> {session.notes}</div>}
                  </li>
                );
              })}
            </ul>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StudySessionTracker;
