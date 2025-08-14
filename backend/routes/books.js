// backend/routes/books.js
const express = require('express');
const Book = require('../models/Book');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

const router = express.Router();

// Add book
router.post('/books', auth, async (req, res) => {
  const { title, author, description, coverImage } = req.body;
  if (!title || !author || !description || !coverImage) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const book = new Book({
      title,
      author,
      description,
      coverImage,
      user: req.user.id   // <-- store user ID here
    });
    await book.save();
    res.json(await book.populate('user', 'name'));
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


// Get all books (search optional)
router.get('/books', async (req, res) => {
  try {
    let query = {};
    if (req.query.search && req.query.search.trim() !== '') {
      query.title = { $regex: req.query.search.trim(), $options: 'i' }; // case-insensitive
    }
    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name');
    res.json(books);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});
// Get single book with reviews
router.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('user', 'name')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' }
      });
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update book (owner only)
router.put('/books/:id', auth, async (req, res) => {
  const { title, author, description, coverImage } = req.body;
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    if (book.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.coverImage = coverImage || book.coverImage;
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete book (owner only)
router.delete('/books/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    if (book.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    await book.deleteOne();
    res.json({ msg: 'Book removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


// Add review
router.post('/books/:id/reviews', auth, async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
  }
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    const review = new Review({ book: req.params.id, user: req.user.id, rating, comment });
    await review.save();

    book.reviews.push(review._id);
    await book.save();

    const populatedReview = await Review.findById(review._id).populate('user', 'name');
    res.json(populatedReview);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
