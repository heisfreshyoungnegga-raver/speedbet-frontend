import { useState } from 'react'
import { FileText, Download, Filter, XCircle } from 'lucide-react'

interface AuditEntry {
  timestamp: string
  actor: string
  action: string
  details: string
  ip_address: string
}

// Mock audit log
const MOCK_AUDIT: AuditEntry[] = [
  { timestamp: '2026-04-23T10:15:30Z', actor: 'admin1@speedbet.com', action: 'CREATE_BOOKING_CODE', details: 'Created MIXED_ACCUMULATOR code SPD7K3XQ', ip_address: '192.168.1.100' },
  { timestamp: '2026-04-23T10:20:45Z', actor: 'admin2@speedbet.com', action: 'PUBLISH_PREDICTION', details: 'Published prediction for Arsenal vs Chelsea', ip_address: '192.168.1.101' },
  { timestamp: '2026-04-23T10:30:12Z', actor: 'super@speedbet.com', action: 'APPROVE_PAYOUT', details: 'Approved payout for admin1; amount ₵1250', ip_address: '10.0.0.1' },
  { timestamp: '2026-04-23T11:05:22Z', actor: 'admin1@speedbet.com', action: 'SET_CUSTOM_GAME_RESULT', details: 'Set result for Special Match: Home 2 - Away 1', ip_address: '192.168.1.100' },
  { timestamp: '2026-04-23T11:30:00Z', actor: 'super@speedbet.com', action: 'GRANT_VIP', details: 'Manually granted VIP to user_userabc123', ip_address: '10.0.0.1' },
]

export default function SuperAdminAuditPage() {
  const [entries] = useState<AuditEntry[]>(MOCK_AUDIT)
  const [filterActor, setFilterActor] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [showRaw, setShowRaw] = useState<string | null>(null)

  const filtered = entries.filter((e) => {
    if (filterActor && !e.actor.includes(filterActor)) return false
    if (filterAction && !e.action.includes(filterAction)) return false
    return true
  })

  const handleExport = () => {
    const csv = [
      'Timestamp,Actor,Action,Details,IP Address',
      ...filtered.map((e) => `${e.timestamp},${e.actor},${e.action},"${e.details}",${e.ip_address}`)
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${Date.now()}.csv`
    a.click()
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Audit Log</h1>
          <p className="text-text-secondary">Full audit trail of all admin actions</p>
        </div>
        <button onClick={handleExport} className="btn-primary">
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Filter by Actor</label>
          <input
            type="text"
            value={filterActor}
            onChange={(e) => setFilterActor(e.target.value)}
            className="input-base w-full"
            placeholder="admin@speedbet.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Filter by Action</label>
          <input
            type="text"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="input-base w-full"
            placeholder="CREATE_BOOKING_CODE"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => { setFilterActor(''); setFilterAction('') }}
            className="btn-primary bg-bg-elevated hover:bg-border w-full"
          >
            <XCircle size={18} />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-bg-surface rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-bg-dark">
            <tr>
              <th className="p-4 text-sm font-medium text-text-secondary">Timestamp</th>
              <th className="p-4 text-sm font-medium text-text-secondary">Actor</th>
              <th className="p-4 text-sm font-medium text-text-secondary">Action</th>
              <th className="p-4 text-sm font-medium text-text-secondary">Details</th>
              <th className="p-4 text-sm font-medium text-text-secondary">IP</th>
              <th className="p-4 text-sm font-medium text-text-secondary">JSON</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, i) => (
              <tr key={i} className="border-t border-color-border">
                <td className="p-4 text-text-secondary text-sm">{new Date(entry.timestamp).toLocaleString()}</td>
                <td className="p-4 text-text-primary text-sm">{entry.actor}</td>
                <td className="p-4">
                  <span className="badge badge-live">{entry.action}</span>
                </td>
                <td className="p-4 text-text-secondary text-sm max-w-xs truncate">{entry.details}</td>
                <td className="p-4 text-text-muted text-sm font-mono">{entry.ip_address}</td>
                <td className="p-4">
                  <button
                    onClick={() => setShowRaw(showRaw === entry.timestamp ? null : entry.timestamp)}
                    className="text-brand-green hover:underline text-sm"
                  >
                    <FileText size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Raw JSON Modal */}
      {showRaw && (
        <div className="fixed inset-0 bg-black/50 z-[400] flex items-center justify-center p-4">
          <div className="bg-bg-surface rounded-2xl p-6 w-full max-w-2xl">
            <h3 className="text-lg font-bold text-text-primary mb-4">Raw JSON</h3>
            <pre className="bg-bg-dark rounded-xl p-4 text-sm text-text-secondary overflow-auto max-h-96">
              {JSON.stringify(filtered.find((e) => e.timestamp === showRaw), null, 2)}
            </pre>
            <button
              onClick={() => setShowRaw(null)}
              className="btn-primary mt-4 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
