const express = require('express');
const router = express.Router();
const Property = require('../../models/Property');

// GET all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific property by ID
router.get('/:id', getProperty, (req, res) => {
  res.json(res.property);
});

// POST create a new property
router.post('/', async (req, res) => {
  const property = new Property(req.body);
  try {
    const newProperty = await property.save();
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a property by ID
router.put('/:id', getProperty, async (req, res) => {
  try {
    const updatedProperty = await res.property.set(req.body);
    await updatedProperty.save();
    res.json(updatedProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a property by ID
router.delete('/:id', getProperty, async (req, res) => {
  try {
    await res.property.remove();
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to fetch a property by ID
async function getProperty(req, res, next) {
  let property;
  try {
    property = await Property.findById(req.params.id);
    if (property == null) {
      return res.status(404).json({ message: 'Property not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.property = property;
  next();
}

module.exports = router;
