const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  genre: [String],
  language: String,
  durationMinutes: Number,
  rating: { type: Number, default: 0 },
  posterUrl: String,
  releaseDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);