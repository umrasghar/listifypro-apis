const express = require('express');
const router = express.Router();
const Review = require('../../models/Review');

// CREATE: POST create a new review for a property
router.post('/', async (req, res) => {
  const { propertyID, rating, reviewText } = req.body;
  try {
    const review = new Review({ propertyID, rating, reviewText });
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ: GET all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ: GET a review by ID
router.get('/:id', getReview, (req, res) => {
  res.json(res.review);
});

// UPDATE: PUT update a review by ID
router.put('/:id', getReview, async (req, res) => {
  try {
    const updatedReview = await res.review.set(req.body);
    await updatedReview.save();
    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: DELETE a review by ID
router.delete('/:id', getReview, async (req, res) => {
  try {
    await res.review.remove();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to fetch a review by ID
async function getReview(req, res, next) {
  let review;
  try {
    review = await Review.findById(req.params.id);
    if (review == null) {
      return res.status(404).json({ message: 'Review not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.review = review;
  next();
}

module.exports = router;
