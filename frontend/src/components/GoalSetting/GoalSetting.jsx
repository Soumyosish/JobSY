import React, { useState, useEffect } from 'react';
import './GoalSetting.css';

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function GoalSetting() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [goals, setGoals] = useState({}); // { 'YYYY-MM-DD': { ...goalObj } }
  const days = getDaysInMonth(year, month);
  const token = localStorage.getItem('token');
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchGoals = async () => {
      const res = await fetch(`${API_BASE_URL}/api/goals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const goalsObj = {};
      data.forEach(goal => {
        goalsObj[goal.date] = { ...goal };
      });
      setGoals(goalsObj);
    };
    fetchGoals();
    // eslint-disable-next-line
  }, [token]);

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };
  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleDayClick = async (day) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const goal = goals[key] || { text: '', completed: false };
    const text = prompt('Set your goal for this day:', goal.text);
    if (text !== null) {
      const res = await fetch(`${API_BASE_URL}/api/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ date: key, text, completed: goal.completed })
      });
      const newGoal = await res.json();
      setGoals({ ...goals, [key]: newGoal });
    }
  };

  const handleToggleComplete = async (day) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (goals[key]) {
      const res = await fetch(`${API_BASE_URL}/api/goals/${goals[key]._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !goals[key].completed })
      });
      const updatedGoal = await res.json();
      setGoals({ ...goals, [key]: updatedGoal });
    }
  };

  return (
    <div className="goal-setting-container">
      <h2 className="goal-setting-title">Goal Setting</h2>
      <div className="goal-setting-calendar-nav">
        <button onClick={handlePrev}>&lt;</button>
        <span>{monthNames[month]} {year}</span>
        <button onClick={handleNext}>&gt;</button>
      </div>
      <div className="goal-setting-calendar">
        {[...Array(days)].map((_, i) => {
          const day = i + 1;
          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const goal = goals[key];
          return (
            <div
              key={day}
              className={`goal-day${goal ? (goal.completed ? ' completed' : ' has-goal') : ''}`}
              onClick={() => handleDayClick(day)}
              title={goal ? goal.text : 'Click to set goal'}
            >
              {day}
              {goal && (
                <button
                  className="goal-complete-btn"
                  onClick={e => { e.stopPropagation(); handleToggleComplete(day); }}
                  title={goal.completed ? 'Mark as incomplete' : 'Mark as completed'}
                >
                  {goal.completed ? '✓' : '○'}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="goal-setting-list">
        <div className="goal-setting-list-title">
          Goals & Reminders for {monthNames[month]}
        </div>
        <ul>
          {Object.entries(goals)
            .filter(([k, v]) => k.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`) && v.text)
            .map(([k, v]) => (
              <li key={k} className={v.completed ? 'completed' : ''}>
                <span>{k.split('-')[2]}: {v.text}</span>
                {v.completed && <span className="goal-status"> (Completed)</span>}
              </li>
            ))}
        </ul>
        {Object.entries(goals).filter(([k, v]) => k.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`) && v.text).length === 0 && (
          <div className="goal-setting-empty">No goals set for this month.</div>
        )}
      </div>
    </div>
  );
}

export default GoalSetting; 