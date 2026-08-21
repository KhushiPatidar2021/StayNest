const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
    },
    rent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: [0, 'Rent cannot be negative'],
    },
    location: {
      type: String,
      required: [true, 'Location/City is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Full address is required'],
      trim: true,
    },
    roomType: {
      type: String,
      enum: ['Single', 'Double', 'Triple'],
      required: [true, 'Room type is required'],
    },
    facilities: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    availableRooms: {
      type: Number,
      required: [true, 'Number of available rooms is required'],
      default: 1,
      min: [0, 'Available rooms cannot be negative'],
    },
    genderPreference: {
      type: String,
      enum: ['Male', 'Female', 'Any'],
      default: 'Any',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Property', propertySchema);
