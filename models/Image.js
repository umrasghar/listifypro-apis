const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  propertyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  imageName: String, // You can use URL or store binary data here
});

module.exports = mongoose.model('Image', imageSchema);
