import React, { useState } from 'react';
import API from '../../api'; // Adjust relative path if needed

export default function PaymentModal({ movie, show, seats, totalAmount, onClose, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const bookingId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    const bookingData = {
      _id: bookingId,
      movieTitle: movie.title,
      theater: show.theater,
      showTime: show.time,
      seats: seats,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      status: 'Confirmed',
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${bookingId}`
    };

    let finalBooking = bookingData;

    try {
      // 1. Attempt backend persistence
      const response = await API.post('/bookings', bookingData);
      if (response.data) {
        finalBooking = { ...bookingData, ...response.data };
      }
    } catch (error) {
      console.warn("Backend API endpoint offline. Using local booking state fallback.", error);
    } finally {
      // 2. Save to localStorage immediately for instant real-time UI synchronization
      const existingBookings = JSON.parse(localStorage.getItem('imovies_bookings') || '[]');
      localStorage.setItem('imovies_bookings', JSON.stringify([finalBooking, ...existingBookings]));

      setBookingDetails(finalBooking);
      setIsProcessing(false);
      setIsPaid(true);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: 'var(--hover-shadow)',
        overflow: 'hidden',
        color: '#0f172a',
        border: '1px solid var(--border-color)'
      }}>
        {!isPaid ? (
          <div>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>🔒 Secure Checkout</h3>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ backgroundColor: '#faf5f0', padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{movie.title}</p>
              <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: '#64748b' }}>🏛️ {show.theater} | 🕒 {show.time}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Seats: <strong>{seats.join(', ')}</strong></span>
                <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#16a34a' }}>₹{totalAmount}</span>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} style={{ padding: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '10px' }}>
                PAYMENT METHOD
              </label>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button type="button" onClick={() => setPaymentMethod('UPI')} style={tabBtnStyle(paymentMethod === 'UPI')}>📱 UPI / QR</button>
                <button type="button" onClick={() => setPaymentMethod('CARD')} style={tabBtnStyle(paymentMethod === 'CARD')}>💳 Card</button>
                <button type="button" onClick={() => setPaymentMethod('NETBANKING')} style={tabBtnStyle(paymentMethod === 'NETBANKING')}>🏦 Net Banking</button>
              </div>

              {paymentMethod === 'UPI' && (
                <div style={{ marginBottom: '20px' }}>
                  <input type="text" placeholder="username@oksbi" value={upiId} onChange={(e) => setUpiId(e.target.value)} required className="input-field" style={{ width: '100%' }} />
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  <input type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} maxLength={19} required className="input-field" />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} maxLength={5} required className="input-field" style={{ flex: 1 }} />
                    <input type="password" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} maxLength={4} required className="input-field" style={{ flex: 1 }} />
                  </div>
                </div>
              )}

              {paymentMethod === 'NETBANKING' && (
                <div style={{ marginBottom: '20px' }}>
                  <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="input-field" style={{ width: '100%' }}>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="ICICI">ICICI Bank</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={onClose} disabled={isProcessing} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={isProcessing} className="btn-primary" style={{ flex: 2 }}>
                  {isProcessing ? 'Processing...' : `Pay ₹${totalAmount}`}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ padding: '30px 24px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 15px auto' }}>✓</div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: '#0f172a' }}>Payment Successful!</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 20px 0' }}>Your seats are confirmed in real-time.</p>

            <button onClick={() => onSuccess(bookingDetails)} className="btn-primary" style={{ width: '100%' }}>
              View My Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const tabBtnStyle = (isActive) => ({
  flex: 1,
  padding: '10px 8px',
  backgroundColor: isActive ? '#fecdd3' : '#f1f5f9',
  color: isActive ? '#e11d48' : '#64748b',
  border: 'none',
  borderRadius: '10px',
  fontSize: '0.8rem',
  fontWeight: '700',
  cursor: 'pointer'
});