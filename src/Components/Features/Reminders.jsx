import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/api";
import "./Reminders.css";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await apiService.getReminders();
      setReminders(res?.data?.reminders || []);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load reminders");
    }
  };

  useEffect(() => { load(); }, []);

  const addReminder = async () => {
    if (!title.trim() || !date || !time) return;
    setSaving(true);
    setError("");
    try {
      const reminderDate = new Date(`${date}T${time}:00`);
      await apiService.createReminder({ title: title.trim(), reminderDate });
      setTitle(""); setDate(""); setTime("");
      await load();
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to add reminder");
    } finally {
      setSaving(false);
    }
  };

  const countdown = useMemo(() => {
    const now = new Date();
    return reminders.map(r => {
      const due = r.reminderDate ? new Date(r.reminderDate) : null;
      const ms = due ? due - now : null;
      let text = "";
      if (ms !== null) {
        if (ms <= 0) text = "Due now";
        else {
          const h = Math.floor(ms / (1000*60*60));
          const m = Math.floor((ms % (1000*60*60)) / (1000*60));
          text = `${h}h ${m}m left`;
        }
      }
      return { id: r._id, text };
    });
  }, [reminders]);

  return (
    <div className="reminders">
      <h2>🔔 Reminders</h2>
      {error && <div className="rm-alert">{error}</div>}
      <div className="reminder-input">
        <input
          type="text"
          placeholder="Reminder title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <button onClick={addReminder} disabled={saving}>{saving ? "Saving…" : "Add"}</button>
      </div>
      <ul className="reminder-list">
        {reminders.map((reminder, i) => {
          const cd = countdown.find(c => c.id === reminder._id)?.text || "";
          return (
            <li key={reminder._id || i} className="reminder-item">
              <div className="title">{reminder.title}</div>
              <div className="meta">{reminder.reminderDate && new Date(reminder.reminderDate).toLocaleString()} {cd && <span className="badge badge-warning">{cd}</span>}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Reminders;
