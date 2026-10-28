import React, { useState, useEffect } from 'react';
import API from '../api';

function MovieList({ onSelectMovie }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await API.get('/movies');
        setMovies(response.data);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading movies...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '40px' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Now Showing</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px', 
        marginTop: '20px' 
      }}>
        {movies.map((movie) => (
          <div 
            key={movie._id} 
            style={{ 
              background: '#fff', 
              borderRadius: '8px', 
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <img 
              src={movie.poster} 
              alt={movie.title} 
              style={{ width: '100%', height: '350px', objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
            />
            <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{movie.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', flexGrow: 1 }}>
                {movie.plot ? movie.plot.substring(0, 90) + '...' : 'No description available.'}
              </p>
              <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85srem', background: '#eee', padding: '4px 8px', borderRadius: '4px' }}>
                  ⭐ {movie.imdb?.rating || 'N/A'}
                </span>
                <button 
                  onClick={() => onSelectMovie ? onSelectMovie(movie) : alert(`Selected: ${movie.title}`)}
                  style={{ 
                    background: '#e50914', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '8px 12px', 
                    borderRadius: '4px', 
                    cursor: 'pointer' 
                  }}
                >
                  Book Seats
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieList;