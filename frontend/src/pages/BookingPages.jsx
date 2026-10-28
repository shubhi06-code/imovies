import React, { useState, useEffect } from 'react';
import API from '../api';
import SeatMap from '../components/SeatMap';

// Mock theater and showtime data mapped per movie (or fetchable from backend)
const availableTheaters = [
  {
    id: 1,
    name: 'PVR: Xperia Mall, Bhopal',
    location: 'Bhopal Central',
    shows: ['10:00 AM', '02:30 PM', '06:00 PM', '09:30 PM']
  },
  {
    id: 2,
    name: 'Cinepolis: DB City Mall',
    location: 'MP Nagar',
    shows: ['11:15 AM', '03:00 PM', '07:15 PM', '10:15 PM']
  },
  {
    id: 3,
    name: 'Inox: Capital Mall',
    location: 'Hoshangabad Road',
    shows: ['09:30 AM', '01:00 PM', '05:00 PM', '08:45 PM']
  }
];

function BookingPage() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null); // { theater, time }
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await API.get('/movies');
        setMovies(response.data);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please check your backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSeatToggle = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getSeatPrice = (seatId) => {
    const row = seatId[0];
    if (row === 'A') return 350;
    if (row === 'B' || row === 'C') return 280;
    return 180;
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => total + getSeatPrice(seatId), 0);
  };

  const handleBookingConfirm = () => {
    alert(`Successfully booked seats: ${selectedSeats.sort().join(', ')} for ${selectedMovie.title} at ${selectedShow.theater} (${selectedShow.time}) for ₹${calculateTotal()}`);
    setSelectedSeats([]);
    setSelectedShow(null);
    setSelectedMovie(null);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading available movies...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* STEP 1: MOVIE LIST */}
      {!selectedMovie ? (
        <>
          <h2 style={{ marginBottom: '20px' }}>Now Showing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {movies.map((movie) => (
              <div key={movie._id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
                <img
                  src={movie.poster || movie.posterUrl}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '320px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500';
                  }}
                />
                <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>{movie.title}</h3>
                  <p style={{ color: '#666', fontSize: '0.85rem', flexGrow: 1 }}>
                    {movie.plot ? `${movie.plot.substring(0, 80)}...` : 'No plot summary available.'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>⭐ {movie.imdb?.rating || 'N/A'}</span>
                    <button
                      onClick={() => { setSelectedMovie(movie); setSelectedShow(null); setSelectedSeats([]); }}
                      style={{ backgroundColor: '#e50914', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Select Show
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : !selectedShow ? (
        
        /* STEP 2: THEATER & SHOWTIME SELECTION */
        <div>
          <button
            onClick={() => setSelectedMovie(null)}
            style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            ← Back to Movies
          </button>
          
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h2>{selectedMovie.title}</h2>
            <p style={{ color: '#666' }}>{selectedMovie.plot}</p>
            <span style={{ fontSize: '0.9rem', background: '#e5e7eb', padding: '4px 8px', borderRadius: '4px' }}>
              ⭐ Rating: {selectedMovie.imdb?.rating || 'N/A'}
            </span>
          </div>

          <h3 style={{ marginBottom: '15px' }}>Select Theater & Showtime</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {availableTheaters.map((theater) => (
              <div key={theater.id} style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{theater.name}</h4>
                <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 15px 0' }}>{theater.location}</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {theater.shows.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedShow({ theater: theater.name, time })}
                      style={{
                        backgroundColor: '#f3f4f6',
                        color: '#1f2937',
                        border: '1px solid #d1d5db',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => { e.target.style.backgroundColor = '#e50914'; e.target.style.color = '#fff'; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = '#f3f4f6'; e.target.style.color = '#1f2937'; }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (

        /* STEP 3: SEAT MAP & CHECKOUT */
        <div>
          <button
            onClick={() => setSelectedShow(null)}
            style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            ← Change Showtime
          </button>
          
          <div style={{ background: '#fff', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0' }}>{selectedMovie.title}</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>🏛️ {selectedShow.theater} | 🕒 {selectedShow.time}</p>
            </div>
          </div>

          <SeatMap selectedSeats={selectedSeats} onSeatToggle={handleSeatToggle} />

          {selectedSeats.length > 0 && (
            <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', maxWidth: '400px', margin: '20px auto', textAlign: 'center' }}>
              <h4>Booking Summary</h4>
              <p>Selected Seats: <strong>{selectedSeats.sort().join(', ')}</strong></p>
              <p>Total Amount: <strong style={{ color: '#059669', fontSize: '1.2rem' }}>₹{calculateTotal()}</strong></p>
              <button
                onClick={handleBookingConfirm}
                style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginTop: '10px' }}
              >
                Proceed to Pay ₹{calculateTotal()}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BookingPage;