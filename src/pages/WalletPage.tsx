import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ArrowDown, ArrowUp, CreditCard, X, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

type TransactionKind = 'DEPOSIT' | 'WITHDRAWAL' | 'BET_STAKE' | 'BET_WIN' | 'BET_REFUND';

interface Transaction {
  id: string;
  date: string;
  kind: TransactionKind;
  amount: number;
  balanceAfter: number;
  description?: string;
}

const mockTransactions: Transaction[] = [
  { id: 'tx-1', date: '2026-04-23 10:30', kind: 'DEPOSIT', amount: 500, balanceAfter: 750, description: 'Paystack deposit' },
  { id: 'tx-2', date: '2026-04-22 18:45', kind: 'BET_STAKE', amount: -100, balanceAfter: 250, description: 'Man Utd vs Liverpool' },
  { id: 'tx-3', date: '2026-04-22 19:00', kind: 'BET_WIN', amount: 185, balanceAfter: 435, description: 'Won: Man Utd vs Liverpool' },
  { id: 'tx-4', date: '2026-04-21 12:00', kind: 'DEPOSIT', amount: 200, balanceAfter: 250, description: 'Stripe deposit' },
  { id: 'tx-5', date: '2026-04-20 15:30', kind: 'WITHDRAWAL', amount: -150, balanceAfter: 50, description: 'Withdrawal to bank' },
  { id: 'tx-6', date: '2026-04-19 20:00', kind: 'BET_STAKE', amount: -50, balanceAfter: 200, description: 'Arsenal vs Chelsea' },
  { id: 'tx-7', date: '2026-04-19 21:30', kind: 'BET_REFUND', amount: 50, balanceAfter: 250, description: 'Refunded: Match cancelled' },
  { id: 'tx-8', date: '2026-04-18 09:00', kind: 'DEPOSIT', amount: 300, balanceAfter: 300, description: 'Paystack deposit' },
  { id: 'tx-9', date: '2026-04-17 14:20', kind: 'BET_WIN', amount: 97.5, balanceAfter: 0, description: 'Won: Barcelona vs Madrid' },
  { id: 'tx-10', date: '2026-04-16 11:00', kind: 'WITHDRAWAL', amount: -200, balanceAfter: 0, description: 'Withdrawal to bank' },
];

const kindColors: Record<TransactionKind, string> = {
  DEPOSIT: 'text-green-400',
  WITHDRAWAL: 'text-red-400',
  BET_STAKE: 'text-yellow-400',
  BET_WIN: 'text-green-400',
  BET_REFUND: 'text-blue-400',
};

const kindLabels: Record<TransactionKind, string> = {
  DEPOSIT: 'Deposit',
  WITHDRAWAL: 'Withdrawal',
  BET_STAKE: 'Bet Stake',
  BET_WIN: 'Bet Win',
  BET_REFUND: 'Refund',
};

const itemsPerPage = 10;

const DepositModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'paystack' | 'stripe'>('paystack');
  const [currency, setCurrency] = useState<'GHS' | 'NGN' | 'USD'>('GHS');

  if (!isOpen) return null;

  const handleDeposit = () => {
    alert(`Depositing ${amount} ${currency} via ${selectedMethod}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#1a1d2e] rounded-2xl w-full max-w-md p-6 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Deposit Funds</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Payment Method Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => { setSelectedMethod('paystack'); setCurrency('GHS'); }}
              className={`p-4 rounded-xl border-2 transition-colors ${selectedMethod === 'paystack' ? 'border-[#FF6A00] bg-[#FF6A00]/10' : 'border-gray-700 bg-[#0f1119]'}`}
            >
              <CreditCard className={`w-6 h-6 mx-auto mb-2 ${selectedMethod === 'paystack' ? 'text-[#FF6A00]' : 'text-gray-400'}`} />
              <p className={`text-sm font-semibold ${selectedMethod === 'paystack' ? 'text-white' : 'text-gray-400'}`}>Paystack</p>
              <p className="text-xs text-gray-500 mt-1">GHS / NGN</p>
            </button>
            <button
              onClick={() => { setSelectedMethod('stripe'); setCurrency('USD'); }}
              className={`p-4 rounded-xl border-2 transition-colors ${selectedMethod === 'stripe' ? 'border-[#FF6A00] bg-[#FF6A00]/10' : 'border-gray-700 bg-[#0f1119]'}`}
            >
              <CreditCard className={`w-6 h-6 mx-auto mb-2 ${selectedMethod === 'stripe' ? 'text-[#FF6A00]' : 'text-gray-400'}`} />
              <p className={`text-sm font-semibold ${selectedMethod === 'stripe' ? 'text-white' : 'text-gray-400'}`}>Stripe</p>
              <p className="text-xs text-gray-500 mt-1">USD</p>
            </button>
          </div>

          {/* Currency Selection (Paystack) */}
          {selectedMethod === 'paystack' && (
            <div className="flex gap-2 mb-4">
              {(['GHS', 'NGN'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${currency === curr ? 'bg-[#FF6A00] text-white' : 'bg-[#0f1119] text-gray-400 border border-gray-700'}`}
                >
                  {curr}
                </button>
              ))}
            </div>
          )}

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Amount ({currency})</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-[#0f1119] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF6A00] transition-colors"
            />
          </div>

          <button
            onClick={handleDeposit}
            disabled={!amount || Number(amount) <= 0}
            className="w-full py-3 bg-[#FF6A00] hover:bg-[#FF8533] disabled:bg-gray-700 disabled:text-gray-400 text-white font-bold rounded-lg transition-colors"
          >
            Deposit {amount ? `${amount} ${currency}` : ''}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const WalletPage: React.FC = () => {
  const [balance] = useState(750);
  const [activeTab, setActiveTab] = useState<'ALL' | TransactionKind>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  const filteredTransactions = activeTab === 'ALL'
    ? mockTransactions
    : mockTransactions.filter((tx) => tx.kind === activeTab);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tabs: ('ALL' | TransactionKind)[] = ['ALL', 'DEPOSIT', 'WITHDRAWAL', 'BET_STAKE'];

  return (
    <div className="min-h-screen bg-[#0f1119] py-6">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6">Wallet</h1>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1a1d2e] to-[#252840] rounded-2xl p-6 mb-6 border border-gray-800/50"
        >
          <p className="text-sm text-gray-400 mb-2">Available Balance</p>
          <p className="text-5xl font-bold text-white mb-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
            GHS {balance.toFixed(2)}
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setDepositModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#FF6A00] hover:bg-[#FF8533] text-white font-bold rounded-lg transition-colors"
            >
              <ArrowDown className="w-4 h-4" />
              DEPOSIT
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#252840] hover:bg-[#2d3050] text-white font-bold rounded-lg border border-gray-700 transition-colors">
              <ArrowUp className="w-4 h-4" />
              WITHDRAW
            </button>
          </div>
        </motion.div>

        {/* Transactions */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Transactions</h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-[#FF6A00] text-white'
                    : 'bg-[#1a1d2e] text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {tab === 'BET_STAKE' ? 'Bets' : tab}
              </button>
            ))}
          </div>

          {/* Transaction List */}
          <div className="space-y-2">
            {paginatedTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#1a1d2e] rounded-xl p-4 flex items-center justify-between border border-gray-800/50"
              >
                <div>
                  <p className="text-white font-medium text-sm">{tx.description || kindLabels[tx.kind]}</p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Bal: GHS {tx.balanceAfter.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-[#1a1d2e] text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-[#FF6A00] text-white'
                      : 'bg-[#1a1d2e] text-gray-400 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-[#1a1d2e] text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <DepositModal isOpen={depositModalOpen} onClose={() => setDepositModalOpen(false)} />
    </div>
  );
};

export default WalletPage;
