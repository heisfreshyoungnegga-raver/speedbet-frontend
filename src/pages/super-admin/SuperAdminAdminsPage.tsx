import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Plus, Mail, Copy, CheckCircle } from 'lucide-react'
import { toast } from 'react-toastify'

interface Admin {
  id: string
  email: string
  created_at: string
  users_brought: number
  total_commission: number
  status: 'ACTIVE' | 'DISABLED'
}

// Mock data
const MOCK_ADMINS: Admin[] = [
  { id: '1', email: 'admin1@speedbet.com', created_at: '2025-01-15', users_brought: 145, total_commission: 12500, status: 'ACTIVE' },
  { id: '2', email: 'admin2@speedbet.com', created_at: '2025-02-20', users_brought: 89, total_commission: 7800, status: 'ACTIVE' },
  { id: '3', email: 'admin3@speedbet.com', created_at: '2025-03-10', users_brought: 234, total_commission: 22100, status: 'ACTIVE' },
]

export default function SuperAdminAdminsPage() {
  const [admins] = useState<Admin[]>(MOCK_ADMINS)
  const [showCreate, setShowCreate] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [inviteLink, setInviteLink] = useState('')

  const handleCreate = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    const link = `${window.location.origin}${import.meta.env.VITE_SUPER_ADMIN_PATH || '/x-control-9f3a2b'}/admin-invite/${code}`
    setInviteLink(link)
    toast.success('Admin created! Copy the invite link below.')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    toast.info('Link copied!')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Admin Management</h1>
          <p className="text-text-secondary">Create and manage admin accounts with referral links</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary"
        >
          <Plus size={18} />
          <span>Create New Admin</span>
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-[400] flex items-center justify-center p-4">
          <div className="bg-bg-surface rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-display font-bold text-text-primary mb-4">Create New Admin</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="input-base w-full"
                  placeholder="admin@speedbet.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-base w-full"
                  placeholder="Min 8 characters"
                />
              </div>
            </div>
            {inviteLink && (
              <div className="bg-bg-dark rounded-xl p-4 mb-4">
                <p className="text-sm text-text-secondary mb-2">Invite Link (show once!)</p>
                <div className="flex items-center gap-2">
                  <input value={inviteLink} readOnly className="input-base flex-1" />
                  <button onClick={copyLink} className="btn-primary px-3 py-2">
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setShowCreate(false); setInviteLink('') }} className="btn-primary bg-bg-elevated hover:bg-border flex-1">
                Cancel
              </button>
              <button onClick={handleCreate} className="btn-primary flex-1">
                Create Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Table */}
      <div className="bg-bg-surface rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-bg-dark">
            <tr>
              <th className="p-4 text-sm font-medium text-text-secondary">Email</th>
              <th className="p-4 text-sm font-medium text-text-secondary">Created</th>
              <th className="p-4 text-sm font-medium text-text-secondary">Users</th>
              <th className="p-4 text-sm font-medium text-text-secondary">Commission</th>
              <th className="p-4 text-sm font-medium text-text-secondary">Status</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-t border-color-border">
                <td className="p-4 text-text-primary">{admin.email}</td>
                <td className="p-4 text-text-secondary">{new Date(admin.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-text-primary font-mono tabular-nums">{admin.users_brought}</td>
                <td className="p-4 text-brand-green font-mono tabular-nums font-semibold">
                  ₵{admin.total_commission.toLocaleString()}
                </td>
                <td className="p-4">
                  <span className={`badge ${admin.status === 'ACTIVE' ? 'badge-win' : 'badge-lost'}`}>
                    {admin.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
