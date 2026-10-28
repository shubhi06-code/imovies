import React, { useState, useEffect } from 'react';
import API from '../../api';

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({ title: '', plot: '', rating: '', poster: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchMovies(); }, []);

  const fetchMovies = async () => {
    try {
      const res = await API.get('/movies');
      setMovies(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/movies/${editingId}`, form);
      } else {
        await API.post('/movies', form);
      }
      setForm({ title: '', plot: '', rating: '', poster: '' });
      setEditingId(null);
      fetchMovies();
    } catch (err) { alert('Error saving movie'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this movie?')) {
      await API.delete(`/movies/${id}`);
      fetchMovies();
    }
  };

  return (
    <div>
      <h2>Movie Management</h2>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'grid', gap: '10px', maxWidth: '600px' }}>
        <h3>{editingId ? 'Edit Movie' : 'Add New Movie'}</h3>
        <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required style={inputStyle} />
        <input placeholder="Plot summary" value={form.plot} onChange={e => setForm({...form, plot: e.target.value})} style={inputStyle} />
        <input placeholder="IMDb Rating (e.g. 7.5)" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} style={inputStyle} />
        <input placeholder="Poster Image URL" value={form.poster} onChange={e => setForm({...form, poster: e.target.value})} style={inputStyle} />
        <button type="submit" style={btnStyle('#22c55e')}>{editingId ? 'Update Movie' : 'Add Movie'}</button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
        {movies.map(m => (
          <div key={m._id} style={{ background: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
            <img src={m.poster || m.posterUrl} alt={m.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }} onError={e => e.target.src='https://via.placeholder.com/150'} />
            <h4 style={{ margin: '8px 0 4px 0' }}>{m.title}</h4>
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              <button onClick={() => { setForm(m); setEditingId(m._id); }} style={btnStyle('#3b82f6')}>Edit</button>
              <button onClick={() => handleDelete(m._id)} style={btnStyle('#ef4444')}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
const btnStyle = (bg) => ({ background: bg, color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' });