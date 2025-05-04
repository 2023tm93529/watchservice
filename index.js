const express = require('express');
const mongoose = require('mongoose');
const watchRoutes = require('./routes/watchRoutes');
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Register routes
app.use('/api/watch', watchRoutes);

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/watch-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Watch service running on port ${PORT}`);
});
