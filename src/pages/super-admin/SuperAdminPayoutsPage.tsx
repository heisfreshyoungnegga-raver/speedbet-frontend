import React, { useState, useCallback } from 'react';
import {
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  Mail,
  Filter,
  Search,
  ChevronDown,
  AlertCircle,
  Clock,
  CreditCard
} from 'lucide-react';

type PayoutStatus = 'REQUESTED' | 'APPROVED' | 'PAID' | 'REJECTED';

interface PayoutRequest {
  id: string;
  adminEmail: string;
  period: string;
  amount: number;
  status: PayoutStatus;
  requestedAt: Date;
  approvedAt?: Date;
  paidAt?: Date;
  rejectedAt?: Date;
  rejectReason?: string;
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  type?: 'approve' | 'reject' | 'paid';
  showReasonInput?: boolean;
  reason?: string;
  onReasonChange?: (reason: string) => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  type = 'approve',
  showReasonInput = false,
  reason = '',
  onReasonChange,
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    approve: 'bg-green-600 hover:bg-green-700',
    reject: 'bg-red-600 hover:bg-red-700',
    paid: 'bg-blue-600 hover:bg-blue-700',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          {type === 'approve' && <CheckCircle className="w-6 h-6 text-green-400" />}
          {type === 'reject' && <XCircle className="w-6 h-6 text-red-400" />}
          {type === 'paid' && <CreditCard className="w-6 h-6 text-blue-400" />}
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <p className="text-gray-300 mb-4">{message}</p>

