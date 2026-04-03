'use client'

import { useState } from 'react'
import { LayoutDashboard, BarChart3, AlertTriangle, FileText, Settings, Shield, Menu, X, ChevronDown, SlidersHorizontal, Activity } from 'lucide-react'
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
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[70] lg:hidden w-12 h-12 bg-white dark:bg-slate-900 rounded-xl border-none shadow-xl transition-all active:scale-95"
      >
        {isOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
      </Button>

      {/* FINSHIELD AI SIDEBAR - BORDERLESS CALIBRATION */}
      <div className={`fixed lg:relative left-0 top-0 h-screen w-64 transition-all duration-500 ease-in-out border-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } z-[60] bg-[#f8fafc] dark:bg-[#0B0F19]/98 flex flex-col font-sans overflow-hidden`}>
        
        {/* LOGO - AS PER SCREENSHOT */}
        <div className="p-10 pb-12 flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-blue-500/5">
                <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex flex-col gap-0.5">
                <h1 className="text-[20px] font-black italic tracking-tighter text-blue-600 dark:text-blue-400">FinShield AI</h1>
                <span className="text-[9px] font-black uppercase text-slate-300 dark:text-slate-700 tracking-[0.4em] leading-none">Security_Core</span>
            </div>
        </div>

        {/* NAVIGATION - AS PER SCREENSHOT */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-12 scrollbar-none">
            <nav className="space-y-1">
                {menuItems.map(item => {
                    const Icon = item.icon
                    const isSelected = activeView === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                onViewChange(item.id)
                                setIsOpen(false)
                            }}
                            className={`w-full group flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-300 ${
                                isSelected 
                                ? 'bg-blue-600 text-white shadow-[0_20px_40px_rgba(37,99,235,0.2)]' 
                                : 'text-slate-400 dark:text-slate-600 hover:bg-white dark:hover:bg-slate-900/50 hover:text-slate-950 dark:hover:text-white'
                            }`}
                        >
                            <Icon className={`w-4.5 h-4.5 ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-blue-600 transition-colors'}`} />
                            <span className="text-[13px] font-black uppercase tracking-widest leading-none">{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            {/* FILTERS - SCREENSHOT PERFECT DROPDOWNS */}
            <div className="pt-10 border-t border-slate-100 dark:border-slate-900 space-y-8">
                <div className="flex items-center gap-2 px-4 opacity-40">
                    <SlidersHorizontal className="w-3 h-3 text-slate-400" />
                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-700 leading-none">Filters</span>
                </div>

                <div className="space-y-8 px-1">
                    {[
                        { label: 'Time Range', value: filters?.timeRange || 'Last 24 Hours', key: 'timeRange', options: ['Last 1 Hour', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days'] },
                        { label: 'Risk Level', value: filters?.riskLevel || 'All Levels', key: 'riskLevel', options: ['All Levels', 'Critical', 'High', 'Medium', 'Low'] },
                        { label: 'Status', value: filters?.status || 'All', key: 'status', options: ['All', 'Interdicted', 'Allowed', 'Investigating'] }
                    ].map((filter) => (
                        <div key={filter.key} className="space-y-4 relative group">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600 ml-4 group-hover:text-blue-500 transition-colors">{filter.label}</label>
                            <div className="relative">
                                <select 
                                    value={filter.value}
                                    onChange={(e) => onFilterChange?.({ [filter.key]: e.target.value })}
                                    className="w-full appearance-none px-6 py-5 text-[11px] font-black uppercase border-none rounded-2xl bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-400 focus:ring-2 focus:ring-blue-600/10 transition-all cursor-pointer shadow-sm pr-12"
                                >
                                    {filter.options.map(opt => <option key={opt}>{opt}</option>)}
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-700 pointer-events-none group-hover:text-blue-600 transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* FOOTER */}
        <div className="p-10 border-t border-slate-100 dark:border-slate-900 opacity-20 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Activity className="w-3 h-3 text-blue-600 animate-pulse" />
            <span className="text-[9px] font-black uppercase text-slate-950 dark:text-white tracking-[0.4em]">FinShield_v4.0.2</span>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/10 z-50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
