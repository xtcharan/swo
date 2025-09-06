import React from 'react';

export const LoadingScreen = () => {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
      <img
        src={require('../assets/logo.webp')}
        style={{ width: 80, height: 80, objectFit: 'contain' }}
        alt="Logo"
      />
      <div style={{ color: '#011025', fontSize: 20, marginTop: 16 }}>
        Loading...
      </div>
    </div>
  );
};
