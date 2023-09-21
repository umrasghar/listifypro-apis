const Image = require('../models/Image')
const Property = require('../models/Property');

const checkPropertyImageExists = async (req, res, next) => {
    const { propertyID } = req.body;
    try {
      const existingProperty = await Property.findOne({ _id: propertyID });
      if (!existingProperty) {
        return res.status(400).json({ message: 'Property does not exist' });
      }
      //checking already existed image in the database against that propertyID
      const existingImage = await Image.find({ propertyID: propertyID })
      if (!existingImage) {
        return res.status(400).json({ message: 'Image already exists' });
      }
      next(); // Property exists, proceed to upload.single()
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = checkPropertyImageExists;