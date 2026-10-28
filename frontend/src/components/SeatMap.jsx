import React from 'react';

const rowConfig = [
  { row: 'A', name: 'VIP Lounge', price: 350, color: '#f59e0b' },
  { row: 'B', name: 'Executive', price: 280, color: '#3b82f6' },
  { row: 'C', name: 'Executive', price: 280, color: '#3b82f6' },
  { row: 'D', name: 'Normal', price: 180, color: '#6b7280' },
  { row: 'E', name: 'Normal', price: 180, color: '#6b7280' },
];

const seatsPerRow = 8;

export default function SeatMap({ bookedSeats = [], selectedSeats = [], onSeatToggle }) {
  const getSeatId = (row, num) => `${row}${num}`;

  const getSeatPrice = (seatId) => {
    const row = seatId[0];
    const tier = rowConfig.find(r => r.row === row);
    return tier ? tier.price : 180;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0', width: '100%' }}>
      
      {/* Modern Curved Screen */}
      <div style={{ width: '80%', maxWidth: '400px', marginBottom: '40px', textAlign: 'center' }}>
        <div style={{ 
          height: '8px', 
          backgroundColor: '#3b82f6', 
          borderRadius: '50%', 
          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.6)',
          margin: '0 auto 10px auto'
        }}></div>
        <span style={{ fontSize: '0.75rem', letterSpacing: '3px', color: '#9ca3af', fontWeight: 'bold' }}>ALL EYES THIS WAY — SCREEN</span>
      </div>

      {/* Seat Layout Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #e5e7eb' }}>
        {rowConfig.map(({ row, name, price }) => (
          <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            
            {/* Row Label & Tier Price */}
            <div style={{ width: '110px', textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1f2937' }}>Row {row}</div>
              <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '600' }}>{name} • ₹{price}</div>
            </div>
            
            {/* Seat Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map((num) => {
                const seatId = getSeatId(row, num);
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                let bgColor = '#f3f4f6'; // Available background
                let borderColor = '#d1d5db';
                let color = '#374151';
                let cursor = 'pointer';
                let transform = 'scale(1)';

                if (isBooked) {
                  bgColor = '#fee2e2'; // Booked light red
                  borderColor = '#fca5a5';
                  color = '#9ca3af';
                  cursor = 'not-allowed';
                } else if (isSelected) {
                  bgColor = '#22c55e'; // Selected vibrant green
                  borderColor = '#16a34a';
                  color = '#ffffff';
                  transform = 'scale(1.08)';
                }

                return (
                  <button
                    key={seatId}
                    disabled={isBooked}
                    onClick={() => onSeatToggle(seatId, getSeatPrice(seatId))}
                    title={`Row ${row} Seat ${num} (₹${price})`}
                    style={{
                      width: '38px',
                      height: '38px',
                      fontSize: '0.8rem',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      backgroundColor: bgColor,
                      color: color,
                      border: `1px solid ${borderColor}`,
                      cursor: cursor,
                      transform: transform,
                      transition: 'all 0.15s ease-in-out',
                      boxShadow: isSelected ? '0 4px 10px rgba(34, 197, 94, 0.3)' : 'none',
                    }}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modern Status Legend */}
      <div style={{ display: 'flex', gap: '25px', marginTop: '25px', fontSize: '0.85rem', background: '#fff', padding: '12px 25px', borderRadius: '30px', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '14px', height: '14px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px' }}></div> 
          <span style={{ color: '#4b5563' }}>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '14px', height: '14px', backgroundColor: '#22c55e', borderRadius: '4px' }}></div> 
          <span style={{ color: '#4b5563' }}>Selected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '14px', height: '14px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '4px' }}></div> 
          <span style={{ color: '#4b5563' }}>Booked</span>
        </div>
      </div>
    </div>
  );
}