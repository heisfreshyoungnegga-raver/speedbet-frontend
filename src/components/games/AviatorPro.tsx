import React from 'react';

interface AviatorProProps {
  isPlaying: boolean;
  stake: number;
  onCashOut: () => void;
  onMultiplierChange: (multiplier: number) => void;
}

const AviatorPro: React.FC<AviatorProProps> = ({ isPlaying, stake, onCashOut, onMultiplierChange }) => {
  return (
    <div className="aviator-pro">
      <h2>Aviator Pro Game</h2>
      <p>This is a placeholder for Aviator Pro game component.</p>
    </div>
  );
};

export default AviatorPro;
