import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faTasks,
  faBell,
  faChartLine,
  faUser,
  faBookOpen,
  faClock,
  faTrophy,
  faPlus,
  faCheck,
  faExclamationCircle,
  faGraduationCap,
  faArrowRight,
  faFire,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import apiService from "../../../services/api";
import "./Student.css";

const Student = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    upcomingDeadlines: 0,
    studyHours: 0,
    currentStreak: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const quickActions = useMemo(
    () => [
      {
        icon: faTasks,
        title: "Manage Tasks",
        description: "View and organize your assignments",
        color: "primary",
        path: "/tasks",
      },
      {
        icon: faCalendarAlt,
        title: "Timetable",
        description: "Plan your study schedule",
        color: "success",
        path: "/timetable",
      },
      {
        icon: faBell,
        title: "Reminders",
        description: "Check upcoming deadlines",
        color: "warning",
        path: "/reminders",
      },
      {
        icon: faChartLine,
        title: "Progress",
        description: "Track your academic performance",
        color: "info",
        path: "/progress",
      },
    ],
    []
  );
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [nextClass, setNextClass] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("loggedInUser");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;
      setLoadingData(true);
      try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);

        const [tasksRes, remindersRes, sessionsRes, timetableRes] =
          await Promise.all([
            apiService.getTasks(),
            apiService.getUpcomingReminders(168), // next 7 days
            apiService.getStudySessions({
              startDate: start.toISOString(),
              endDate: end.toISOString(),
            }),
            apiService.getWeekTimetable(),
          ]);

        const tasks = tasksRes?.data?.tasks || [];
        const reminders = remindersRes?.data?.reminders || [];
        const sessions = sessionsRes?.data?.sessions || [];
        const timetable = timetableRes?.data?.weekTimetable || {};

        const totalTasks = tasks.length;
        const completedTasks =
          tasks.filter(
            (t) =>
              (t.status || "").toLowerCase() === "completed" || t.isCompleted
          )?.length || 0;

        // Tasks due soon (7 days) and not completed
        const now = new Date();
        const in7 = new Date();
        in7.setDate(now.getDate() + 7);
        const dueSoonTasks = tasks
          .filter(
            (t) =>
              t.dueDate &&
              new Date(t.dueDate) >= now &&
              new Date(t.dueDate) <= in7 &&
              !((t.status || "").toLowerCase() === "completed" || t.isCompleted)
          )
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        setUpcomingTasks(dueSoonTasks.slice(0, 5));
        setUpcomingReminders(reminders.slice(0, 3));

        // Find next class from timetable
        const allClasses = Object.entries(timetable).flatMap(([day, classes]) =>
          (classes || []).map((c) => ({ ...c, dayOfWeek: c.dayOfWeek || day }))
        );
        const currentTime = new Date();
        const currentDay = currentTime.toLocaleDateString("en-US", {
          weekday: "long",
        });
        const currentTimeStr = currentTime.toTimeString().slice(0, 5);

        const todayClasses = allClasses
          .filter(
            (c) => c.dayOfWeek === currentDay && c.startTime > currentTimeStr
          )
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        if (todayClasses.length > 0) {
          setNextClass(todayClasses[0]);
        } else {
          // Look for tomorrow's first class
          const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          const tomorrow = days[(days.indexOf(currentDay) + 1) % 7];
          const tomorrowClasses = allClasses
            .filter((c) => c.dayOfWeek === tomorrow)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
          setNextClass(tomorrowClasses[0] || null);
        }

        // Study hours from completed sessions within last 30 days
        const totalStudyMs = sessions.reduce((sum, s) => {
          const st = s.startTime ? new Date(s.startTime) : null;
          const et = s.endTime ? new Date(s.endTime) : null;
          if (st && et && !isNaN(st) && !isNaN(et)) {
            const dur = et - st;
            if (dur > 0) return sum + dur;
          }
          return sum;
        }, 0);
        const studyHours = Math.round(totalStudyMs / (1000 * 60 * 60));

        // Streak: consecutive days with at least one session
        const daysWithStudy = new Set(
          sessions
            .filter((s) => s.startTime)
            .map((s) => new Date(s.startTime).toISOString().slice(0, 10))
        );
        let streak = 0;
        for (let i = 0; i < 30; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          if (daysWithStudy.has(key)) streak++;
          else break;
        }

        // Recent activities: latest tasks/sessions/reminders
        const taskActivities = tasks
          .slice()
          .sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt || b.dueDate) -
              new Date(a.updatedAt || a.createdAt || a.dueDate)
          )
          .slice(0, 3)
          .map((t) => ({
            action: `${
              (t.status || "").toLowerCase() === "completed" || t.isCompleted
                ? "Completed"
                : "Updated"
            } ${t.title || "Task"}`,
            time: t.dueDate
              ? `Due ${new Date(t.dueDate).toLocaleDateString()}`
              : "Recently",
            type:
              (t.status || "").toLowerCase() === "completed" || t.isCompleted
                ? "success"
                : "primary",
          }));

        const sessionActivities = sessions
          .slice()
          .sort(
            (a, b) =>
              new Date(b.endTime || b.startTime) -
              new Date(a.endTime || a.startTime)
          )
          .slice(0, 2)
          .map((s) => ({
            action: `Study session - ${s.subject || "General"}`,
            time: s.endTime
              ? new Date(s.endTime).toLocaleString()
              : new Date(s.startTime).toLocaleString(),
            type: "info",
          }));

        const reminderActivities = reminders.slice(0, 1).map((r) => ({
          action: `Reminder: ${r.title}`,
          time: r.reminderDate
            ? new Date(r.reminderDate).toLocaleString()
            : "Upcoming",
          type: "warning",
        }));

        setRecentActivities(
          [
            ...taskActivities,
            ...sessionActivities,
            ...reminderActivities,
          ].slice(0, 5)
        );

        // One-time toast per visit for the nearest upcoming reminder
        try {
          const shownKey = "dashboardReminderToastShown";
          if (!sessionStorage.getItem(shownKey) && reminders.length > 0) {
            const nextReminder = reminders
              .filter((r) => r.reminderDate)
              .sort(
                (a, b) => new Date(a.reminderDate) - new Date(b.reminderDate)
              )[0];
            if (nextReminder) {
              const due = new Date(nextReminder.reminderDate);
              const nowTs = Date.now();
              const diffMs = due - nowTs;
              if (diffMs > 0) {
                const h = Math.floor(diffMs / 3600000);
                const m = Math.floor((diffMs % 3600000) / 60000);
                toast.warn(`Upcoming: ${nextReminder.title} in ${h}h ${m}m`, {
                  autoClose: 8000,
                });
                sessionStorage.setItem(shownKey, "1");
              }
            }
          }
        } catch (e) {
          /* ignore toast errors */
        }

        setStats({
          totalTasks,
          completedTasks,
          upcomingDeadlines: (reminders?.length ?? 0) + dueSoonTasks.length,
          studyHours,
          currentStreak: streak,
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        toast.error("Failed to load your dashboard data.");
      } finally {
        setLoadingData(false);
      }
    };
    loadDashboard();
  }, [user]);

  const getPriorityColor = (priority) => {
    const p = (priority || "").toString().toLowerCase();
    switch (p) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const getCompletionPercentage = () => {
    if (stats.totalTasks === 0) return 0;
    return Math.round((stats.completedTasks / stats.totalTasks) * 100);
  };

  if (!user) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="container-fluid py-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="dashboard-header mb-4"
        >
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="dashboard-title">
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  className="me-3 text-primary"
                />
                Welcome back, {user.name}! 👋
              </h1>
              <p className="dashboard-subtitle">
                Ready to conquer your studies today? Let's make it productive!
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <div className="streak-badge">
                <FontAwesomeIcon icon={faFire} className="text-warning" />
                <span className="ms-2">{stats.currentStreak} Day Streak!</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="row mb-4">
          {[
            {
              icon: faTasks,
              title: "Total Tasks",
              value: stats.totalTasks,
              color: "primary",
              subtitle: "Assignments & Projects",
            },
            {
              icon: faCheck,
              title: "Completed",
              value: `${getCompletionPercentage()}%`,
              color: "success",
              subtitle: `${stats.completedTasks} out of ${stats.totalTasks}`,
            },
            {
              icon: faExclamationCircle,
              title: "Due Soon",
              value: stats.upcomingDeadlines,
              color: "warning",
              subtitle: "This week",
            },
            {
              icon: faClock,
              title: "Study Hours",
              value: stats.studyHours,
              color: "info",
              subtitle: "This month",
            },
          ].map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-3">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`stats-card card-modern border-${stat.color}`}
              >
                <div className="stats-icon-wrapper">
                  {/* Keep icon color or make black */}
                  <FontAwesomeIcon icon={stat.icon} className="stats-icon" />
                </div>
                <div className="stats-content">
                  <h3 className="stats-value text-black">{stat.value}</h3>
                  <p className="stats-title text-black">{stat.title}</p>
                  <small className="stats-subtitle text-black">
                    {stat.subtitle}
                  </small>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="row">
          {/* Quick Actions */}
          <div className="col-lg-8 mb-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card-modern"
            >
              <div className="card-header bg-gradient-primary text-white">
                <h4 className="mb-0">
                  <FontAwesomeIcon icon={faBullseye} className="me-2" />
                  Quick Actions
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  {quickActions.map((action, index) => (
                    <div key={index} className="col-md-6 mb-3">
                      <Link
                        to={action.path}
                        className="quick-action-card text-decoration-none"
                      >
                        <div className="d-flex align-items-center">
                          <div
                            className={`quick-action-icon bg-${action.color}`}
                          >
                            <FontAwesomeIcon icon={action.icon} />
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 text-black">{action.title}</h6>
                            <p className="mb-0 text-muted small">
                              {action.description}
                            </p>
                          </div>
                          {/* No fake badges; show nothing unless we compute real numbers */}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Upcoming Tasks */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card-modern mt-4"
            >
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <FontAwesomeIcon
                    icon={faTasks}
                    className="me-2 text-primary"
                  />
                  Upcoming Tasks
                </h4>
                <Link to="/tasks" className="btn btn-sm btn-outline-primary">
                  View All{" "}
                  <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                </Link>
              </div>
              <div className="card-body">
                {loadingData && (
                  <div className="text-center py-3 small text-muted">
                    Loading tasks…
                  </div>
                )}
                {!loadingData && upcomingTasks.length === 0 && (
                  <div className="text-center py-3 small text-muted">
                    No upcoming tasks in the next 7 days.
                  </div>
                )}
                {!loadingData &&
                  upcomingTasks.map((task) => (
                    <div
                      key={task._id || task.id}
                      className="task-item d-flex align-items-center mb-3"
                    >
                      <div
                        className={`task-priority-indicator bg-${getPriorityColor(
                          task.priority
                        )}`}
                      ></div>
                      <div className="flex-grow-1">
                        <h6
                          className={`mb-1 ${
                            (task.status || "").toLowerCase() === "completed" ||
                            task.isCompleted
                              ? "text-decoration-line-through text-muted"
                              : ""
                          }`}
                        >
                          {task.title}
                        </h6>
                        <small className="text-muted">
                          <FontAwesomeIcon icon={faBookOpen} className="me-1" />
                          {task.subject || "General"} • Due{" "}
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "N/A"}
                        </small>
                      </div>
                      {((task.status || "").toLowerCase() === "completed" ||
                        task.isCompleted) && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-success"
                        />
                      )}
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* User Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="card-modern mb-4"
            >
              <div className="card-body text-center">
                <div className="profile-avatar mb-3">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <h5 className="mb-1 text-black">{user.name}</h5>
                <p className="text-muted mb-2">{user.email}</p>
                <p className="text-muted small mb-3">
                  {user.class || "Student"}
                </p>
                <div
                  className="progress-ring"
                  style={{ ["--p"]: `${getCompletionPercentage()}%` }}
                >
                  <span className="progress-value">
                    {getCompletionPercentage()}%
                  </span>
                </div>
                <p className="small text-muted mt-2">Overall Progress</p>
              </div>
            </motion.div>

            {/* Upcoming Reminders Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="card-modern mb-4"
            >
              <div className="card-header bg-gradient-warning text-white">
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faBell} className="me-2" />
                  Upcoming Reminders
                </h5>
              </div>
              <div className="card-body">
                {upcomingReminders.length === 0 ? (
                  <div className="text-center py-2 text-muted small">
                    No upcoming reminders
                  </div>
                ) : (
                  upcomingReminders.map((reminder, index) => {
                    const due = reminder.reminderDate
                      ? new Date(reminder.reminderDate)
                      : null;
                    const timeLeft = due ? due - new Date() : 0;
                    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                    const minutes = Math.floor(
                      (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
                    );

                    return (
                      <div
                        key={reminder._id || index}
                        className="reminder-item mb-3 pb-2 border-bottom"
                      >
                        <h6 className="mb-1 text-warning">
                          <FontAwesomeIcon icon={faBell} className="me-1" />
                          {reminder.title}
                        </h6>
                        <small className="text-muted d-block">
                          {due && due.toLocaleDateString()}{" "}
                          {due &&
                            due.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                        </small>
                        {timeLeft > 0 && (
                          <small className="badge bg-warning text-dark mt-1">
                            {hours}h {minutes}m left
                          </small>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>

            {/* Next Class Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="card-modern mb-4"
            >
              <div className="card-header bg-gradient-success text-white">
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  Next Class
                </h5>
              </div>
              <div className="card-body">
                {!nextClass ? (
                  <div className="text-center py-3 text-muted small">
                    No upcoming classes today
                  </div>
                ) : (
                  <div className="next-class-info">
                    <h6 className="mb-2 text-success">
                      <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                      {nextClass.subject}
                    </h6>
                    <div className="class-details">
                      <p className="mb-1 small">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="me-1 text-muted"
                        />
                        {nextClass.dayOfWeek}
                      </p>
                      <p className="mb-1 small">
                        <FontAwesomeIcon
                          icon={faClock}
                          className="me-1 text-muted"
                        />
                        {nextClass.startTime} - {nextClass.endTime}
                      </p>
                      {nextClass.room && (
                        <p className="mb-1 small">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="me-1 text-muted"
                          />
                          {nextClass.room}
                        </p>
                      )}
                      <span className="badge bg-success mt-2">
                        {nextClass.type || "Lecture"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="card-modern"
            >
              <div className="card-header">
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faClock} className="me-2 text-info" />
                  Recent Activities
                </h5>
              </div>
              <div className="card-body">
                {recentActivities.length === 0 ? (
                  <div className="text-center py-2 text-muted small">
                    No recent activities
                  </div>
                ) : (
                  recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="activity-item d-flex align-items-start mb-3"
                    >
                      <div className={`activity-dot bg-${activity.type}`}></div>
                      <div>
                        <p className="mb-1 small text-black">{activity.action}</p>
                        <small className="text-muted">{activity.time}</small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student;