        {showReasonInput && onReasonChange && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Reason for Rejection</label>
            <textarea
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500"
              rows={3}
              placeholder="Enter rejection reason..."
            />
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 rounded-lg transition-colors font-medium ${typeStyles[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const SuperAdminPayoutsPage: React.FC = () => {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([
    {
      id: '1',
      adminEmail: 'admin1@speedbet.com',
      period: 'March 2026',
      amount: 2500.00,
      status: 'REQUESTED',
      requestedAt: new Date('2026-04-01'),
    },
    {
      id: '2',
      adminEmail: 'admin2@speedbet.com',
      period: 'March 2026',
      amount: 1800.50,
      status: 'APPROVED',
      requestedAt: new Date('2026-04-02'),
      approvedAt: new Date('2026-04-03'),
    },
    {
      id: '3',
      adminEmail: 'admin1@speedbet.com',
      period: 'February 2026',
      amount: 3200.75,
      status: 'PAID',
      requestedAt: new Date('2026-03-01'),
      approvedAt: new Date('2026-03-02'),
      paidAt: new Date('2026-03-03'),
    },
    {
      id: '4',
      adminEmail: 'suspended@speedbet.com',
      period: 'March 2026',
      amount: 900.00,
      status: 'REJECTED',
      requestedAt: new Date('2026-04-05'),
      rejectedAt: new Date('2026-04-06'),
      rejectReason: 'Account suspended - pending review',
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<PayoutStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | 'paid';
    payoutId: string | null;
  }>({
    isOpen: false,
    type: 'approve',
    payoutId: null,
  });
  const [rejectReason, setRejectReason] = useState('');

  const filteredPayouts = payouts.filter((payout) => {
    const matchesStatus = statusFilter === 'ALL' || payout.status === statusFilter;
    const matchesSearch = payout.adminEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = useCallback((payoutId: string) => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? { ...p, status: 'APPROVED' as PayoutStatus, approvedAt: new Date() }
          : p
      )
    );
  }, []);

  const handleReject = useCallback((payoutId: string, reason: string) => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? { ...p, status: 'REJECTED' as PayoutStatus, rejectedAt: new Date(), rejectReason: reason }
          : p
      )
    );
  }, []);

  const handleMarkAsPaid = useCallback((payoutId: string) => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? { ...p, status: 'PAID' as PayoutStatus, paidAt: new Date() }
          : p
      )
    );
  }, []);

  const openModal = (type: 'approve' | 'reject' | 'paid', payoutId: string) => {
    setModalState({ isOpen: true, type, payoutId });
    setRejectReason('');
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: 'approve', payoutId: null });
    setRejectReason('');
  };

  const handleConfirmAction = () => {
    if (!modalState.payoutId) return;

    switch (modalState.type) {
      case 'approve':
        handleApprove(modalState.payoutId);
        break;
      case 'reject':
        handleReject(modalState.payoutId, rejectReason);
        break;
      case 'paid':
        handleMarkAsPaid(modalState.payoutId);
        break;
    }
    closeModal();
  };

  const getStatusBadge = (status: PayoutStatus) => {
    const styles: Record<PayoutStatus, string> = {
      REQUESTED: 'bg-yellow-900/50 text-yellow-400 border-yellow-700',
      APPROVED: 'bg-green-900/50 text-green-400 border-green-700',
      PAID: 'bg-blue-900/50 text-blue-400 border-blue-700',
      REJECTED: 'bg-red-900/50 text-red-400 border-red-700',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const exportToCSV = () => {
    const headers = ['Admin Email', 'Period', 'Amount', 'Status', 'Requested At', 'Approved At', 'Paid At'];
    const rows = filteredPayouts.map((p) => [
      p.adminEmail,
      p.period,
      p.amount.toString(),
      p.status,
      p.requestedAt.toLocaleDateString(),
      p.approvedAt?.toLocaleDateString() || '',
      p.paidAt?.toLocaleDateString() || '',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payouts.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Payout Requests</h1>
            <p className="text-gray-400 mt-1">Manage all pending payout requests from admins</p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by admin email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PayoutStatus | 'ALL')}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="REQUESTED">Requested</option>
                <option value="APPROVED">Approved</option>
                <option value="PAID">Paid</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Admin Email</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Period</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Requested At</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{payout.adminEmail}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{payout.period}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="font-bold text-green-400">
                          ${payout.amount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(payout.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{payout.requestedAt.toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {payout.status === 'REQUESTED' && (
                          <>
                            <button
                              onClick={() => openModal('approve', payout.id)}
                              className="p-2 bg-green-700 hover:bg-green-600 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openModal('reject', payout.id)}
                              className="p-2 bg-red-700 hover:bg-red-600 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {payout.status === 'APPROVED' && (
                          <button
                            onClick={() => openModal('paid', payout.id)}
                            className="p-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors"
                            title="Mark as Paid"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                        )}
                        {payout.status === 'REJECTED' && payout.rejectReason && (
                          <div className="group relative">
                            <AlertCircle className="w-4 h-4 text-red-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs text-gray-300 whitespace-nowrap z-10">
                              {payout.rejectReason}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayouts.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No payout requests found</p>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">
          {(['REQUESTED', 'APPROVED', 'PAID', 'REJECTED'] as PayoutStatus[]).map((status) => (
            <div key={status} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <p className="text-gray-400 text-sm">{status}</p>
              <p className="text-2xl font-bold mt-1">
                {payouts.filter((p) => p.status === status).length}
              </p>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
        title={
          modalState.type === 'approve'
            ? 'Approve Payout'
            : modalState.type === 'reject'
            ? 'Reject Payout'
            : 'Mark as Paid'
        }
        message={
          modalState.type === 'approve'
            ? 'Are you sure you want to approve this payout request?'
            : modalState.type === 'reject'
            ? 'Are you sure you want to reject this payout request?'
            : 'Are you sure you want to mark this payout as paid?'
        }
        confirmText={
          modalState.type === 'approve'
            ? 'Approve'
            : modalState.type === 'reject'
            ? 'Reject'
            : 'Mark as Paid'
        }
        type={modalState.type}
        showReasonInput={modalState.type === 'reject'}
        reason={rejectReason}
        onReasonChange={setRejectReason}
      />
    </div>
  );
};

export default SuperAdminPayoutsPage;
