import React, { useState } from 'react';

export default function WatchlistAndReviews() {
  const [watchlist, setWatchlist] = useState([
    { id: 1, title: 'Interstellar', genre: 'Sci-Fi • Adventure', rating: '8.7', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300' },
    { id: 2, title: 'The Dark Knight', genre: 'Action • Crime', rating: '9.0', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300' }
  ]);

  const [reviews, setReviews] = useState([
    { id: 101, movie: 'Inception', comment: 'Mind-bending masterpiece! The seating and audio setup was fantastic.', rating: 5, date: '2 days ago' }
  ]);

  const [newReviewMovie, setNewReviewMovie] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [rating, setRating] = useState(5);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewMovie || !newReviewText) return;

    setReviews([
      { id: Date.now(), movie: newReviewMovie, comment: newReviewText, rating: parseInt(rating), date: 'Just now' },
      ...reviews
    ]);

    setNewReviewMovie('');
    setNewReviewText('');
  };

  const removeFromWatchlist = (id) => {
    setWatchlist(watchlist.filter((m) => m.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '35px', padding: '10px 0' }}>
      
      {/* Section 1: Watchlist */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            ⭐ My Saved Watchlist
          </h2>
          <span style={{ fontSize: '0.88rem', color: '#0284c7', fontWeight: '700', backgroundColor: '#e0f2fe', padding: '4px 12px', borderRadius: '12px' }}>
            {watchlist.length} Movies Saved
          </span>
        </div>

        {watchlist.length === 0 ? (
          <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: '#64748b', backgroundColor: '#ffffff' }}>
            <p>Your watchlist is currently empty. Save movies from the catalog view!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {watchlist.map((item) => (
              <div 
                key={item.id} 
                className="glass-panel" 
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', backgroundColor: '#ffffff', border: '1px solid var(--border-color)' }}
              >
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(6px)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800', color: '#d97706', zIndex: 2, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                  ⭐ {item.rating}
                </div>
                <img src={item.poster} alt={item.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
                  <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem', fontWeight: '800' }}>{item.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{item.genre}</p>
                  
                  <button
                    onClick={() => removeFromWatchlist(item.id)}
                    style={{ marginTop: 'auto', backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', padding: '8px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    Remove from Watchlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Write & View Reviews */}
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
          💬 Movie Reviews & Feedback
        </h2>

        {/* Review Input Card */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '25px', backgroundColor: '#ffffff', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: '#0f172a', margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: '800' }}>✍️ Write a Review</h3>
          
          <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Movie Title..."
                value={newReviewMovie}
                onChange={(e) => setNewReviewMovie(e.target.value)}
                style={{ flex: 2 }}
                required
              />
              <select className="input-field" value={rating} onChange={(e) => setRating(e.target.value)} style={{ flex: 1 }}>
                <option value="5">⭐⭐⭐⭐⭐ (5/5 Masterpiece)</option>
                <option value="4">⭐⭐⭐⭐ (4/5 Great)</option>
                <option value="3">⭐⭐⭐ (3/5 Good)</option>
                <option value="2">⭐⭐ (2/5 Average)</option>
                <option value="1">⭐ (1/5 Poor)</option>
              </select>
            </div>
            <textarea
              className="input-field"
              rows="3"
              placeholder="Share your thoughts about the movie or cinema experience..."
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>
              Post Review
            </button>
          </form>
        </div>

        {/* Published Reviews Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {reviews.map((r) => (
            <div key={r.id} className="glass-panel" style={{ padding: '20px', backgroundColor: '#ffffff', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1.05rem', fontWeight: '800' }}>{r.movie}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#d97706', fontSize: '0.85rem' }}>{'⭐'.repeat(r.rating)}</span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: '6px' }}>• {r.date}</span>
                </div>
              </div>
              <p style={{ margin: 0, color: '#334155', fontSize: '0.92rem', lineHeight: '1.5' }}>"{r.comment}"</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}