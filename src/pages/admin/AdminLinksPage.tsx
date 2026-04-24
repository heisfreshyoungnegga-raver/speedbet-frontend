import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link,
  Plus,
  Copy,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  Calendar,
  Percent,
  MousePointerClick,
} from 'lucide-react';
import { AdminReferralLink } from '../../types';

interface ReferralLinkForm {
  label: string;
  commission_percent: number;
  expires_at: string;
}

const AdminLinksPage = () => {
  const navigate = useNavigate();
  const [links, setLinks] = useState<AdminReferralLink[]>([
    {
      id: '1',
      code: 'SPEED2026',
      label: 'Main Promotion',
      commission_percent: 10,
      is_active: true,
      created_at: '2026-04-01T10:00:00Z',
    },
    {
      id: '2',
      code: 'WINBIG50',
      label: 'Weekend Special',
      commission_percent: 15,
      is_active: true,
      created_at: '2026-04-10T14:30:00Z',
    },
    {
      id: '3',
      code: 'VIPEXTRA',
      label: 'VIP Members',
      commission_percent: 20,
      is_active: false,
      created_at: '2026-03-15T09:00:00Z',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<ReferralLinkForm>({
    label: '',
    commission_percent: 10,
    expires_at: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCreateLink = () => {
    if (!formData.label) return;

    const newLink: AdminReferralLink = {
      id: Date.now().toString(),
      code: `LINK${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      label: formData.label,
      commission_percent: formData.commission_percent,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setLinks([newLink, ...links]);
    setShowModal(false);
    setFormData({ label: '', commission_percent: 10, expires_at: '' });
  };

  const toggleActive = (id: string) => {
    setLinks(links.map(link =>
      link.id === id ? { ...link, is_active: !link.is_active } : link
    ));
  };

  const handleDelete = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
    setDeleteConfirm(null);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
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
              <Link className="w-6 h-6 text-blue-600" />
              Referral Links
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Link
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Links</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{links.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Links</p>
            <p className="text-2xl font-bold text-green-600">
              {links.filter(l => l.is_active).length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg. Commission</p>
            <p className="text-2xl font-bold text-blue-600">
              {(links.reduce((sum, l) => sum + l.commission_percent, 0) / links.length || 0).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {links.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{link.label}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        link.is_active
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {link.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {link.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(link.code)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                        title="Copy code"
                      >
                        {copiedCode === link.code ? (
                          <span className="text-xs text-green-600">Copied!</span>
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Percent className="w-4 h-4" />
                    <span>Commission: <strong className="text-slate-900 dark:text-white">{link.commission_percent}%</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>Created: {new Date(link.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <MousePointerClick className="w-4 h-4" />
                    <span>Clicks: <strong className="text-slate-900 dark:text-white">0</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => toggleActive(link.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      link.is_active
                        ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {link.is_active ? (
                      <ToggleRight className="w-4 h-4" />
                    ) : (
                      <ToggleLeft className="w-4 h-4" />
                    )}
                    {link.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(link.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === link.id && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-400 mb-2">
                      Are you sure you want to delete this link?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-sm rounded hover:bg-slate-300 dark:hover:bg-slate-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!links.length && (
          <div className="text-center py-12 text-slate-500">
            No referral links yet. Create one to get started!
          </div>
        )}
      </div>

      {/* Create Link Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Create New Referral Link
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g. Summer Promotion"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Commission Percentage (1-20%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.commission_percent}
                    onChange={(e) => setFormData({ ...formData, commission_percent: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateLink}
                  disabled={!formData.label}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Create Link
                </button>
                <button
                  onClick={() => setShowModal(false)}
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

export default AdminLinksPage;
