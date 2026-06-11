const { validationResult } = require('express-validator');
const Trip = require('../models/Trip');
const Activity = require('../models/Activity');

// GET /api/trips
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ startDate: 1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch trips' });
  }
};

// GET /api/trips/:id
const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch trip' });
  }
};

// POST /api/trips
const createTrip = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const trip = await Trip.create({ ...req.body, user: req.user._id });
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Could not create trip' });
  }
};

// PATCH /api/trips/:id
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Could not update trip' });
  }
};

// DELETE /api/trips/:id
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    // Cascade delete activities
    await Activity.deleteMany({ trip: trip._id });
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete trip' });
  }
};

module.exports = { getTrips, getTrip, createTrip, updateTrip, deleteTrip };
