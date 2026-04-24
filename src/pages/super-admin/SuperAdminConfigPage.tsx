import { useState } from 'react'
import { Save, RotateCcw } from 'lucide-react'
import { toast } from 'react-toastify'

// Mock platform config (from SpeedBet Spec Part 4 + 14)
const DEFAULT_CONFIG = {
  MIN_DEPOSIT_AMOUNT: 300,
  MIN_DEPOSIT_CURRENCY: 'GHS',
  ADMIN_COMMISSION_PERCENT: 10,
  PAYOUT_DAY_OF_WEEK: 'FRIDAY',
  VIP_MEMBERSHIP_PRICE: 250,
  VIP_MEMBERSHIP_CURRENCY: 'GHS',
  VIP_MEMBERSHIP_DAYS: 30,
  VIP_CASHBACK_MIN_SELECTIONS: 10,
  VIP_CASHBACK_PERCENT: 100,
  VIP_CASHBACK_MIN_STAKE: 10,
  VIP_CASHBACK_WEEKLY_CAP: 1000,
  SUPER_ADMIN_PATH: '/x-control-9f3a2b',
}

export default function SuperAdminConfigPage() {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // Mock save - in real app this would be an API call
    console.log('Saving platform config:', config)
    setSaved(true)
    toast.success('Platform configuration saved!')
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG)
    toast.info('Configuration reset to defaults')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
          Platform Configuration
        </h1>
        <p className="text-text-secondary">
          Configure global platform settings. Changes affect all users, admins, and systems.
        </p>
      </div>

      <div className="space-y-6">
        {/* Deposit Settings */}
        <div className="bg-bg-surface rounded-xl p-6">
          <h2 className="text-xl font-display font-semibold text-text-primary mb-4">
            Deposit Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Minimum Deposit Amount
              </label>
              <input
                type="number"
                value={config.MIN_DEPOSIT_AMOUNT}
                onChange={(e) => setConfig({ ...config, MIN_DEPOSIT_AMOUNT: Number(e.target.value) })}
                className="input-base w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Currency
              </label>
              <select
                value={config.MIN_DEPOSIT_CURRENCY}
                onChange={(e) => setConfig({ ...config, MIN_DEPOSIT_CURRENCY: e.target.value })}
                className="input-base w-full"
              >
                <option value="GHS">GHS (Ghana Cedi)</option>
                <option value="NGN">NGN (Naira)</option>
                <option value="USD">USD (US Dollar)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Admin Settings */}
        <div className="bg-bg-surface rounded-xl p-6">
          <h2 className="text-xl font-display font-semibold text-text-primary mb-4">
            Admin Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Default Commission Percent (1-20%)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={config.ADMIN_COMMISSION_PERCENT}
                onChange={(e) => setConfig({ ...config, ADMIN_COMMISSION_PERCENT: Number(e.target.value) })}
                className="input-base w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Payout Day of Week
              </label>
              <select
                value={config.PAYOUT_DAY_OF_WEEK}
                onChange={(e) => setConfig({ ...config, PAYOUT_DAY_OF_WEEK: e.target.value })}
                className="input-base w-full"
              >
                <option value="MONDAY">Monday</option>
                <option value="TUESDAY">Tuesday</option>
                <option value="WEDNESDAY">Wednesday</option>
                <option value="THURSDAY">Thursday</option>
                <option value="FRIDAY">Friday</option>
                <option value="SATURDAY">Saturday</option>
                <option value="SUNDAY">Sunday</option>
              </select>
            </div>
          </div>
        </div>

        {/* VIP Settings */}
        <div className="bg-bg-surface rounded-xl p-6">
          <h2 className="text-xl font-display font-semibold text-text-primary mb-4">
            VIP Membership Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Price (GHS)
              </label>
              <input
                type="number"
                value={config.VIP_MEMBERSHIP_PRICE}
                onChange={(e) => setConfig({ ...config, VIP_MEMBERSHIP_PRICE: Number(e.target.value) })}
                className="input-base w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Currency
              </label>
              <select
                value={config.VIP_MEMBERSHIP_CURRENCY}
                onChange={(e) => setConfig({ ...config, VIP_MEMBERSHIP_CURRENCY: e.target.value })}
                className="input-base w-full"
              >
                <option value="GHS">GHS</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Duration (Days)
              </label>
              <input
                type="number"
                value={config.VIP_MEMBERSHIP_DAYS}
                onChange={(e) => setConfig({ ...config, VIP_MEMBERSHIP_DAYS: Number(e.target.value) })}
                className="input-base w-full"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-text-primary mb-4">Cashback Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Min Selections
              </label>
              <input
                type="number"
                value={config.VIP_CASHBACK_MIN_SELECTIONS}
                onChange={(e) => setConfig({ ...config, VIP_CASHBACK_MIN_SELECTIONS: Number(e.target.value) })}
                className="input-base w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Cashback Percent (%)
              </label>
              <input
                type="number"
                value={config.VIP_CASHBACK_PERCENT}
                onChange={(e) => setConfig({ ...config, VIP_CASHBACK_PERCENT: Number(e.target.value) })}
                className="input-base w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Min Stake (GHS)
              </label>
              <input
                type="number"
                value={config.VIP_CASHBACK_MIN_STAKE}
                onChange={(e) => setConfig({ ...config, VIP_CASHBACK_MIN_STAKE: Number(e.target.value) })}
                className="input-base w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Weekly Cap (GHS)
              </label>
              <input
                type="number"
                value={config.VIP_CASHBACK_WEEKLY_CAP}
                onChange={(e) => setConfig({ ...config, VIP_CASHBACK_WEEKLY_CAP: Number(e.target.value) })}
                className="input-base w-full"
              />
            </div>
          </div>
        </div>

        {/* Super Admin Path */}
        <div className="bg-bg-surface rounded-xl p-6">
          <h2 className="text-xl font-display font-semibold text-text-primary mb-4">
            Security Settings
          </h2>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Super Admin Path (NEVER shown in UI)
            </label>
            <input
              type="text"
              value={config.SUPER_ADMIN_PATH}
              onChange={(e) => setConfig({ ...config, SUPER_ADMIN_PATH: e.target.value })}
              className="input-base w-full font-mono"
            />
            <p className="text-xs text-text-muted mt-2">
              This path is NEVER linked in any navigation. Only distributed by the developer.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-6 border-t border-color-border">
          <button onClick={handleSave} className="btn-primary">
            <Save size={18} />
            <span>Save Configuration</span>
            {saved && <span className="text-sm">(Saved!)</span>}
          </button>
          <button onClick={handleReset} className="btn-primary bg-bg-elevated hover:bg-border">
            <RotateCcw size={18} />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>
    </div>
  )
}
