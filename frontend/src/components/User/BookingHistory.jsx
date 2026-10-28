import React, { useState, useEffect } from 'react';
import API from '../../api';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings/my-bookings');
      if (res.data && Array.isArray(res.data)) {
        setBookings(res.data);
      }
    } catch (err) {
      console.warn('API booking fetch failed. Using local storage fallback.', err);
      
      const localBookings = JSON.parse(localStorage.getItem('imovies_bookings') || '[]');
      
      if (localBookings.length > 0) {
        setBookings(localBookings);
      } else {
        setBookings([
          {
            _id: 'BK-849201',
            movieTitle: 'Interstellar',
            theater: 'PVR: Xperia Mall, Bhopal',
            showTime: '07:15 PM',
            seats: ['A4', 'A5'],
            totalAmount: 760,
            status: 'Confirmed',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=IMOVIES-BK-849201'
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    const interval = setInterval(() => {
      fetchBookings();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        <p>Loading your tickets...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '10px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ fontSize: '1.7rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            🎟️ My Tickets & Passes
          </h2>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: '#64748b', backgroundColor: '#ffffff' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎬</div>
          <h3 style={{ color: '#0f172a', marginBottom: '5px' }}>No active bookings found</h3>
          <p style={{ fontSize: '0.9rem' }}>Browse the movie catalog and complete a checkout to see your digital pass here!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {bookings.map((b, idx) => {
            const title = b.movieTitle || (typeof b.movie === 'object' ? b.movie?.title : b.movie) || 'Movie Booking';
            const theaterName = b.theater || (typeof b.show === 'object' ? b.show?.theater : 'Cinema Hall');
            const timeSlot = b.showTime || (typeof b.show === 'object' ? b.show?.time : 'Standard Show');
            const formattedSeats = Array.isArray(b.seats) ? b.seats.join(', ') : (b.seats || 'Assigned');
            const bookingId = b._id || `BK-${idx + 1000}`;

            return (
              <div 
                key={bookingId} 
                className="glass-panel" 
                style={{ 
                  position: 'relative', overflow: 'hidden', padding: '24px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--soft-shadow)'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #fb7185, #3b82f6)' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: '700', background: '#e0f2fe', padding: '4px 10px', borderRadius: '6px' }}>
                    {bookingId}
                  </span>
                  <span style={{ backgroundColor: b.status === 'Cancelled' ? '#fee2e2' : '#dcfce7', color: b.status === 'Cancelled' ? '#dc2626' : '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                    ● {b.status || 'Confirmed'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.25rem', fontWeight: '800' }}>{title}</h3>
                    <p style={{ margin: '4px 0', fontSize: '0.88rem', color: '#475569' }}>🏛️ {theaterName}</p>
                    <p style={{ margin: '4px 0', fontSize: '0.88rem', color: '#475569' }}>🕒 {timeSlot}</p>
                    <p style={{ margin: '4px 0', fontSize: '0.88rem', color: '#475569' }}>🪑 Seats: <strong style={{ color: '#16a34a' }}>{formattedSeats}</strong></p>
                  </div>
                  
                  <div style={{ background: '#f8fafc', padding: '6px', borderRadius: '8px', height: '70px', width: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${bookingId}`} 
                      alt="Ticket QR Pass" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                  </div>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Paid</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#16a34a' }}>₹{b.totalAmount || 0}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}