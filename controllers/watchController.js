const Watch = require('../models/Watch');
const axios = require('axios');

// Service URLs from environment variables
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service-1:3000';
const MOVIE_SERVICE_URL = process.env.MOVIE_SERVICE_URL || 'http://movie-service-1:3001';

// User service helper
const getUserDetails = async (userId) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId} details:`, error.message);
    return { name: 'Unknown User' };
  }
};

// Movie service helper
const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${MOVIE_SERVICE_URL}/api/movies/${movieId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie ${movieId} details:`, error.message);
    return { title: 'Unknown Movie' };
  }
};

// Controller to add watch history
exports.addWatchHistory = async (req, res) => {
  const { userId, movieId, watchDuration, completed } = req.body;

  if (!userId || !movieId) {
    return res.status(400).json({ error: 'userId and movieId are required.' });
  }

  try {
    // Verify user exists
    const user = await getUserDetails(userId);
    if (user.name === 'Unknown User') {
      // This is optional - you may choose to allow recording without verification
      console.warn(`Adding watch history for potentially unknown user: ${userId}`);
    }

    // Verify movie exists
    const movie = await getMovieDetails(movieId);
    if (movie.title === 'Unknown Movie') {
      // This is optional - you may choose to allow recording without verification
      console.warn(`Adding watch history for potentially unknown movie: ${movieId}`);
    }

    // Check if there's an existing record
    // let watchRecord = await Watch.findOne({ userId, movieId });
    //
    // if (watchRecord) {
    //   // Update existing record
    //   watchRecord.watchedAt = new Date();
    //   watchRecord.watchDuration = watchDuration || watchRecord.watchDuration;
    //   watchRecord.completed = completed !== undefined ? completed : watchRecord.completed;
    //
    //   await watchRecord.save();
    //   res.status(200).json({ message: 'Watch history updated successfully!', watch: watchRecord });
    // } else {
      // Create new record
      const newWatch = new Watch({
        userId,
        movieId,
        watchDuration: watchDuration || 0,
        completed: completed || false
      });

      await newWatch.save();
      res.status(201).json({ message: 'Watch history added successfully!', watch: newWatch });
    // }
  } catch (error) {
    console.error('Error adding watch history:', error);
    res.status(500).json({ error: 'Failed to add watch history.', details: error.message });
  }
};

// Controller to get a user's watch history
exports.getWatchHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    // Verify user exists (optional)
    const user = await getUserDetails(userId);
    if (user.name === 'Unknown User') {
      console.warn(`Fetching watch history for potentially unknown user: ${userId}`);
    }

    // Get basic watch history records
    const watchHistory = await Watch.find({ userId }).sort({ watchedAt: -1 });

    if (!watchHistory.length) {
      return res.status(404).json({ error: 'No watch history found for this user.' });
    }

    // Enhance with movie details
    const enhancedWatchHistory = await Promise.all(
        watchHistory.map(async (record) => {
          const movieDetails = await getMovieDetails(record.movieId);
          return {
            ...record.toObject(),
            movie: movieDetails
          };
        })
    );

    res.status(200).json(enhancedWatchHistory);
  } catch (error) {
    console.error('Error fetching watch history:', error);
    res.status(500).json({ error: 'Failed to fetch watch history.', details: error.message });
  }
};