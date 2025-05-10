const express = require('express');
const mongoose = require('mongoose');
const watchRoutes = require('./routes/watchRoutes');
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Register routes
app.use('/api/watch', watchRoutes);

// Database connection
const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo-watch:27017/watchservice';
console.log('Attempting to connect to MongoDB at:', mongoUrl);  // This will show what URL is being used

mongoose.connect(mongoUrl)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Watch service running on port ${PORT}`);
});
