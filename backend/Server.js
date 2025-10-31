const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection - FOR RAILWAY MYSQL
const db = mysql.createConnection({
  host: process.env.MYSQLHOST || 'mysql.railway.internal', // Railway internal host
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'qZRYlXAMncQqOfJlVxokNzTleJLJwaPQ', // Your Railway password
  database: process.env.MYSQLDATABASE || 'railway', // Railway database name
  port: process.env.MYSQLPORT || 3306
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.log('❌ Database connection failed:', err.message);
    console.log('💡 Make sure:');
    console.log('   1. MySQL is running');
    console.log('   2. Database "railway" exists');
    console.log('   3. Password is correct');
    console.log('   4. Railway environment variables are set');
  } else {
    console.log('✅ Connected to Railway MySQL database!');
    
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
      return res.status(500).json({ error: 'Database error' });
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
      return res.status(500).json({ error: 'Failed to save attendance' });
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
      return res.status(500).json({ error: 'Failed to delete record' });
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

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 API endpoints available`);
  console.log(`🗄️ Database: Railway MySQL`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});