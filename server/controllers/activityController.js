const Activity = require('../models/Activity');
const Trip = require('../models/Trip');

// GET /api/activities?tripId=xxx
const getActivities = async (req, res) => {
  try {
    const { tripId } = req.query;
    if (!tripId) return res.status(400).json({ message: 'tripId query param required' });

    // Verify ownership
    const trip = await Trip.findOne({ _id: tripId, user: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const activities = await Activity.find({ trip: tripId }).sort({ day: 1, startTime: 1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch activities' });
  }
};

// POST /api/activities
const createActivity = async (req, res) => {
  try {
    const { tripId, ...rest } = req.body;
    const trip = await Trip.findOne({ _id: tripId, user: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const activity = await Activity.create({ trip: tripId, ...rest });
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: 'Could not create activity' });
  }
};

// PATCH /api/activities/:id
const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('trip');
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    if (activity.trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised' });
    }

    const updated = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Could not update activity' });
  }
};

// DELETE /api/activities/:id
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('trip');
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    if (activity.trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised' });
    }

    await activity.deleteOne();
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete activity' });
  }
};

module.exports = { getActivities, createActivity, updateActivity, deleteActivity };
