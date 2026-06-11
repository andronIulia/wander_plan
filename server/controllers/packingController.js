const PackingItem = require('../models/PackingItem');
const Trip = require('../models/Trip');

const verifyOwnership = async (tripId, userId) => {
  const trip = await Trip.findOne({ _id: tripId, user: userId });
  return !!trip;
};

// GET /api/packing?tripId=xxx
const getItems = async (req, res) => {
  try {
    const { tripId } = req.query;
    if (!tripId) return res.status(400).json({ message: 'tripId is required' });
    const owned = await verifyOwnership(tripId, req.user._id);
    if (!owned) return res.status(404).json({ message: 'Trip not found' });
    const items = await PackingItem.find({ trip: tripId }).sort({ category: 1, createdAt: 1 });
    res.json(items);
  } catch {
    res.status(500).json({ message: 'Could not fetch packing list' });
  }
};

// POST /api/packing
const createItem = async (req, res) => {
  try {
    const { tripId, name, category } = req.body;
    const owned = await verifyOwnership(tripId, req.user._id);
    if (!owned) return res.status(404).json({ message: 'Trip not found' });
    const item = await PackingItem.create({ trip: tripId, name, category });
    res.status(201).json(item);
  } catch {
    res.status(500).json({ message: 'Could not add item' });
  }
};

// PATCH /api/packing/:id
const updateItem = async (req, res) => {
  try {
    const item = await PackingItem.findById(req.params.id).populate('trip');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised' });
    }
    const updated = await PackingItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Could not update item' });
  }
};

// DELETE /api/packing/:id
const deleteItem = async (req, res) => {
  try {
    const item = await PackingItem.findById(req.params.id).populate('trip');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised' });
    }
    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch {
    res.status(500).json({ message: 'Could not delete item' });
  }
};

module.exports = { getItems, createItem, updateItem, deleteItem };
