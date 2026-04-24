import { useState } from 'react'
import { Crown, Gift, Trophy, Calendar, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function VipLandingPage() {
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(false)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)

  // Mock data
  const isVipActive = true
  const vipPrice = 250
  const vipCurrency = 'GHS'
  const vipDays = 30

  const handleSubscribe = () => {
    // Mock subscribe - in real app this would call API
    alert(`VIP subscription initiated for ${vipPrice} ${vipCurrency}`)
    setIsActive(true)
    const expiry = new Date()
    expiry.setDate(expiry.getDate() + vipDays)
    setExpiresAt(expiry.toISOString())
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
          VIP Club
        </h1>
        <p className="text-text-secondary">
          Exclusive benefits for our most valued members
        </p>
      </div>

      {/* Status Card */}
      <div className={`bg-bg-surface rounded-2xl p-6 mb-8 border ${isVipActive ? 'border-brand-green' : 'border-color-border'}`}>
        <div className="flex items-center gap-4 mb-4">
          <Crown size={32} className={isVipActive ? 'text-brand-green' : 'text-text-muted'} />
          <div>
            <h2 className="text-xl font-display font-semibold text-text-primary">
              {isVipActive ? 'VIP Active' : 'Become a VIP'}
            </h2>
            {isVipActive && expiresAt && (
              <p className="text-sm text-text-secondary">
                Expires: {new Date(expiresAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {!isVipActive ? (
          <div>
            <p className="text-text-secondary mb-4">
              Get access to exclusive benefits for just{' '}
              <span className="text-brand-green font-bold text-xl tabular-nums">₵{vipPrice}</span>
              {' '}{vipCurrency} / {vipDays} days
            </p>
            <button onClick={handleSubscribe} className="btn-primary">
              <Crown size={18} />
              <span>Subscribe Now</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-brand-green" />
            <span className="text-brand-green font-medium">VIP Active</span>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-bg-surface rounded-xl p-6 card-hover">
          <div className="flex items-center gap-3 mb-4">
            <Gift size={24} className="text-brand-green" />
            <h3 className="text-lg font-display font-semibold text-text-primary">Accumulator Cashback</h3>
          </div>
          <p className="text-text-secondary">
            Lose by one on 10+ selection accumulators and get your stake back!
          </p>
          <div className="mt-4 text-sm text-text-muted">
            Requires VIP at time of bet placement
          </div>
        </div>

        <div className="bg-bg-surface rounded-xl p-6 card-hover">
          <div className="flex items-center gap-3 mb-4">
            <Trophy size={24} className="text-brand-green" />
            <h3 className="text-lg font-display font-semibold text-text-primary">Weekly Prize Draw</h3>
          </div>
          <p className="text-text-secondary">
            Automatic entry into Sunday 20:00 UTC prize giveaway
          </p>
          <div className="mt-4 text-sm text-text-muted">
            Sunday 20:00 UTC every week
          </div>
        </div>

        <div className="bg-bg-surface rounded-xl p-6 card-hover">
          <div className="flex items-center gap-3 mb-4">
            <Gift size={24} className="text-brand-gold" />
            <h3 className="text-lg font-display font-semibold text-text-primary">Weekly Surprise Gifts</h3>
          </div>
          <p className="text-text-secondary">
            Monday surprise gifts: FREE_BET, BOOSTED_ODDS, DEPOSIT_BONUS, CASHBACK_CREDIT
          </p>
          <div className="mt-4 text-sm text-text-muted">
            Every Monday at 08:00 UTC
          </div>
        </div>

        <div className="bg-bg-surface rounded-xl p-6 card-hover">
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={24} className="text-brand-green" />
            <h3 className="text-lg font-display font-semibold text-text-primary">Live Match Coverage</h3>
          </div>
          <p className="text-text-secondary">
            Watch live video streams embedded in match detail pages
          </p>
          <div className="mt-4 text-sm text-text-muted">
            Exclusive to VIP members
          </div>
        </div>

        <div className="bg-bg-surface rounded-xl p-6 card-hover">
          <div className="flex items-center gap-3 mb-4">
            <Trophy size={24} className="text-brand-gold" />
            <h3 className="text-lg font-display font-semibold text-text-primary">Exclusive Games</h3>
          </div>
          <p className="text-text-secondary">
            VIP-only game variants: Jackpot Spin, High-Stakes Dice, Aviator Pro
          </p>
          <div className="mt-4 text-sm text-text-muted">
            Higher stakes, bigger wins
          </div>
        </div>

        <div className="bg-bg-surface rounded-xl p-6 card-hover">
          <div className="flex items-center gap-3 mb-4">
            <Trophy size={24} className="text-brand-green" />
            <h3 className="text-lg font-display font-semibold text-text-primary">Competitions</h3>
          </div>
          <p className="text-text-secondary">
            Weekly leaderboard, prediction league, biggest odds club
          </p>
          <div className="mt-4 text-sm text-text-muted">
            Compete for extra prizes
          </div>
        </div>
      </div>

      {/* CTA */}
      {!isVipActive && (
        <div className="bg-bg-surface rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
            Ready to upgrade?
          </h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Join VIP today and get instant access to all exclusive benefits.
            Your membership will be active for {vipDays} days.
          </p>
          <button onClick={handleSubscribe} className="btn-primary text-lg px-8 py-4">
            <Crown size={20} />
            <span>Subscribe for ₵{ vipPrice}</span>
          </button>
        </div>
      )}
    </div>
  )
}
