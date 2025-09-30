import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/api";
import "./Timetable.css";

const Timetable = () => {
  const navigate = useNavigate();

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const [entries, setEntries] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    subject: "",
    type: "Lecture",
    room: ""
  });

  const loadEntries = async () => {
    try {
      const res = await apiService.getWeekTimetable();
      const week = res?.data?.weekTimetable || {};
      // Flatten week timetable for render below
      const flat = Object.entries(week).flatMap(([day, arr]) =>
        (arr || []).map((e) => ({ ...e, dayOfWeek: e.dayOfWeek || day }))
      );
      // Sort by day and start time
      const dayIndex = (d)=> days.indexOf(d);
      flat.sort((a,b)=> dayIndex(a.dayOfWeek)-dayIndex(b.dayOfWeek) || a.startTime.localeCompare(b.startTime));
      setEntries(flat);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load timetable");
    }
  };

  useEffect(() => { loadEntries(); }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.dayOfWeek || !formData.startTime || !formData.endTime || !formData.subject.trim()) {
      setError("Please fill in all required fields");
      return;
    }
    
    setSaving(true);
    setError("");
    try {
      await apiService.createTimetableEntry({
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
        subject: formData.subject.trim(),
        type: formData.type,
        room: formData.room.trim() || undefined
      });
      
      setFormData({
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        subject: "",
        type: "Lecture",
        room: ""
      });
      await loadEntries();
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to save timetable");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="timetable-container">
      <h2>📅 Weekly Timetable</h2>

      {error && <div className="tt-alert">{error}</div>}

      <div className="tt-form">
        <h3>Add New Class</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Day of Week *</label>
            <select 
              value={formData.dayOfWeek} 
              onChange={(e) => handleInputChange('dayOfWeek', e.target.value)}
              required
            >
              <option value="">Select day</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Start Time *</label>
            <input 
              type="time" 
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>End Time *</label>
            <input 
              type="time" 
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Subject *</label>
            <input 
              type="text" 
              placeholder="e.g., Mathematics"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Type</label>
            <select 
              value={formData.type} 
              onChange={(e) => handleInputChange('type', e.target.value)}
            >
              <option value="Lecture">Lecture</option>
              <option value="Lab">Lab</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Seminar">Seminar</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Room</label>
            <input 
              type="text" 
              placeholder="e.g., Room 101"
              value={formData.room}
              onChange={(e) => handleInputChange('room', e.target.value)}
            />
          </div>
        </div>
        
        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Adding…" : "➕ Add Class"}
        </button>
      </div>

      {/* Render saved entries */}
      <div className="timetable-entries">
        <h3>Saved Entries</h3>
        {entries.length === 0 ? (
          <div className="tt-empty">No timetable entries yet.</div>
        ) : (
          <ul className="tt-list">
            {entries.map((e) => (
              <li key={e._id} className="tt-item">
                <span className="tt-day">{e.dayOfWeek}</span>
                <span className="tt-time">{e.startTime} - {e.endTime}</span>
                <span className="tt-subject">{e.subject}</span>
                {e.room && <span className="tt-room">Room {e.room}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Timetable;
