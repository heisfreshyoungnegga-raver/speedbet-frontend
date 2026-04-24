import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Mail,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatting';
import { User } from '../../types';

interface ReferralUser extends User {
  date_joined: string;
  lifetime_stake: number;
  lifetime_commission: number;
}

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<ReferralUser[]>([
    {
      id: '1',
      email: 'user1@example.com',
      first_name: 'John',
      last_name: 'Doe',
      role: 'USER',
      status: 'ACTIVE',
      created_at: '2026-04-01T10:00:00Z',
      date_joined: '2026-04-01',
      lifetime_stake: 1500.50,
      lifetime_commission: 75.25,
    },
    {
      id: '2',
      email: 'user2@example.com',
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'USER',
      status: 'ACTIVE',
      created_at: '2026-04-05T14:30:00Z',
      date_joined: '2026-04-05',
      lifetime_stake: 3200.00,
      lifetime_commission: 160.00,
    },
    {
      id: '3',
      email: 'user3@example.com',
      first_name: 'Bob',
      last_name: 'Johnson',
      role: 'USER',
      status: 'ACTIVE',
      created_at: '2026-04-10T09:15:00Z',
      date_joined: '2026-04-10',
      lifetime_stake: 890.75,
      lifetime_commission: 44.54,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchTerm ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDateRange = (!dateRange.start || user.date_joined >= dateRange.start) &&
        (!dateRange.end || user.date_joined <= dateRange.end);

      return matchesSearch && matchesDateRange;
    });
  }, [users, searchTerm, dateRange]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Date Joined', 'Lifetime Stake', 'Lifetime Commission'];
    const rows = filteredUsers.map(user => [
      `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      user.email,
      user.date_joined,
      user.lifetime_stake.toFixed(2),
      user.lifetime_commission.toFixed(2),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `referral_users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const totalStake = filteredUsers.reduce((sum, u) => sum + u.lifetime_stake, 0);
  const totalCommission = filteredUsers.reduce((sum, u) => sum + u.lifetime_commission, 0);

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
              <Users className="w-6 h-6 text-blue-600" />
              Referred Users
            </h1>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
              <Users className="w-4 h-4" />
              Total Users
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{filteredUsers.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              Total Stake
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalStake)}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
              <DollarSign className="w-4 h-4" />
              Total Commission
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalCommission)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
              <span className="text-slate-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Date Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Lifetime Stake
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Lifetime Commission
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {paginatedUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">
                            {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : 'N/A'}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(user.date_joined)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {formatCurrency(user.lifetime_stake)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">
                      {formatCurrency(user.lifetime_commission)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {!paginatedUsers.length && (
            <div className="text-center py-8 text-slate-500">
              No users found matching your criteria
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm text-slate-900 dark:text-white">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
