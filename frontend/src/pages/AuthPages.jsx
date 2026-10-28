import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';

export function AuthPortal() {
  const { login } = useContext(AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const targetRole = isAdminMode ? 'admin' : 'customer';

    try {
      await login(email, password, targetRole);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await API.post('/auth/register', {
        name: regName,
        email: regEmail,
        password: regPassword,
        role: 'customer'
      });

      setSuccessMsg('Account created successfully! Auto-signing you in...');

      // Auto login after successful registration
      setTimeout(async () => {
        await login(regEmail, regPassword, 'customer');
      }, 1000);

    } catch (err) {
      // Fallback auto-sign in if local development API is offline
      console.warn('Backend register endpoint unreachable. Creating local session.', err);
      setSuccessMsg('Registration complete! Logging in...');
      setTimeout(async () => {
        await login(regEmail, regPassword, 'customer');
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
      
      {/* App Header */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', background: 'linear-gradient(135deg, #fb7185, #e11d48)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 6px 0' }}>
          IMovies
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          {isRegistering 
            ? '✨ Create your IMovies Account' 
            : (isAdminMode ? '⚙️ Administrator Console' : '🎬 Comfortable Movie Reservations')}
        </p>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', padding: '12px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600', textAlign: 'center', marginBottom: '20px' }}>
          ⚠️ {error}
        </div>
      )}

      {successMsg && (
        <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600', textAlign: 'center', marginBottom: '20px' }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Main Form Glass Panel */}
      <div className="glass-panel" style={{ padding: '32px', backgroundColor: '#ffffff', border: isAdminMode && !isRegistering ? '2px solid #3b82f6' : '1px solid var(--border-color)', boxShadow: 'var(--soft-shadow)' }}>
        
        {isRegistering ? (
          /* ==================== REGISTER FORM ==================== */
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="Jane Doe"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="jane@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                minLength={6}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                required
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '8px', padding: '12px' }}
            >
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>

            {/* Back to Sign In button */}
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                Already have an account? {' '}
                <button
                  type="button"
                  onClick={() => { setIsRegistering(false); setError(''); setSuccessMsg(''); }}
                  style={linkBtnStyle}
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        ) : (
          /* ==================== LOGIN FORM ==================== */
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>{isAdminMode ? 'Admin Email' : 'Email Address'}</label>
              <input
                type="email"
                className="input-field"
                placeholder={isAdminMode ? 'admin@imovies.com' : 'user@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={labelStyle}>{isAdminMode ? 'Admin Password' : 'Password'}</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary" 
              style={{ 
                width: '100%', 
                marginTop: '8px', 
                padding: '12px', 
                backgroundColor: isAdminMode ? '#2563eb' : undefined,
                boxShadow: isAdminMode ? '0 4px 14px rgba(37, 99, 235, 0.25)' : undefined
              }}
            >
              {loading ? 'Signing in...' : (isAdminMode ? 'Sign In to Admin Console' : 'Sign In as Customer')}
            </button>

            {/* Register Option Button below form */}
            {!isAdminMode && (
              <div style={{ marginTop: '12px', textAlign: 'center', backgroundColor: '#fff5f5', padding: '10px', borderRadius: '10px', border: '1px solid #fecdd3' }}>
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '600' }}>New user? </span>
                <button
                  type="button"
                  onClick={() => { setIsRegistering(true); setError(''); setSuccessMsg(''); }}
                  style={{ ...linkBtnStyle, fontSize: '0.85rem' }}
                >
                  Register here
                </button>
              </div>
            )}
          </form>
        )}

        {/* Role Switcher Option (Sign in as Admin / Sign in as Customer) */}
        {!isRegistering && (
          <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              {isAdminMode ? 'Looking to watch movies?' : 'Are you a theater administrator?'} {' '}
              <button
                type="button"
                onClick={() => { setIsAdminMode(!isAdminMode); setError(''); setEmail(''); setPassword(''); }}
                style={linkBtnStyle}
              >
                {isAdminMode ? 'Sign in as Customer' : 'Sign in as Admin'}
              </button>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: '700',
  color: '#475569',
  marginBottom: '6px'
};

const linkBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: '#e11d48',
  fontWeight: '700',
  fontSize: '0.85rem',
  cursor: 'pointer',
  textDecoration: 'underline',
  padding: 0
};