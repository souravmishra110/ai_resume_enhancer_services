const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Routes
const resumeRoutes = require('./src/routes/resumeRoutes');

// API routes
app.use('/api/resumes', resumeRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});