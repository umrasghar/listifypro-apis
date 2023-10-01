const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');; // Use .single() for single file uploads

const Image = require('../models/Image');
const Property = require('../models/Property');

const checkPropertyImageExists = async (req, res, next) => {
 
  // Use the multer middleware to parse the request (optional)
  upload(req, res, async function (err) {
    if (err) {
      // Handle any error that occurred during file upload (if needed)
      console.error(err);
    }

    console.log('checkPropertyImageExists middleware called');

    const { propertyID } = req.body;
    console.log('propertyID: ', propertyID);

    try {
      const existingProperty = await Property.findOne({ _id: propertyID });
      if (!existingProperty) {
        return res.status(400).json({ message: 'Property does not exist' });
      }

      // Checking if an image already exists in the database against that propertyID
      const existingImage = await Image.findOne({ propertyID: propertyID });
      if (existingImage) {
        return res.status(400).json({ message: 'Image already exists' });
      }
      console.log('No image exists for this property, proceeding next()...');
     
      next(); // Property exists, and no image exists, proceed
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
};

module.exports = checkPropertyImageExists;
