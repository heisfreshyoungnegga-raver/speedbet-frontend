import { useState } from 'react'
import { Gift, CheckCircle, Clock } from 'lucide-react'

interface VipGift {
  id: string
  type: 'FREE_BET' | 'BOOSTED_ODDS' | 'DEPOSIT_BONUS' | 'CASHBACK_CREDIT' | 'ENTRY_TICKET'
  value: number
  expires_at: string
}

// Mock data
const MOCK_GIFTS: VipGift[] = [
  { id: '1', type: 'FREE_BET', value: 50, expires_at: '2026-05-01T00:00:00Z' },
  { id: '2', type: 'BOOSTED_ODDS', value: 2.00, expires_at: '2026-05-01T00:00:00Z' },
  { id: '3', type: 'DEPOSIT_BONUS', value: 100, expires_at: '2026-05-03T00:00:00Z' },
  { id: '4', type: 'ENTRY_TICKET', value: 1, expires_at: '2026-05-01T00:00:00Z' },
]

export default function VipGiftsPage() {
  const [gifts] = useState<VipGift[]>(MOCK_GIFTS)

  const getGiftLabel = (type: string) => {
    switch (type) {
      case 'FREE_BET': return 'Free Bet'
      case 'BOOSTED_ODDS': return 'Boosted Odds'
      case 'DEPOSIT_BONUS': return 'Deposit Bonus'
      case 'CASHBACK_CREDIT': return 'Cashback Credit'
      case 'ENTRY_TICKET': return 'Entry Ticket'
      default: return type
    }
  }

  const handleRedeem = (gift: VipGift) => {
    alert(`Redeemed: ${getGiftLabel(gift.type)} worth ₵{gift.value}`)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
          VIP Gifts
        </h1>
        <p className="text-text-secondary">
          Surprise gifts delivered every Monday
        </p>
      </div>

      {gifts.length === 0 ? (
        <div className="bg-bg-surface rounded-2xl p-12 text-center">
          <Gift size={48} className="text-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
            No Active Gifts
          </h3>
          <p className="text-text-secondary">
            Check back every Monday for new surprise gifts!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gifts.map((gift) => (
            <div key={gift.id} className="bg-bg-surface rounded-xl p-6 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <Gift size={24} className="text-brand-gold" />
                <div>
                  <h3 className="text-lg font-display font-semibold text-text-primary">
                    {getGiftLabel(gift.type)}
                  </h3>
                  <p className="text-sm text-text-muted">
                    Expires: {new Date(gift.expires_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-display font-bold text-brand-green tabular-nums">
                  ₵{gift.value.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => handleRedeem(gift)}
                className="btn-primary w-full"
              >
                <CheckCircle size={18} />
                <span>Redeem</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Past Gifts */}
      <div className="mt-12">
        <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
          Past Gifts
        </h2>
        <div className="bg-bg-surface rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-bg-dark">
              <tr>
                <th className="p-4 text-sm font-medium text-text-secondary">Type</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Value</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Expired</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-color-border">
                <td className="p-4 text-text-primary">Free Bet</td>
                <td className="p-4 text-brand-green font-mono tabular-nums font-semibold">₵25</td>
                <td className="p-4 text-text-secondary">2026-04-15</td>
              </tr>
              <tr className="border-t border-color-border">
                <td className="p-4 text-text-primary">Boosted Odds</td>
                <td className="p-4 text-brand-gold font-mono tabular-nums font-semibold">1.5x</td>
                <td className="p-4 text-text-secondary">2026-04-15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
