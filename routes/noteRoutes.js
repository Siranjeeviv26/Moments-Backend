const express = require('express');
const {
  getNotes,
  getFavoriteNotes,
  createNote,
  updateNote,
  deleteNote,
  toggleFavorite
} = require('../controllers/noteController');
const auth = require('../middleware/auth');
const upload = require('../config/upload');

const router = express.Router();

router.use(auth); // Protect all note routes

router.get('/', getNotes);
router.get('/favorites', getFavoriteNotes);
router.post('/', upload.array('images', 10), createNote);
router.put('/:id', upload.array('images', 10), updateNote);
router.delete('/:id', deleteNote);
router.patch('/:id/favorite', toggleFavorite);

module.exports = router;