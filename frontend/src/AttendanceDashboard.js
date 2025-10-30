import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/attendance');
      setAttendance(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'Present').length;
    const absent = attendance.filter(a => a.status === 'Absent').length;
    
    const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    const absenceRate = total > 0 ? ((absent / total) * 100).toFixed(1) : 0;
    
    return { total, present, absent, attendanceRate, absenceRate };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Attendance Analytics Dashboard</h2>
        <p>Real-time insights and performance metrics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Records</span>
        </div>
        <div className="stat-card present">
          <span className="stat-number">{stats.present}</span>
          <span className="stat-label">Present Employees</span>
        </div>
        <div className="stat-card absent">
          <span className="stat-number">{stats.absent}</span>
          <span className="stat-label">Absent Employees</span>
        </div>
      </div>

      <div className="dashboard-overview">
        <h3 className="overview-title">Performance Overview</h3>
        <p className="overview-description">
          Current attendance rate: <strong>{stats.attendanceRate}%</strong> • 
          Absence rate: <strong>{stats.absenceRate}%</strong> • 
          Total workforce tracked: <strong>{stats.total} employees</strong>
        </p>
      </div>
    </div>
  );
};

export default AttendanceDashboard;