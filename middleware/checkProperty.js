const Image = require('../models/Image')
const Property = require('../models/Property');

const checkProperty = async (req, res, next) => {
    const { propertyID, id } = req.query;
    try {
      if (propertyID==undefined && (id==undefined)) {
        return res.status(400).json({ message: 'Must sepcify the valid propertyID or id' });
      }
      const existingProperty = await Property.findOne({ _id: propertyID });
      console.log(existingProperty);
      if (!existingProperty) {
        return res.status(400).json({ message: 'Property does not exist' });
      }
      next(); // Property exists, proceed to upload.single()
    } catch (error) {
        console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = checkProperty;