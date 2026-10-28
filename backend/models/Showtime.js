const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theaterName: { type: String, required: true },
  startTime: { type: Date, required: true },
  ticketPrice: { type: Number, required: true },
  bookedSeats: [{ type: String }] // e.g., ["A1", "A2"]
}, { timestamps: true });

module.exports = mongoose.model('Showtime', showtimeSchema);