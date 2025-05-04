const mongoose = require('mongoose');

// Define the watch history schema
const watchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming "User" model exists in another service
    required: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie', // Assuming "Movie" model exists in the movie service
    required: true
  },
  watchedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Export the Watch model
module.exports = mongoose.model('Watch', watchSchema);
