const mongoose = require('mongoose');

// Define the watch history schema
const watchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This is a reference, even though User model is in another service
    required: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie', // This is a reference, even though Movie model is in another service
    required: true
  },
  watchedAt: {
    type: Date,
    default: Date.now
  },
  watchDuration: {
    type: Number, // in seconds
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Export the Watch model
module.exports = mongoose.model('Watch', watchSchema);