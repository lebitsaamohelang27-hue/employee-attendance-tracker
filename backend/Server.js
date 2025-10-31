const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection - RAILWAY MYSQL FOR RENDER BACKEND
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'centerbeam.proxy.rlwy.net', // Railway EXTERNAL host
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'qZRYlXAMncQqOfJlVxokNzTleJLJwaPQ', // Your Railway password
  database: process.env.DB_NAME || 'railway', // Railway database name
  port: process.env.DB_PORT || 57951, // Railway EXTERNAL port
  ssl: { rejectUnauthorized: false } // ADD THIS FOR RAILWAY SSL
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.log('❌ Database connection failed:', err.message);
    console.log('💡 Make sure:');
    console.log('   1. Railway MySQL is running');
    console.log('   2. External connection is enabled');
    console.log('   3. Environment variables are set in Render');
  } else {
    console.log('✅ Connected to Railway MySQL from Render!');
    
    // Create table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employeeName VARCHAR(255) NOT NULL,
        employeeID VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        status ENUM('Present', 'Absent') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    db.query(createTableQuery, (err) => {
      if (err) {
        console.log('❌ Error creating table:', err.message);
      } else {
        console.log('✅ Attendance table ready!');
      }
    });
  }
});

// GET all attendance records
app.get('/api/attendance', (req, res) => {
  const query = 'SELECT * FROM attendance ORDER BY date DESC, id DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json(results);
  });
});

// POST new attendance record
app.post('/api/attendance', (req, res) => {
  const { employeeName, employeeID, date, status } = req.body;
  
  // Validation
  if (!employeeName || !employeeID || !date || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (status !== 'Present' && status !== 'Absent') {
    return res.status(400).json({ error: 'Status must be Present or Absent' });
  }

  const query = 'INSERT INTO attendance (employeeName, employeeID, date, status) VALUES (?, ?, ?, ?)';
  
  db.query(query, [employeeName, employeeID, date, status], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to save attendance: ' + err.message });
    }
    res.json({ 
      message: 'Attendance recorded successfully', 
      id: results.insertId 
    });
  });
});

// DELETE attendance record
app.delete('/api/attendance/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM attendance WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete record: ' + err.message });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json({ message: 'Attendance record deleted successfully' });
  });
});

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Employee Attendance Tracker API is running!',
    database: 'Connected to Railway MySQL',
    environment: process.env.NODE_ENV || 'development',
    total_employees: 12
  });
});

// Health check route - IMPROVED
app.get('/health', (req, res) => {
  // Test database connection
  db.query('SELECT 1', (err) => {
    if (err) {
      return res.status(500).json({ 
        status: 'ERROR', 
        database: 'Disconnected',
        error: err.message,
        timestamp: new Date().toISOString()
      });
    }
    res.status(200).json({ 
      status: 'OK', 
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 API endpoints available`);
  console.log(`🗄️ Database: Railway MySQL (External)`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});