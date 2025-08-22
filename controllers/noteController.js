const Note = require('../models/Note');

// Get all notes for a user
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get favorite notes
const getFavoriteNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id, isFavorite: true }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a note
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.filename);
    }

    const note = await Note.create({
      title,
      content,
      images,
      user: req.user._id
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isFavorite } = req.body;

    const note = await Note.findOne({ _id: id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    let updateData = { title, content };
    if (isFavorite !== undefined) {
      updateData.isFavorite = isFavorite;
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);
      updateData.images = [...note.images, ...newImages];
    }

    const updatedNote = await Note.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({ _id: id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await Note.findByIdAndDelete(id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle favorite status
const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({ _id: id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.isFavorite = !note.isFavorite;
    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotes,
  getFavoriteNotes,
  createNote,
  updateNote,
  deleteNote,
  toggleFavorite
};