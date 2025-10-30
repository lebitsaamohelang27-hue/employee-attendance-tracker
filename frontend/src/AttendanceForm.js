import React, { useState } from 'react';
import axios from 'axios';

const AttendanceForm = ({ onAttendanceAdded }) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeID: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('http://localhost:5000/api/attendance', formData);
      
      setMessage({ 
        type: 'success', 
        text: `Attendance recorded successfully for ${formData.employeeName}` 
      });
      
      setFormData({
        employeeName: '',
        employeeID: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });

      onAttendanceAdded();
      
    } catch (error) {
      console.error('Error submitting attendance:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to record attendance. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-form">
      <h2>Record Attendance</h2>
      
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Employee Name</label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Employee ID</label>
          <input
            type="text"
            name="employeeID"
            value={formData.employeeID}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} disabled={loading}>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Recording...' : 'Record Attendance'}
        </button>
      </form>
    </div>
  );
};

export default AttendanceForm;