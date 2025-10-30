import React, { useState } from 'react';
import AttendanceForm from './AttendanceForm';
import ViewAttendance from './ViewAttendance';
import AttendanceDashboard from './AttendanceDashboard';
import './App.css';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleAttendanceAdded = () => {
    setRefresh(!refresh);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'form':
        return <AttendanceForm onAttendanceAdded={handleAttendanceAdded} />;
      case 'view':
        return <ViewAttendance key={refresh} />;
      case 'dashboard':
      default:
        return <AttendanceDashboard key={refresh} />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="nav-container">
          <div className="nav-brand">
            <h1>Attendance Employee System</h1>
            <span className="brand-subtitle"></span>
          </div>
          
          <nav className="nav-menu">
            <button 
              className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-item ${activeSection === 'form' ? 'active' : ''}`}
              onClick={() => setActiveSection('form')}
            >
              Record Attendance
            </button>
            <button 
              className={`nav-item ${activeSection === 'view' ? 'active' : ''}`}
              onClick={() => setActiveSection('view')}
            >
              View Attendance
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {renderContent()}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2025 AttendancePro Enterprise. All rights reserved.</p>
            <div className="footer-links">
              <span>Secure • Reliable • Professional</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;