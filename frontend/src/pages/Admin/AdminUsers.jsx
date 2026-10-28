import React, { useState } from 'react';

export default function AdminUsers() {
  const [users] = useState([
    { id: 1, name: 'Shubhi Shrivastava', email: 'shubhi@lnct.ac.in', role: 'User' },
    { id: 2, name: 'Admin Staff', email: 'admin@imovies.com', role: 'Admin' }
  ]);

  return (
    <div>
      <h2>User Management & Support Tickets</h2>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Open Support Issues</h3>
        <p>No pending user disputes or refund requests.</p>
      </div>
      <h3>Registered Users</h3>
      <table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#e5e7eb', textAlign: 'left' }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{u.name}</td>
              <td style={tdStyle}>{u.email}</td>
              <td style={tdStyle}>{u.role}</td>
              <td style={tdStyle}><button style={btnStyle('#3b82f6')}>Modify Role</button></td>
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