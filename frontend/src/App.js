import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { AuthPortal } from './pages/AuthPages';
import CustomerApp from './pages/CustomerApp';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function MainApp() {
  const { token, user, logout } = useContext(AuthContext);

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px 20px', backgroundColor: 'var(--bg-main)' }}>
        <AuthPortal />
      </div>
    );
  }

  // Force Admin detection based on email or stored role
  const isAdmin = 
    user?.role === 'admin' || 
    user?.isAdmin === true || 
    user?.email?.toLowerCase().includes('admin');

  return (
    <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: 'var(--bg-main)' }}>
      {/* Header */}
      <header className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto 30px auto', padding: '16px 28px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: isAdmin ? '#3b82f6' : '#fb7185' }}></div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            IMovies 
            <span style={{ 
              fontSize: '0.85rem', 
              fontWeight: '600', 
              color: isAdmin ? '#2563eb' : '#fb7185', 
              background: isAdmin ? '#dbeafe' : 'var(--accent-rose-soft)', 
              padding: '3px 10px', 
              borderRadius: '12px', 
              marginLeft: '8px' 
            }}>
              {isAdmin ? 'Admin Console' : 'Customer View'}
            </span>
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: '600' }}>
            👤 {user?.name || (isAdmin ? 'Administrator' : 'Customer')}
          </span>
          <button className="btn-primary" onClick={logout} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            Logout
          </button>
        </div>
      </header>

      {/* Renders AdminDashboard if admin, otherwise CustomerApp */}
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {isAdmin ? <AdminDashboard /> : <CustomerApp />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}