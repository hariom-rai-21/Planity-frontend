import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../../services/api";
import "./ProgressTracker.css";

const formatDate = (d) => {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "";
  }
};

const ProgressTracker = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(0);
  const [weeklyProductivity, setWeeklyProductivity] = useState(null);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(
      (t) => (t.status || "").toLowerCase() === "completed" || t.isCompleted
    ).length;
    const pending = tasks.filter(
      (t) => !((t.status || "").toLowerCase() === "completed" || t.isCompleted)
    ).length;

    const now = new Date();
    const overdue = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      return due < now && !((t.status || "").toLowerCase() === "completed" || t.isCompleted);
    }).length;

    const in7 = new Date();
    in7.setDate(now.getDate() + 7);
    const upcoming = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      return due >= now && due <= in7 && !((t.status || "").toLowerCase() === "completed" || t.isCompleted);
    }).length;

    const completion = total ? Math.round((completed / total) * 100) : 0;

    // Top subjects by completion
    const bySubject = tasks.reduce((acc, t) => {
      const s = t.subject || "General";
      acc[s] = acc[s] || { total: 0, completed: 0 };
      acc[s].total += 1;
      if ((t.status || "").toLowerCase() === "completed" || t.isCompleted) acc[s].completed += 1;
      return acc;
    }, {});

    const subjects = Object.entries(bySubject)
      .map(([name, v]) => ({ name, pct: v.total ? Math.round((v.completed / v.total) * 100) : 0, total: v.total, completed: v.completed }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 4);

    // Upcoming list (for details)
    const upcomingList = tasks
      .filter((t) => t.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    return { total, completed, pending, overdue, upcoming, completion, subjects, upcomingList };
  }, [tasks]);

  useEffect(() => {
    const userStr = localStorage.getItem("loggedInUser");
    if (!userStr) {
      navigate("/login");
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        // Load tasks
        const tasksRes = await apiService.getTasks();
        setTasks(tasksRes?.data?.tasks || []);

        // Weekly study stats (optional)
        try {
          const ss = await apiService.getWeeklyStudyStats();
          const totalMs = (ss?.data?.stats?.totalDurationMs) || 0;
          setWeeklyStudyHours(Math.round(totalMs / (1000 * 60 * 60)));
        } catch {}

        // Weekly productivity from progress API (optional)
        try {
          const wp = await apiService.getWeeklyProgress();
          setWeeklyProductivity(wp?.data?.stats || null);
        } catch {}
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to load progress");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  return (
    <div className="progress-tracker">
     <h2 className="text-black text-2xl font-bold">
  <span role="img" aria-label="chart" className="align-middle">📈</span> Progress Tracker
</h2>


      <p>Automatic overview based on your tasks and study activity</p>

      {error && (
        <div className="pt-alert" role="alert">{error}</div>
      )}

      {/* Overall completion */}
      <div className="pt-card">
        <div className="pt-card-header">
          <span className="pt-card-title">Overall Completion</span>
          <span className="pt-card-meta">{stats.completed}/{stats.total} tasks</span>
        </div>
        <div className="progress-bar" aria-label="Overall completion">
          <div className="fill" style={{ width: `${stats.completion}%` }}></div>
        </div>
        <div className="pt-meta-row">
          <div className="pt-meta"><span className="label">Completed</span><span className="value">{stats.completed}</span></div>
          <div className="pt-meta"><span className="label">Pending</span><span className="value">{stats.pending}</span></div>
          <div className="pt-meta"><span className="label">Overdue</span><span className="value badge badge-danger">{stats.overdue}</span></div>
          <div className="pt-meta"><span className="label">Upcoming 7d</span><span className="value badge badge-warning">{stats.upcoming}</span></div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="pt-grid">
        <div className="pt-stat">
          <div className="pt-stat-value">{stats.completion}%</div>
          <div className="pt-stat-label">Completion</div>
        </div>
        <div className="pt-stat">
          <div className="pt-stat-value">{weeklyStudyHours}h</div>
          <div className="pt-stat-label">Study this week</div>
        </div>
        <div className="pt-stat">
          <div className="pt-stat-value">{stats.total}</div>
          <div className="pt-stat-label">Total tasks</div>
        </div>
        <div className="pt-stat">
          <div className="pt-stat-value">{stats.overdue}</div>
          <div className="pt-stat-label">Overdue</div>
        </div>
      </div>

      {/* Subjects performance */}
      <div className="pt-card">
        <div className="pt-card-header">
          <span className="pt-card-title">Subjects Overview</span>
        </div>
        {stats.subjects.length === 0 ? (
          <div className="pt-empty">No tasks yet. <Link to="/tasks">Create your first task</Link>.</div>
        ) : (
          <div className="pt-subjects">
            {stats.subjects.map((s) => (
              <div className="pt-subject" key={s.name}>
                <div className="pt-subject-head">
                  <span className="name">{s.name}</span>
                  <span className="pct">{s.pct}%</span>
                </div>
                <div className="progress-bar small">
                  <div className="fill" style={{ width: `${s.pct}%` }} />
                </div>
                <div className="pt-subject-meta">{s.completed}/{s.total} completed</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming tasks */}
      <div className="pt-card">
        <div className="pt-card-header">
          <span className="pt-card-title">Upcoming Tasks</span>
          <Link className="pt-link" to="/tasks">View all</Link>
        </div>
        {loading ? (
          <div className="pt-empty">Loading…</div>
        ) : stats.upcomingList.length === 0 ? (
          <div className="pt-empty">No upcoming tasks</div>
        ) : (
          <ul className="pt-list">
            {stats.upcomingList.map((t) => (
              <li key={t._id} className="pt-list-item">
                <div className="left">
                  <div className={`dot ${((t.status || '').toLowerCase() === 'completed' || t.isCompleted) ? 'done' : 'pending'}`}></div>
                </div>
                <div className="main">
                  <div className="title">{t.title}</div>
                  <div className="meta">
                    <span className="badge badge-muted">{t.subject || 'General'}</span>
                    {t.dueDate && <span className="badge badge-warning">Due {formatDate(t.dueDate)}</span>}
                    {t.priority && <span className={`badge ${String(t.priority).toLowerCase() === 'high' ? 'badge-danger' : String(t.priority).toLowerCase() === 'medium' ? 'badge-info' : 'badge-success'}`}>{t.priority}</span>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
