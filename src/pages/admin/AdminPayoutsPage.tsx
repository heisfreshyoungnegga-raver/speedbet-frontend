import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Plus,
  ChevronLeft,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  X,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatting';

interface PayoutRequest {
  id: string;
  period_start: string;
  period_end: string;
  amount: number;
  status: 'REQUESTED' | 'APPROVED' | 'PAID' | 'REJECTED';
  requested_at: string;
  admin_note?: string;
  rejection_reason?: string;
}

const AdminPayoutsPage = () => {
  const navigate = useNavigate();
  const [payouts, setPayouts] = useState<PayoutRequest[]>([
    {
      id: '1',
      period_start: '2026-04-14',
      period_end: '2026-04-20',
      amount: 2500.00,
      status: 'PAID',
      requested_at: '2026-04-21T09:00:00Z',
      admin_note: 'Weekly commission payout',
    },
    {
      id: '2',
      period_start: '2026-04-07',
      period_end: '2026-04-13',
      amount: 1850.50,
      status: 'APPROVED',
      requested_at: '2026-04-14T10:30:00Z',
      admin_note: 'Easter week bonus included',
    },
    {
      id: '3',
      period_start: '2026-03-31',
      period_end: '2026-04-06',
      amount: 3200.75,
      status: 'REJECTED',
      requested_at: '2026-04-07T14:00:00Z',
      rejection_reason: 'Insufficient documentation provided. Please resubmit with proper records.',
    },
    {
      id: '4',
      period_start: '2026-04-21',
      period_end: '2026-04-27',
      amount: 2100.00,
      status: 'REQUESTED',
      requested_at: '2026-04-22T11:00:00Z',
    },
  ]);

  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'REQUESTED' | 'APPROVED' | 'PAID' | 'REJECTED'>('ALL');

  const today = new Date();
  const isFriday = today.getDay() === 5;

  const filteredPayouts = useMemo(() => {
    return payouts.filter(p => filterStatus === 'ALL' || p.status === filterStatus);
  }, [payouts, filterStatus]);

  const totalAmount = filteredPayouts.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = filteredPayouts
    .filter(p => p.status === 'REQUESTED' || p.status === 'APPROVED')
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'REQUESTED': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'APPROVED': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'PAID': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'REJECTED': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REQUESTED': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'APPROVED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'PAID': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'REJECTED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return '';
    }
  };

  const handleRequestPayout = () => {
    if (!isFriday) return;

    const newRequest: PayoutRequest = {
      id: Date.now().toString(),
      period_start: '2026-04-28',
      period_end: '2026-05-04',
      amount: 0,
      status: 'REQUESTED',
      requested_at: new Date().toISOString(),
    };

    setPayouts([newRequest, ...payouts]);
    setShowRequestModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/admin')}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-2 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Payout Requests
            </h1>
          </div>
          <button
            onClick={() => setShowRequestModal(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isFriday
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
            disabled={!isFriday}
            title={!isFriday ? 'Payout requests can only be made on Fridays' : ''}
          >
            <Plus className="w-4 h-4" />
            Request Payout
          </button>
        </div>

        {/* Warning if not Friday */}
        {!isFriday && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Payout requests can only be submitted on <strong>Fridays</strong>. Today is {today.toLocaleDateString('en-US', { weekday: 'long' })}.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Requests</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{filteredPayouts.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pending Amount</p>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(pendingAmount)}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400 mr-2">Filter by status:</span>
            {(['ALL', 'REQUESTED', 'APPROVED', 'PAID', 'REJECTED'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filterStatus === status
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Payouts List */}
        <div className="space-y-4">
          {filteredPayouts.map((payout, index) => (
            <motion.div
              key={payout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Period */}
                <div className="flex-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Period</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {new Date(payout.period_start).toLocaleDateString()} - {new Date(payout.period_end).toLocaleDateString()}
                  </p>
                </div>

                {/* Amount */}
                <div className="flex-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Amount</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(payout.amount)}
                  </p>
                </div>

                {/* Status */}
                <div className="flex-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(payout.status)}
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(payout.status)}`}>
                      {payout.status}
                    </span>
                  </div>
                </div>

                {/* Requested At */}
                <div className="flex-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Requested</p>
                  <p className="text-sm text-slate-900 dark:text-white">
                    {formatDate(payout.requested_at)}
                  </p>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => setShowDetails(showDetails === payout.id ? null : payout.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  {showDetails === payout.id ? 'Hide' : 'View'} Details
                </button>
              </div>

              {/* Details Panel */}
              <AnimatePresence>
                {showDetails === payout.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Period Start</p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {new Date(payout.period_start).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Period End</p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {new Date(payout.period_end).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Amount</p>
                          <p className="font-bold text-green-600">{formatCurrency(payout.amount)}</p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Requested At</p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {new Date(payout.requested_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {payout.admin_note && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Note:</strong> {payout.admin_note}
                          </p>
                        </div>
                      )}

                      {payout.status === 'REJECTED' && payout.rejection_reason && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <p className="text-sm text-red-800 dark:text-red-300">
                            <strong>Rejection Reason:</strong> {payout.rejection_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {!filteredPayouts.length && (
          <div className="text-center py-12 text-slate-500">
            No payout requests found
          </div>
        )}
      </div>

      {/* Request Payout Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRequestModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Request Payout
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Period</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    April 28, 2026 - May 4, 2026
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Estimated Amount</p>
                  <p className="text-2xl font-bold text-green-600">GHS 0.00</p>
                  <p className="text-xs text-slate-500 mt-1">Calculated from your commission earnings</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRequestPayout}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Request
                </button>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPayoutsPage;
