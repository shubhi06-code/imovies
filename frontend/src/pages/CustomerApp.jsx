import React, { useState } from 'react';
import MovieCatalog from '../components/User/MovieCatalog';
import BookingHistory from '../components/User/BookingHistory';
import WatchlistAndReviews from '../components/User/WatchlistAndReviews';

export default function CustomerApp() {
  const [activeTab, setActiveTab] = useState('browse');

  return (
    <div>
      {/* Customer Top Navigation Tabs */}
      <div
        className="glass-panel" 
        style={{ 
          display: 'flex', 
          gap: '12px', 
          padding: '8px', 
          marginBottom: '25px', 
          backgroundColor: '#ffffff',
          borderRadius: '16px' 
        }}
      >
        <button 
          onClick={() => setActiveTab('browse')} 
          style={navTabStyle(activeTab === 'browse')}
        >
          🎬 Browse Movies
        </button>
        <button 
          onClick={() => setActiveTab('bookings')} 
          style={navTabStyle(activeTab === 'bookings')}
        >
          🎟️ My Bookings
        </button>
        <button 
          onClick={() => setActiveTab('watchlist')} 
          style={navTabStyle(activeTab === 'watchlist')}
        >
          ⭐ Watchlist & Reviews
        </button>
      </div>

      {/* Dynamic Content Views */}
      {activeTab === 'browse' && (
        <MovieCatalog onBookingSuccess={() => setActiveTab('bookings')} />
      )}
      {activeTab === 'bookings' && <BookingHistory />}
      {activeTab === 'watchlist' && <WatchlistAndReviews />}
    </div>
  );
}

const navTabStyle = (isActive) => ({
  flex: 1,
  padding: '12px 18px',
  backgroundColor: isActive ? '#fecdd3' : 'transparent',
  color: isActive ? '#e11d48' : '#64748b',
  border: 'none',
  borderRadius: '12px',
  fontWeight: isActive ? '700' : '600',
  fontSize: '0.92rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
});