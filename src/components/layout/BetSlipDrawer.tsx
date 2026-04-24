import React, { useState, useRef, useEffect } from 'react';
import { useBetSlipStore } from '@/stores/betSlipStore';
import { Trash2 } from 'lucide-react';

type DrawerState = 'closed' | 'open' | 'dragging';

const BetSlipDrawer: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [drawerState, setDrawerState] = useState<DrawerState>('closed');
  const [drawerHeight, setDrawerHeight] = useState(60);
  const [bookingCode, setBookingCode] = useState('');

  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);

  const {
    selections,
    stake,
    totalOdds,
    potentialReturn,
    removeSelection,
    clearSlip,
    setStake,
  } = useBetSlipStore();

  // Handle desktop/mobile resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (drawerState === 'dragging') return;
    dragStartY.current = e.touches[0].clientY;
    dragStartHeight.current = drawerHeight;
    setDrawerState('dragging');
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (drawerState !== 'dragging') return;
    e.preventDefault();
    
    const deltaY = dragStartY.current - e.touches[0].clientY;
    const maxHeight = window.innerHeight * 0.8;
    const newHeight = Math.max(60, Math.min(maxHeight, dragStartHeight.current + deltaY));
    setDrawerHeight(newHeight);
  };

  const handleTouchEnd = () => {
    if (drawerState !== 'dragging') return;
    
    const maxHeight = window.innerHeight * 0.8;
    if (drawerHeight > maxHeight * 0.3) {
      setDrawerHeight(maxHeight);
      setDrawerState('open');
    } else {
      setDrawerHeight(60);
      setDrawerState('closed');
    }
  };

  const handleBookingCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().slice(0, 8);
    setBookingCode(val);
  };

  const loadBookingCode = () => {
    if (bookingCode.length !== 8) return;
    // Placeholder: Integrate with booking code API
    console.log('Loading booking code:', bookingCode);
  };

  // Shared stake input component
  const StakeInput = () => (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">Stake</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">KES</span>
        <input
          type="text"
          value={stake || ''}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9.]/g, '');
            const parts = val.split('.');
            const formatted = parts.length > 2 
              ? parts[0] + '.' + parts.slice(1).join('') 
              : val;
            setStake(parseFloat(formatted) || 0);
          }}
          className="w-full pl-12 pr-4 py-2 text-right border border-gray-300 rounded-md focus:outline-none focus:border-brand-green text-sm"
        />
      </div>
    </div>
  );

  // Desktop View (right side panel)
  if (isDesktop) {
    return (
      <div className="fixed top-16 right-0 w-72 h-[calc(100vh-4rem)] bg-white shadow-lg border-l border-gray-200 flex flex-col">
        {/* Booking Code Input */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Booking Code</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={bookingCode}
              onChange={handleBookingCodeChange}
              placeholder="8-char code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm uppercase focus:outline-none focus:border-brand-green"
            />
            <button
              onClick={loadBookingCode}
              disabled={bookingCode.length !== 8}
              className="px-3 py-2 bg-brand-green text-white text-sm rounded-md hover:bg-brand-green/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Load
            </button>
          </div>
        </div>

        {/* Selections List */}
        <div className="flex-1 overflow-y-auto p-4">
          {selections.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">
              No selections yet
            </div>
          ) : (
            <ul className="space-y-3">
              {selections.map((sel) => (
                <li 
                  key={`${sel.matchId}-${sel.market}-${sel.selection}`} 
                  className="border-b border-gray-100 pb-3 last:border-0"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{sel.matchLabel}</p>
                      <p className="text-xs text-gray-500">{sel.market}</p>
                      <p className="text-sm text-brand-green">{sel.selection}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium tabular-nums">{sel.odds.toFixed(2)}</span>
                      <button 
                        onClick={() => removeSelection(sel.matchId, sel.market, sel.selection)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bet Controls */}
        <div className="p-4 border-t border-gray-200 space-y-4">
          <StakeInput />

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Total Odds</span>
            <span className="text-sm font-medium tabular-nums">{totalOdds.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Potential Return</span>
            <span className="text-2xl font-bold text-brand-green tabular-nums">
              KES {potentialReturn.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => console.log('Place bet')}
            disabled={selections.length === 0 || stake <= 0}
            className="w-full py-3 bg-brand-green text-white font-medium rounded-md hover:bg-brand-green/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Place Bet
          </button>
        </div>
      </div>
    );
  }

  // Mobile View (bottom drawer)
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg rounded-t-lg border-t border-gray-200"
      style={{ 
        height: `${drawerHeight}px`, 
        transition: drawerState === 'dragging' ? 'none' : 'height 0.3s ease' 
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Drag Handle */}
      <div className="h-10 flex items-center justify-center cursor-grab active:cursor-grabbing">
        <div className="w-12 h-1 bg-gray-300 rounded-full" />
      </div>

      {/* Drawer Content (visible when open) */}
      {drawerHeight > 100 && (
        <div className="px-4 pb-4 overflow-y-auto" style={{ height: `${drawerHeight - 40}px` }}>
          {/* Booking Code Input */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Booking Code</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={bookingCode}
                onChange={handleBookingCodeChange}
                placeholder="8-char code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm uppercase focus:outline-none focus:border-brand-green"
              />
              <button
                onClick={loadBookingCode}
                disabled={bookingCode.length !== 8}
                className="px-3 py-2 bg-brand-green text-white text-sm rounded-md hover:bg-brand-green/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Load
              </button>
            </div>
          </div>

          {/* Selections List */}
          {selections.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">
              No selections yet
            </div>
          ) : (
            <ul className="space-y-3 mb-4">
              {selections.map((sel) => (
                <li 
                  key={`${sel.matchId}-${sel.market}-${sel.selection}`} 
                  className="border-b border-gray-100 pb-3 last:border-0"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{sel.matchLabel}</p>
                      <p className="text-xs text-gray-500">{sel.market}</p>
                      <p className="text-sm text-brand-green">{sel.selection}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium tabular-nums">{sel.odds.toFixed(2)}</span>
                      <button 
                        onClick={() => removeSelection(sel.matchId, sel.market, sel.selection)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Bet Controls */}
          <div className="space-y-4">
            <StakeInput />

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Total Odds</span>
              <span className="text-sm font-medium tabular-nums">{totalOdds.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Potential Return</span>
              <span className="text-xl font-bold text-brand-green tabular-nums">
                KES {potentialReturn.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => console.log('Place bet')}
              disabled={selections.length === 0 || stake <= 0}
              className="w-full py-3 bg-brand-green text-white font-medium rounded-md hover:bg-brand-green/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Place Bet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BetSlipDrawer;
