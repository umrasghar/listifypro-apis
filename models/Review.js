const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  propertyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  reviewText: String,
});

module.exports = mongoose.model('Review', reviewSchema);
