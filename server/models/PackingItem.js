const mongoose = require('mongoose');

const packingItemSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      enum: ['clothing', 'toiletries', 'documents', 'electronics', 'medicine', 'other'],
      default: 'other',
    },
    packed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PackingItem', packingItemSchema);
