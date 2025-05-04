const Watch = require('../models/Watch'); // Assuming Watch model is defined in models/Watch.js

// Controller to add watch history
exports.addWatchHistory = async (req, res) => {
  const { userId, movieId } = req.body;

  if (!userId || !movieId) {
    return res.status(400).json({ error: 'userId and movieId are required.' });
  }

  try {
    const newWatch = new Watch({
      userId,
      movieId
    });

    await newWatch.save();
    res.status(201).json({ message: 'Watch history added successfully!', newWatch });
  } catch (error) {
    console.error('Error adding watch history:', error);
    res.status(500).json({ error: 'Failed to add watch history.' });
  }
};

// Controller to get a user's watch history
exports.getWatchHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const watchHistory = await Watch.find({ userId })
      .populate('movieId') // Assuming this links to the Movie service
      .exec();

    if (!watchHistory.length) {
      return res.status(404).json({ error: 'No watch history found for this user.' });
    }

    res.status(200).json(watchHistory);
  } catch (error) {
    console.error('Error fetching watch history:', error);
    res.status(500).json({ error: 'Failed to fetch watch history.' });
  }
};
