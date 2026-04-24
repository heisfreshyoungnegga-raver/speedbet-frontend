import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy } from 'lucide-react';

interface WheelSegment {
  label: string;
  value: number;
  color: string;
}

const SEGMENTS: WheelSegment[] = [
  { label: '2x', value: 2, color: '#22c55e' },
  { label: '0', value: 0, color: '#ef4444' },
  { label: '5x', value: 5, color: '#3b82f6' },
  { label: '0', value: 0, color: '#ef4444' },
  { label: '10x', value: 10, color: '#f59e0b' },
  { label: '0', value: 0, color: '#ef4444' },
  { label: '3x', value: 3, color: '#8b5cf6' },
  { label: '0', value: 0, color: '#ef4444' },
];

const LuckySpin: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<WheelSegment | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const wheelRef = useRef<SVGSVGElement>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const segmentIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segmentAngle = 360 / SEGMENTS.length;
    const targetAngle = 360 * 5 + (segmentIndex * segmentAngle + segmentAngle / 2);
    const newRotation = rotation + targetAngle;

    setRotation(newRotation);

    setTimeout(() => {
      setResult(SEGMENTS[segmentIndex]);
      setSpinning(false);
    }, 3000);
  };

  const segmentAngle = 360 / SEGMENTS.length;

  return (
    <div className="bg-[#0a0b0f] rounded-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Lucky Spin</h2>

      <div className="relative flex justify-center mb-8">
        <div
          className="relative w-80 h-80"
          style={{
            transition: spinning ? 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {SEGMENTS.map((segment, i) => {
              const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);
              const x1 = 100 + 90 * Math.cos(startAngle);
              const y1 = 100 + 90 * Math.sin(startAngle);
              const x2 = 100 + 90 * Math.cos(endAngle);
              const y2 = 100 + 90 * Math.sin(endAngle);
              const largeArc = segmentAngle > 180 ? 1 : 0;

              const pathD = `M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`;

              return (
                <g key={i}>
                  <path
                    d={pathD}
                    fill={segment.color}
                    stroke="#1a1d2e"
                    strokeWidth="2"
                  />
                  <text
                    x={100 + 60 * Math.cos((startAngle + endAngle) / 2)}
                    y={100 + 60 * Math.sin((startAngle + endAngle) / 2)}
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${i * segmentAngle}, ${100 + 60 * Math.cos((startAngle + endAngle) / 2)}, ${100 + 60 * Math.sin((startAngle + endAngle) / 2)})`}
                  >
                    {segment.label}
                  </text>
                </g>
              );
            })}
            <circle cx="100" cy="100" r="20" fill="#1a1d2e" stroke="#f97316" strokeWidth="3" />
            <text x="100" y="105" textAnchor="middle" fill="#f97316" fontSize="8" fontWeight="bold">
              SPIN
            </text>
          </svg>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-[#f97316]" />
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-center mb-6 p-4 rounded-lg ${
            result.value > 0 ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'
          }`}
        >
          <p className="text-2xl font-bold mb-2">
            {result.value > 0 ? `${result.label} WIN!` : 'NO WIN'}
          </p>
          {result.value > 0 && (
            <p className="text-green-500 text-xl">
              Won {(betAmount * result.value).toFixed(2)}!
            </p>
          )}
        </motion.div>
      )}

      <div className="bg-[#1a1d2e] rounded-lg p-4 mb-6">
        <label className="text-gray-400 text-sm block mb-2">Bet Amount</label>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#f97316]" />
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
            disabled={spinning}
            className="bg-[#0f1117] text-white px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#f97316]"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {SEGMENTS.map((seg, i) => (
          <div
            key={i}
            className="p-2 rounded text-center text-xs font-bold text-white"
            style={{ backgroundColor: seg.color }}
          >
            {seg.label}
          </div>
        ))}
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="w-full bg-[#f97316] hover:bg-[#ea580c] disabled:bg-gray-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
      >
        <Play className="w-5 h-5" />
        {spinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>
    </div>
  );
};

export default LuckySpin;
