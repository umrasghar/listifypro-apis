const express = require('express');
const router = express.Router();
const Image = require('../../models/Image');

// POST create a new image for a property
router.post('/', async (req, res) => {
  const { propertyID, imageURL } = req.body;
  try {
    const image = new Image({ propertyID, imageURL });
    const newImage = await image.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET an image by ID
router.get('/:id', getImage, (req, res) => {
  res.json(res.image);
});

// PUT update an image by ID
router.put('/:id', getImage, async (req, res) => {
  try {
    const updatedImage = await res.image.set(req.body);
    await updatedImage.save();
    res.json(updatedImage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an image by ID
router.delete('/:id', getImage, async (req, res) => {
  try {
    await res.image.remove();
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to fetch an image by ID
async function getImage(req, res, next) {
  let image;
  try {
    image = await Image.findById(req.params.id);
    if (image == null) {
      return res.status(404).json({ message: 'Image not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.image = image;
  next();
}

module.exports = router;
