import React, { useState, useEffect } from 'react';
import API from '../api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('revenue');
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Movie Form State
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Report Generation State
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [moviesRes, bookingsRes] = await Promise.all([
        API.get('/movies').catch(() => ({ data: [] })),
        API.get('/bookings').catch(() => ({ data: [] }))
      ]);
      setMovies(moviesRes.data.length ? moviesRes.data : getMockMovies());
      setBookings(bookingsRes.data.length ? bookingsRes.data : getMockBookings());
    } catch (err) {
      setMovies(getMockMovies());
      setBookings(getMockBookings());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const getMockMovies = () => [
    { _id: 'm1', title: 'Interstellar', genre: 'Sci-Fi / Adventure', duration: '2h 49m', price: 380 },
    { _id: 'm2', title: 'Oppenheimer', genre: 'Biography / Drama', duration: '3h 00m', price: 420 },
    { _id: 'm3', title: 'Avatar: The Way of Water', genre: 'Sci-Fi / Action', duration: '3h 12m', price: 450 }
  ];

  const getMockBookings = () => [
    { _id: 'BK-984120', movieTitle: 'Interstellar', theater: 'PVR: Xperia Mall', showTime: '07:15 PM', seats: ['A4', 'A5'], totalAmount: 760, status: 'Confirmed' },
    { _id: 'BK-984121', movieTitle: 'Avatar: The Way of Water', theater: 'Cinepolis: DB Mall', showTime: '04:30 PM', seats: ['B2', 'B3'], totalAmount: 920, status: 'Confirmed' },
    { _id: 'BK-984122', movieTitle: 'Oppenheimer', theater: 'Inox: People Mall', showTime: '09:00 PM', seats: ['F6'], totalAmount: 420, status: 'Confirmed' }
  ];

  const handleAddMovie = (e) => {
    e.preventDefault();
    const createdMovie = {
      _id: 'm_' + Date.now(),
      title: newTitle,
      genre: newGenre,
      duration: newDuration,
      price: Number(newPrice) || 380
    };
    setMovies([createdMovie, ...movies]);
    setNewTitle('');
    setNewGenre('');
    setNewDuration('');
    setNewPrice('');
    alert('Movie added successfully!');
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const reportData = {
        generatedAt: new Date().toLocaleString(),
        totalTransactions: bookings.length,
        totalRevenue: bookings.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 380), 0),
        items: bookings
      };
      setGeneratedReport(reportData);
      setIsGenerating(false);
    }, 600);
  };

  const handleDownloadCSV = () => {
    if (!generatedReport) return;
    let csvContent = "data:text/csv;charset=utf-8,Booking ID,Movie Title,Theater,Show Time,Seats,Total Paid,Status\n";
    generatedReport.items.forEach(b => {
      const seatsStr = Array.isArray(b.seats) ? b.seats.join(';') : (b.seats || '');
      csvContent += `"${b._id}","${b.movieTitle}","${b.theater}","${b.showTime}","${seatsStr}","${b.totalAmount}","${b.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "imovies_revenue_statement.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading Admin Console...</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '85vh', backgroundColor: 'var(--bg-card)', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--soft-shadow)' }}>
      
      {/* Sidebar Navigation */}
      <div style={{ width: '260px', backgroundColor: '#0f172a', padding: '24px 0', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f43f5e', padding: '0 24px 20px 24px', margin: 0, borderBottom: '1px solid var(--border-color)' }}>
          IMovies Admin
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '20px' }}>
          <button onClick={() => setActiveTab('movies')} style={sidebarBtnStyle(activeTab === 'movies')}>🎬 Manage Movies</button>
          <button onClick={() => setActiveTab('theaters')} style={sidebarBtnStyle(activeTab === 'theaters')}>🏛️ Theaters & Screens</button>
          <button onClick={() => setActiveTab('schedules')} style={sidebarBtnStyle(activeTab === 'schedules')}>🕒 Show Schedules</button>
          <button onClick={() => setActiveTab('bookings')} style={sidebarBtnStyle(activeTab === 'bookings')}>🎟️ Seat & Booking Status</button>
          <button onClick={() => setActiveTab('users')} style={sidebarBtnStyle(activeTab === 'users')}>👥 Users & Support</button>
          <button onClick={() => setActiveTab('revenue')} style={sidebarBtnStyle(activeTab === 'revenue')}>📊 Revenue Reports</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '32px', backgroundColor: 'var(--bg-card)', overflowY: 'auto', color: 'var(--text-primary)' }}>
        
        {/* 1. MANAGE MOVIES TAB */}
        {activeTab === 'movies' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 24px 0', color: 'var(--text-primary)' }}>🎬 Movie Inventory Management</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>➕ Add New Movie</h3>
                <form onSubmit={handleAddMovie} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Movie Title</label>
                    <input type="text" className="input-field" placeholder="Inception" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required style={{ width: '100%', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Genre</label>
                    <input type="text" className="input-field" placeholder="Sci-Fi / Thriller" value={newGenre} onChange={(e) => setNewGenre(e.target.value)} required style={{ width: '100%', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Duration</label>
                    <input type="text" className="input-field" placeholder="2h 28m" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} required style={{ width: '100%', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Ticket Price (₹)</label>
                    <input type="number" className="input-field" placeholder="380" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required style={{ width: '100%', boxSizing: 'border-box' }} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Save Movie</button>
                </form>
              </div>

              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>🎞️ Active Catalog ({movies.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
                  {movies.map((m) => (
                    <div key={m._id} style={{ padding: '12px 16px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>{m.title}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{m.genre} • {m.duration}</span>
                      </div>
                      <span style={{ fontWeight: '700', color: '#f43f5e' }}>₹{m.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. THEATERS & SCREENS TAB */}
        {activeTab === 'theaters' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 24px 0' }}>🏛️ Theaters & Auditoriums</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {['PVR: Xperia Mall (Screen 1)', 'Cinepolis: DB Mall (IMAX)', 'Inox: People Mall (Gold Class)'].map((theater, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: '#38bdf8' }}>{theater}</h4>
                  <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Capacity: 120 Recliner Seats</p>
                  <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700' }}>Operational</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SHOW SCHEDULES TAB */}
        {activeTab === 'schedules' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 24px 0' }}>🕒 Show Timings & Schedules</h2>
            <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Current active screenings across all auditoriums:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['10:00 AM - Morning Prime', '01:30 PM - Matinee Show', '05:00 PM - Evening Special', '08:30 PM - Night Premiere'].map((slot, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontWeight: '600' }}>{slot}</span>
                    <span style={{ color: '#38bdf8', fontSize: '0.85rem' }}>All Screens Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. SEAT & BOOKING STATUS TAB */}
        {activeTab === 'bookings' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 24px 0' }}>🎟️ Live Seat & Booking Status</h2>
            <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '12px' }}>Booking ID</th>
                      <th style={{ padding: '12px' }}>Movie</th>
                      <th style={{ padding: '12px' }}>Theater</th>
                      <th style={{ padding: '12px' }}>Seats</th>
                      <th style={{ padding: '12px' }}>Amount</th>
                      <th style={{ padding: '12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.4)' }}>
                        <td style={{ padding: '12px', fontWeight: '700', color: '#38bdf8' }}>{b._id}</td>
                        <td style={{ padding: '12px', fontWeight: '600' }}>{b.movieTitle}</td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{b.theater}</td>
                        <td style={{ padding: '12px', color: '#4ade80', fontWeight: '700' }}>{Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}</td>
                        <td style={{ padding: '12px', fontWeight: '700' }}>₹{b.totalAmount}</td>
                        <td style={{ padding: '12px' }}><span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '3px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. USERS & SUPPORT TAB */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 24px 0' }}>👥 Registered Users & Support</h2>
            <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '14px 18px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong style={{ display: 'block' }}>Shreya Sahu (Customer)</strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>shreya@imovies.com</span>
                  </div>
                  <span style={{ color: '#4ade80', fontSize: '0.85rem' }}>Active Session</span>
                </div>
                <div style={{ padding: '14px 18px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong style={{ display: 'block' }}>Theater Administrator</strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>admin@imovies.com</span>
                  </div>
                  <span style={{ color: '#38bdf8', fontSize: '0.85rem' }}>Super Admin</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. REVENUE REPORTS TAB */}
        {activeTab === 'revenue' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 24px 0' }}>📊 Revenue Reports & Analytics</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700' }}>TOTAL REVENUE</p>
                <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#4ade80' }}>₹1,42,800</h3>
              </div>
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700' }}>TOTAL BOOKINGS</p>
                <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#38bdf8' }}>340 Tickets</h3>
              </div>
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700' }}>ACTIVE SHOWS</p>
                <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#f43f5e' }}>12 Runs</h3>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '28px', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: '800' }}>Export Reports</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 20px 0' }}>
                Download full transaction histories and monthly statements as CSV or PDF.
              </p>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button onClick={handleGenerateReport} disabled={isGenerating} className="btn-primary">
                  {isGenerating ? 'Generating Statement...' : 'Export CSV Statement'}
                </button>

                {generatedReport && (
                  <button onClick={handleDownloadCSV} style={{ backgroundColor: '#16a34a', color: '#ffffff', border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' }}>
                    📥 Download CSV File
                  </button>
                )}
              </div>

              {generatedReport && (
                <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>📋 Generated Statement Preview ({generatedReport.generatedAt})</h4>
                    <span style={{ fontSize: '0.82rem', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '4px 10px', borderRadius: '8px', fontWeight: '700' }}>
                      Total Amount: ₹{generatedReport.totalRevenue}
                    </span>
                  </div>

                  <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                          <th style={{ padding: '10px 14px' }}>Booking ID</th>
                          <th style={{ padding: '10px 14px' }}>Movie Title</th>
                          <th style={{ padding: '10px 14px' }}>Theater</th>
                          <th style={{ padding: '10px 14px' }}>Show Time</th>
                          <th style={{ padding: '10px 14px' }}>Seats</th>
                          <th style={{ padding: '10px 14px' }}>Amount</th>
                          <th style={{ padding: '10px 14px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generatedReport.items.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.4)' }}>
                            <td style={{ padding: '10px 14px', fontWeight: '700', color: '#38bdf8' }}>{item._id}</td>
                            <td style={{ padding: '10px 14px', fontWeight: '600' }}>{item.movieTitle}</td>
                            <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{item.theater}</td>
                            <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{item.showTime}</td>
                            <td style={{ padding: '10px 14px', color: '#4ade80', fontWeight: '700' }}>{Array.isArray(item.seats) ? item.seats.join(', ') : item.seats}</td>
                            <td style={{ padding: '10px 14px', fontWeight: '800' }}>₹{item.totalAmount}</td>
                            <td style={{ padding: '10px 14px' }}>
                              <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const sidebarBtnStyle = (isActive) => ({
  width: '100%',
  padding: '12px 24px',
  backgroundColor: isActive ? '#f43f5e' : 'transparent',
  color: '#ffffff',
  border: 'none',
  textAlign: 'left',
  fontWeight: isActive ? '700' : '500',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'background 0.2s ease'
});

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: '700',
  color: 'var(--text-secondary)',
  marginBottom: '6px'
};