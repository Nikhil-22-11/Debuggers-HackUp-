'use client'

import { useState } from 'react'
import { Menu, X, LayoutDashboard, BarChart3, AlertTriangle, FileText, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  filters?: { timeRange: string; riskLevel: string; status: string }
  onFilterChange?: (filters: Partial<{ timeRange: string; riskLevel: string; status: string }>) => void
}

export default function Sidebar({ activeView, onViewChange, filters, onFilterChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'threats', label: 'Threats', icon: AlertTriangle },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <div className={`fixed lg:relative left-0 top-0 h-screen w-60 sm:w-64 glass-effect border-r border-gray-200 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } z-40 overflow-y-auto`}>
        <div className="p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 sm:mb-8">AABE</h1>
          
          {/* Navigation */}
          <nav className="space-y-2 mb-8">
            {menuItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    activeView === item.id
                      ? 'bg-primary text-white'
                      : 'text-sidebar-foreground hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Filters Section */}
          <div className="border-t border-sidebar-border pt-6">
            <h3 className="text-xs font-semibold text-sidebar-foreground uppercase mb-4">Filters</h3>
            
            <div className="space-y-4">
              {/* Time Range */}
              <div>
                <label className="block text-xs font-medium text-sidebar-foreground mb-2">
                  Time Range
                </label>
                <select 
                  value={filters?.timeRange || 'Last 24 Hours'}
                  onChange={(e) => onFilterChange?.({ timeRange: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-sidebar-border rounded-lg bg-white text-foreground"
                >
                  <option>Last 1 Hour</option>
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>

              {/* Risk Level */}
              <div>
                <label className="block text-xs font-medium text-sidebar-foreground mb-2">
                  Risk Level
                </label>
                <select 
                  value={filters?.riskLevel || 'All Levels'}
                  onChange={(e) => onFilterChange?.({ riskLevel: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-sidebar-border rounded-lg bg-white text-foreground"
                >
                  <option>All Levels</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-medium text-sidebar-foreground mb-2">
                  Status
                </label>
                <select 
                  value={filters?.status || 'All'}
                  onChange={(e) => onFilterChange?.({ status: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-sidebar-border rounded-lg bg-white text-foreground"
                >
                  <option>All</option>
                  <option>Blocked</option>
                  <option>MFA Triggered</option>
                  <option>CAPTCHA</option>
                  <option>Allowed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Chart Options */}
          <div className="border-t border-sidebar-border pt-6 mt-6">
            <h3 className="text-xs font-semibold text-sidebar-foreground uppercase mb-4">Chart View</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-sidebar-foreground">Traffic Heatmap</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-sidebar-foreground">Mitigation Funnel</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-sidebar-foreground">Risk Scatter</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-sidebar-foreground">Threat Waterfall</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
