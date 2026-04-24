import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Settings, Users, DollarSign, Brain, FileText, Trophy, Crown } from 'lucide-react'

export default function SuperAdminPage() {
  const location = useLocation()
  const currentPath = location.pathname

  const navItems = [
    { path: '', label: 'Dashboard', icon: Settings },
    { path: '/admins', label: 'Admins', icon: Users },
    { path: '/payouts', label: 'Payouts', icon: DollarSign },
    { path: '/predictions', label: 'Predictions', icon: Brain },
    { path: '/audit', label: 'Audit Log', icon: FileText },
    { path: '/vip', label: 'VIP Mgmt', icon: Trophy },
    { path: '/config', label: 'Platform Config', icon: Crown },
  ]

  return (
    <div className="flex min-h-screen bg-bg-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-bg-surface border-r border-color-border p-4 hidden md:flex flex-col">
        <div className="text-2xl font-display font-bold text-brand-green mb-8">
          SPEEDBET
          <span className="text-sm font-body text-text-secondary block">Super Admin</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === `/{import.meta.env.VITE_SUPER_ADMIN_PATH || '/x-control-9f3a2b'}{item.path}`
            return (
              <Link
                key={item.path}
                to={`${import.meta.env.VITE_SUPER_ADMIN_PATH || '/x-control-9f3a2b'}${item.path}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-brand-green/20 text-brand-green'
                    : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <Link
          to="/"
          className="flex items-center gap-2 text-text-secondary hover:text-brand-green transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Site</span>
        </Link>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
