import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:5000/api/attendance');
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError('Failed to load attendance data. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, employeeName) => {
    if (window.confirm(`Are you sure you want to delete the attendance record for ${employeeName}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/attendance/${id}`);
        fetchAttendance();
      } catch (error) {
        alert('Error deleting record: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const clearFilters = () => {
    setFilterDate('');
    setSearchTerm('');
  };

  const filteredAttendance = attendance.filter(record => {
    const matchesDate = !filterDate || record.date === filterDate;
    const matchesSearch = !searchTerm || 
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeID.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDate && matchesSearch;
  });

  return (
    <div className="view-attendance">
      <div className="view-header">
        <h2>View Attendance Records</h2>
        <p>Manage and view all attendance records</p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Filter by Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label>&nbsp;</label>
          <button onClick={clearFilters} className="delete-btn" style={{background: '#6b7280'}}>
            Clear Filters
          </button>
        </div>

        <div className="filter-group">
          <label>&nbsp;</label>
          <button onClick={fetchAttendance} className="submit-btn">
            Refresh
          </button>
        </div>
      </div>

      <div className="table-container">
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading attendance data...</div>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map(record => (
                <tr key={record.id}>
                  <td>{record.employeeName}</td>
                  <td>{record.employeeID}</td>
                  <td>{record.date}</td>
                  <td>
                    <span className={`status-${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(record.id, record.employeeName)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewAttendance;