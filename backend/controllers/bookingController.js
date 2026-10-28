const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  const { showtimeId, seats, totalAmount } = req.body;
  
  try {
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });

    // Check for double booking
    const isAlreadyBooked = seats.some(seat => showtime.bookedSeats.includes(seat));
    if (isAlreadyBooked) {
      return res.status(400).json({ message: 'One or more selected seats are already booked.' });
    }

    // Reserve seats in Showtime
    showtime.bookedSeats.push(...seats);
    await showtime.save();

    // Create Booking record
    const booking = await Booking.create({
      user: req.user.id,
      showtime: showtimeId,
      seats,
      totalAmount,
      paymentStatus: 'completed'
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};