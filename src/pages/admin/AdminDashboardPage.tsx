import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  DollarSign,
  Ticket,
  Brain,
  Gamepad2,
  Activity,
  Menu,
  X,
  Bell,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface KPI {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

interface ActivityItem {
  id: string;
  action: string;
  user: string;
  time: string;
  type: 'booking' | 'prediction' | 'payout' | 'user';
}

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const kpis: KPI[] = [
    { label: 'New Signups', value: '1,234', change: 12.5, icon: <Users className="w-6 h-6" /> },
    { label: 'Active Users', value: '8,432', change: 8.2, icon: <TrendingUp className="w-6 h-6" /> },
    { label: 'Stake Volume', value: 'GHS 245,890', change: -3.1, icon: <DollarSign className="w-6 h-6" /> },
    { label: 'Commission Earned', value: 'GHS 12,345', change: 15.7, icon: <DollarSign className="w-6 h-6" /> },
  ];

  const quickActions = [
    { label: 'Create Booking Code', icon: <Ticket className="w-5 h-5" />, path: '/admin/booking-codes' },
    { label: 'Run Prediction', icon: <Brain className="w-5 h-5" />, path: '/admin/predictions' },
    { label: 'Create Custom Game', icon: <Gamepad2 className="w-5 h-5" />, path: '/admin/custom-games' },
  ];

  const recentActivity: ActivityItem[] = [
    { id: '1', action: 'Created booking code', user: 'Admin John', time: '2 minutes ago', type: 'booking' },
    { id: '2', action: 'Ran prediction for Man City vs Arsenal', user: 'Admin Sarah', time: '15 minutes ago', type: 'prediction' },
    { id: '3', action: 'Approved payout of GHS 1,200', user: 'Admin Mike', time: '1 hour ago', type: 'payout' },
    { id: '4', action: 'New user registered', user: 'System', time: '2 hours ago', type: 'user' },
    { id: '5', action: 'Created booking code', user: 'Admin John', time: '3 hours ago', type: 'booking' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SpeedBet</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Admin Panel</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              <a href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium">
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </a>
              <a href="/admin/booking-codes" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
                <Ticket className="w-5 h-5" />
                Booking Codes
              </a>
              <a href="/admin/predictions" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
                <Brain className="w-5 h-5" />
                Predictions
              </a>
              <a href="/admin/custom-games" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
                <Gamepad2 className="w-5 h-5" />
                Custom Games
              </a>
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {user?.email?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.email}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Admin</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 shadow-sm px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Dashboard</h2>

          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 relative">
            <Bell className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi, index) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    {kpi.icon}
                  </div>
                  <span className={`text-sm font-medium ${kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change >= 0 ? '+' : ''}{kpi.change}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{kpi.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(action.path)}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    {action.icon}
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    item.type === 'booking' ? 'bg-blue-500' :
                    item.type === 'prediction' ? 'bg-purple-500' :
                    item.type === 'payout' ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 dark:text-white">{item.action}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.user} • {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
