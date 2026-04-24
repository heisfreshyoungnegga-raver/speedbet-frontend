import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket } from 'lucide-react';
import { validateBookingCode } from '@/utils/validators';

interface BookingCodeInputProps {
  onLoadCode: (code: string) => void;
}

const shakeAnimation = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 },
  },
};

const BookingCodeInput: React.FC<BookingCodeInputProps> = ({ onLoadCode }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 8);
    setCode(value);
    setError('');
  };

  const handleLoadCode = () => {
    if (!validateBookingCode(code)) {
      setError('Invalid code. Must be 8 uppercase letters/digits (no I, O, 0, 1).');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }
    onLoadCode(code);
    setCode('');
    setError('');
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="flex gap-2 items-center">
        <motion.div
          animate={isShaking ? 'shake' : ''}
          variants={shakeAnimation}
          className="flex-1"
        >
          <div className="relative">
            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={code}
              onChange={handleChange}
              placeholder="Enter 8-character booking code"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase tracking-widest"
              maxLength={8}
            />
          </div>
        </motion.div>
        <button
          onClick={handleLoadCode}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          Load Code
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingCodeInput;
