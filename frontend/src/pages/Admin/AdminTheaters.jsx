import React, { useState, useEffect } from 'react';
import API from '../../api'; // Fixed relative import within src/

export default function AdminTheaters() {
  const [theaters, setTheaters] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [screens, setScreens] = useState('');

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      const res = await API.get('/theaters');
      setTheaters(res.data);
    } catch (err) {
      setTheaters([
        { _id: '1', name: 'PVR: Xperia Mall', location: 'Bhopal Central', screens: 4 },
        { _id: '2', name: 'Cinepolis: DB City Mall', location: 'MP Nagar', screens: 5 }
      ]);
    }
  };

  const handleAddTheater = (e) => {
    e.preventDefault();
    alert(`Added theater: ${name}`);
    setName('');
    setLocation('');
    setScreens('');
  };

  return (
    <div>
      <h2 style={{ color: '#1e3a8a', marginBottom: '20px' }}>🏛️ Theater & Screen Management</h2>

      {/* Add Theater Form Card */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '25px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ color: '#1e3a8a', marginBottom: '15px' }}>Add New Theater</h3>
        <form onSubmit={handleAddTheater} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>Theater Name</label>
            <input 
              type="text" 
              placeholder="e.g. PVR Cinemas" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>Location / Area</label>
            <input 
              type="text" 
              placeholder="e.g. MP Nagar, Bhopal" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              required 
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>Number of Screens</label>
            <input 
              type="number" 
              placeholder="e.g. 4" 
              value={screens} 
              onChange={(e) => setScreens(e.target.value)} 
              required 
              style={inputStyle}
            />
          </div>
          <button type="submit" style={btnStyle}>Add Theater</button>
        </form>
      </div>

      {/* Theaters List */}
      <h3 style={{ color: '#1e3a8a', marginBottom: '15px' }}>Existing Theaters</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
        {theaters.map((t) => (
          <div key={t._id} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <h4 style={{ color: '#1e3a8a', margin: '0 0 8px 0', fontSize: '1.1rem' }}>{t.name}</h4>
            <p style={{ color: '#4b5563', margin: '4px 0', fontSize: '0.9rem' }}>📍 {t.location}</p>
            <p style={{ color: '#4b5563', margin: '4px 0', fontSize: '0.9rem' }}>🖥️ Screens: <strong>{t.screens}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  backgroundColor: '#f9fafb',
  color: '#1f2937',
  boxSizing: 'border-box'
};

const btnStyle = {
  backgroundColor: '#22c55e',
  color: '#ffffff',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '5px'
};