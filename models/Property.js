const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyName: {
    type: String,
    required: true,
  },
  description: String,
  propertyType: String,
  location: String,
  bedrooms: Number,
  bathrooms: Number,
  squareFootage: Number,
  price: {
    type: Number,
    min: 0, // Ensure positive prices
    required: true,
  },
  amenities: [String],
  listingType: String,
  availabilityDate: Date,
  status: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateUpdated: Date,
});

propertySchema.index({ location: 'text', listingType: 1 }); // Index location and listingType for searching

module.exports = mongoose.model('Property', propertySchema);
