import { useState } from 'react'
import { Crown, Gift, Trophy, Calendar, Plus } from 'lucide-react'
import { toast } from 'react-toastify'

export default function SuperAdminVipPage() {
  const [showGrant, setShowGrant] = useState(false)
  const [showGift, setShowGift] = useState(false)
  const [showDraw, setShowDraw] = useState(false)
  const [email, setEmail] = useState('')
  const [duration, setDuration] = useState(30)

  // Mock data
  const activeVips = [
    { id: '1', email: 'user1@speedbet.com', expiresAt: '2026-05-23', status: 'ACTIVE' },
    { id: '2', email: 'user2@speedbet.com', expiresAt: '2026-05-15', status: 'ACTIVE' },
  ]
  const expiredVips = [
    { id: '3', email: 'user3@speedbet.com', expiresAt: '2026-04-10', status: 'EXPIRED' },
  ]
  const winners = [
    { id: 'w1', email: 'user5@speedbet.com', prize: '₵500 Free Bet', date: '2026-04-20' },
  ]

  const handleGrant = () => {
    if (!email) { toast.error('Enter user email'); return }
    toast.success(`VIP granted to ${email} for ${duration} days`)
    setShowGrant(false)
    setEmail('')
  }

  const handleGift = () => {
    toast.success('Gift broadcast sent to all active VIPs!')
    setShowGift(false)
  }

  const handleDraw = () => {
    toast.success('Giveaway draw triggered! Winner notified.')
    setShowDraw(false)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
            VIP Management
          </h1>
          <p className="text-text-secondary">Grant VIP, broadcast gifts, trigger giveaways</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button onClick={() => setShowGrant(true)} className="btn-primary flex-col py-6">
          <Crown size={24} />
          <span className="mt-2">Grant VIP Manually</span>
        </button>
        <button onClick={() => setShowGift(true)} className="btn-primary bg-bg-elevated hover:bg-border flex-col py-6">
          <Gift size={24} />
          <span className="mt-2">Broadcast Gift</span>
        </button>
        <button onClick={() => setShowDraw(true)} className="btn-primary bg-bg-elevated hover:bg-border flex-col py-6">
          <Trophy size={24} />
          <span className="mt-2">Trigger Giveaway</span>
        </button>
      </div>

      {/* Grant VIP Modal */}
      {showGrant && (
        <div className="fixed inset-0 bg-black/50 z-[400] flex items-center justify-center p-4">
          <div className="bg-bg-surface rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-display font-bold text-text-primary mb-4">Grant VIP Membership</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">User Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-base w-full"
                  placeholder="user@speedbet.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Duration (Days)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="input-base w-full"
                  min={1}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowGrant(false); setEmail('') }} className="btn-primary bg-bg-elevated hover:bg-border flex-1">
                Cancel
              </button>
              <button onClick={handleGrant} className="btn-primary flex-1">
                Grant VIP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Gift Modal */}
      {showGift && (
        <div className="fixed inset-0 bg-black/50 z-[400] flex items-center justify-center p-4">
          <div className="bg-bg-surface rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-display font-bold text-text-primary mb-4">Broadcast Gift to All VIPs</h2>
            <p className="text-text-secondary mb-4">
              This will send a surprise gift to all active VIP members. Choose gift type below.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {['FREE_BET', 'BOOSTED_ODDS', 'DEPOSIT_BONUS', 'CASHBACK_CREDIT'].map(type => (
                <button key={type} className="btn-primary bg-bg-elevated hover:bg-border p-4 rounded-xl">
                  {type.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowGift(false)} className="btn-primary bg-bg-elevated hover:bg-border flex-1">
                Cancel
              </button>
              <button onClick={handleGift} className="btn-primary flex-1">
                Broadcast Gift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Giveaway Draw Modal */}
      {showDraw && (
        <div className="fixed inset-0 bg-black/50 z-[400] flex items-center justify-center p-4">
          <div className="bg-bg-surface rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-display font-bold text-text-primary mb-4">Trigger Giveaway Draw</h2>
            <p className="text-text-secondary mb-6">
              This will randomly select one active VIP as the weekly winner. The winner will be notified automatically.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDraw(false)} className="btn-primary bg-bg-elevated hover:bg-border flex-1">
                Cancel
              </button>
              <button onClick={handleDraw} className="btn-primary flex-1">
                <Trophy size={18} />
                <span>Draw Winner!</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active VIPs */}
      <div className="mb-8">
        <h2 className="text-xl font-display font-semibold text-text-primary mb-4">Active VIPs</h2>
        <div className="bg-bg-surface rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-bg-dark">
              <tr>
                <th className="p-4 text-sm font-medium text-text-secondary">Email</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Expires</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {activeVips.map((vip) => (
                <tr key={vip.id} className="border-t border-color-border">
                  <td className="p-4 text-text-primary">{vip.email}</td>
                  <td className="p-4 text-text-secondary">{vip.expiresAt}</td>
                  <td className="p-4">
                    <span className="badge badge-win">ACTIVE</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expired VIPs */}
      <div className="mb-8">
        <h2 className="text-xl font-display font-semibold text-text-primary mb-4">Expired VIPs</h2>
        <div className="bg-bg-surface rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-bg-dark">
              <tr>
                <th className="p-4 text-sm font-medium text-text-secondary">Email</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Expired</th>
              </tr>
            </thead>
            <tbody>
              {expiredVips.map((vip) => (
                <tr key={vip.id} className="border-t border-color-border">
                  <td className="p-4 text-text-primary">{vip.email}</td>
                  <td className="p-4 text-text-secondary">{vip.expiresAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Giveaway Winners */}
      <div>
        <h2 className="text-xl font-display font-semibold text-text-primary mb-4">Giveaway Winners</h2>
        <div className="bg-bg-surface rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-bg-dark">
              <tr>
                <th className="p-4 text-sm font-medium text-text-secondary">Winner</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Prize</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Date</th>
              </tr>
            </thead>
            <tbody>
              {winners.map((w) => (
                <tr key={w.id} className="border-t border-color-border">
                  <td className="p-4 text-text-primary">{w.email}</td>
                  <td className="p-4 text-brand-green font-mono tabular-nums font-semibold">{w.prize}</td>
                  <td className="p-4 text-text-secondary">{w.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
