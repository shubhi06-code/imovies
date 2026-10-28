import React, { useState } from 'react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([
    { id: 'BK1092', user: 'Shubhi Shrivastava', movie: 'Stree 2', seats: 'A1, A2', amount: 700, status: 'Confirmed' }
  ]);

  return (
    <div>
      <h2>Seat Availability & Booking Status</h2>
      <table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#e5e7eb', textAlign: 'left' }}>
            <th style={thStyle}>Booking ID</th>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Movie</th>
            <th style={thStyle}>Seats</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{b.id}</td>
              <td style={tdStyle}>{b.user}</td>
              <td style={tdStyle}>{b.movie}</td>
              <td style={tdStyle}>{b.seats}</td>
              <td style={tdStyle}>₹{b.amount}</td>
              <td style={{ ...tdStyle, color: '#059669', fontWeight: 'bold' }}>{b.status}</td>
              <td style={tdStyle}><button onClick={() => alert('Booking refunded & seats freed')} style={btnStyle('#ef4444')}>Cancel / Refund</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const thStyle = { padding: '12px', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px' };
const btnStyle = (bg) => ({ background: bg, color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' });