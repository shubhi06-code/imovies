import React, { useState, useEffect } from 'react';
import API from '../../api';
import SeatMap from '../SeatMap';
import PaymentModal from './PaymentModal'; // 1. Import the Payment Modal component

const availableTheaters = [
  { id: 1, name: 'PVR: Xperia Mall, Bhopal', location: 'Bhopal Central', shows: ['10:00 AM', '02:30 PM', '06:00 PM', '09:30 PM'] },
  { id: 2, name: 'Cinepolis: DB City Mall', location: 'MP Nagar', shows: ['11:15 AM', '03:00 PM', '07:15 PM', '10:15 PM'] },
  { id: 3, name: 'Inox: Capital Mall', location: 'Hoshangabad Road', shows: ['09:30 AM', '01:00 PM', '05:00 PM', '08:45 PM'] }
];

export default function MovieCatalog() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [minRating, setMinRating] = useState('0');

  // Booking Flow State
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPayment, setShowPayment] = useState(false); // Controls payment modal popup

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await API.get('/movies');
      setMovies(res.data);
      setFilteredMovies(res.data);
    } catch (err) {
      console.error('Error loading movies:', err);
    }
  };

  useEffect(() => {
    let result = movies;

    if (searchQuery) {
      result = result.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedGenre !== 'All') {
      result = result.filter(m => m.genres?.includes(selectedGenre) || m.genre?.includes(selectedGenre));
    }
    if (selectedLanguage !== 'All') {
      result = result.filter(m => m.languages?.includes(selectedLanguage) || m.language === selectedLanguage);
    }
    if (minRating > 0) {
      result = result.filter(m => (m.imdb?.rating || 0) >= parseFloat(minRating));
    }

    setFilteredMovies(result);
  }, [searchQuery, selectedGenre, selectedLanguage, minRating, movies]);

  const handleSeatToggle = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
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

  const calculateTotal = () => selectedSeats.reduce((sum, id) => sum + getSeatPrice(id), 0);

  return (
    <div>
      {!selectedMovie ? (
        <>
          {/* Search & Filter Bar */}
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '25px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              className="input-field"
              placeholder="🔍 Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: '1 1 200px' }}
            />
            
            <select className="input-field" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
              <option value="All">All Genres</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Horror">Horror</option>
              <option value="Thriller">Thriller</option>
            </select>

            <select className="input-field" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
              <option value="All">All Languages</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Telugu">Telugu</option>
              <option value="Tamil">Tamil</option>
            </select>

            <select className="input-field" value={minRating} onChange={(e) => setMinRating(e.target.value)}>
              <option value="0">All Ratings</option>
              <option value="7">⭐ 7.0+</option>
              <option value="8">⭐ 8.0+</option>
            </select>
          </div>

          {/* Movie Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {filteredMovies.map((movie) => (
              <div 
                key={movie._id} 
                className="glass-panel"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}
              >
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
                  padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', color: '#fbbf24', zIndex: 2
                }}>
                  ⭐ {movie.imdb?.rating || 'N/A'}
                </div>

                <img
                  src={movie.poster || movie.posterUrl}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '320px', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500'; }}
                />

                <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700' }}>{movie.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, flexGrow: 1 }}>
                    {movie.plot ? `${movie.plot.substring(0, 80)}...` : 'No plot description.'}
                  </p>

                  <button 
                    className="btn-primary" 
                    onClick={() => { setSelectedMovie(movie); setSelectedShow(null); setSelectedSeats([]); }}
                    style={{ width: '100%', marginTop: '10px' }}
                  >
                    Book Tickets
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : !selectedShow ? (
        /* Theater Selection Step */
        <div>
          <button className="btn-secondary" onClick={() => setSelectedMovie(null)} style={{ marginBottom: '20px' }}>← Back to Movies</button>
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h2>{selectedMovie.title}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{selectedMovie.plot}</p>
          </div>
          <h3 style={{ marginBottom: '15px' }}>Select Theater & Showtime</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {availableTheaters.map((t) => (
              <div key={t.id} className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{t.name}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 15px 0' }}>{t.location}</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {t.shows.map((time) => (
                    <button
                      key={time}
                      className="btn-secondary"
                      onClick={() => setSelectedShow({ theater: t.name, time })}
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
        /* Seat Selection & Payment Step */
        <div>
          <button className="btn-secondary" onClick={() => setSelectedShow(null)} style={{ marginBottom: '20px' }}>← Change Showtime</button>
          <div className="glass-panel" style={{ padding: '15px 20px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>{selectedMovie.title}</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0' }}>🏛️ {selectedShow.theater} | 🕒 {selectedShow.time}</p>
          </div>

          <SeatMap selectedSeats={selectedSeats} onSeatToggle={handleSeatToggle} />

          {selectedSeats.length > 0 && (
            <div className="glass-panel" style={{ marginTop: '20px', padding: '20px', maxWidth: '400px', margin: '20px auto', textAlign: 'center' }}>
              <h4>Booking Summary</h4>
              <p>Seats: <strong>{selectedSeats.sort().join(', ')}</strong></p>
              <p>Total: <strong style={{ color: '#10b981', fontSize: '1.2rem' }}>₹{calculateTotal()}</strong></p>
              
              {/* 2. Trigger Payment Modal Button */}
              <button
                className="btn-primary"
                onClick={() => setShowPayment(true)}
                style={{ width: '100%', marginTop: '10px' }}
              >
                Proceed to Secure Checkout
              </button>
            </div>
          )}

          {/* 3. Render the Payment Modal popup when showPayment is true */}
          {showPayment && (
            <PaymentModal
              movie={selectedMovie}
              show={selectedShow}
              seats={selectedSeats}
              totalAmount={calculateTotal()}
              onClose={() => setShowPayment(false)}
              onSuccess={() => {
                setShowPayment(false);
                setSelectedMovie(null);
                setSelectedShow(null);
                setSelectedSeats([]);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}