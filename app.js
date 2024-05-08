const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json()); // Support for JSON encoded request bodies
app.use(express.static('public')); // Serve static files from the 'public' directory

// Create a database connection pool
const pool = mysql.createPool({
    host: 'forritu1.mysql.database.azure.com',
    user: 'maxwell',
    password: 'guztiw-3Fefqu-retnyv',
    database: 'surveys',
    ssl: {
        rejectUnauthorized: true
    }
});

// Route for submitting the survey
app.post('/submit', (req, res) => {
  console.log(req.body); // Log the received data
  const { student_id, survey_num = 1, version, ...answers } = req.body;

  // Filter out empty strings, replacing them with a default value
  const values = Object.values(answers).map(answer => answer === '' ? 0 : answer);

  const columns = Object.keys(answers).join(', ');
  const placeholders = Object.keys(answers).map(() => '?').join(', ');

  const query = `INSERT INTO survey_summary (student_id, survey_num, version, ${columns}) VALUES (?, ?, ?, ${placeholders})`;
  pool.query(query, [student_id, survey_num, version, ...values], (error, results) => {
      if (error) {
          console.error('Database query error:', error);
          return res.status(500).json({ error: 'Error submitting survey', details: error.message });
      }
      res.json({ message: 'Survey submitted successfully!' });
  });
});


// Server listening on a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
