'use client'

import { useState, useCallback, useEffect } from 'react'
import Sidebar from '@/components/dashboard/sidebar'
import Header from '@/components/dashboard/header'
import KPICards from '@/components/dashboard/kpi-cards'
import TrafficHeatmap from '@/components/dashboard/traffic-heatmap'
import MitigationFunnel from '@/components/dashboard/mitigation-funnel'
import RiskScatter from '@/components/dashboard/risk-scatter'
import ThreatWaterfall from '@/components/dashboard/threat-waterfall'
import MetricGauges from '@/components/dashboard/metric-gauges'
import ThreatFeed from '@/components/dashboard/threat-feed'
import AttackingIPs from '@/components/dashboard/attacking-ips'
import TrafficTimeline from '@/components/dashboard/traffic-timeline'
import DetectionAccuracy from '@/components/dashboard/detection-accuracy'
import { useToast } from '@/hooks/use-toast'
import { useBiometrics } from '@/hooks/use-biometrics'
import { useRouter } from 'next/navigation'

export interface FilterState {
  timeRange: string
  riskLevel: string
  status: string
}

export default function Home() {
  const router = useRouter()
  const { metrics: biometrics } = useBiometrics()

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated')
    if (auth !== 'true') {
      router.replace('/login')
    }
  }, [router])

  const [activeView, setActiveView] = useState('dashboard')
  const [attackSimulated, setAttackSimulated] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    timeRange: 'Last 24 Hours',
    riskLevel: 'All Levels',
    status: 'All'
  })
  const { toast } = useToast()

  const handleSimulateAttack = useCallback(() => {
    setAttackSimulated(true)
    toast({
      title: 'Attack Simulation Started',
      description: 'High-velocity credential stuffing attack detected',
      variant: 'destructive',
    })
    setTimeout(() => setAttackSimulated(false), 8000)
  }, [toast])

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Sidebar - Hidden on mobile, shown on tablet+ */}
      <div className="hidden lg:block">
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onSimulateAttack={handleSimulateAttack} biometrics={biometrics} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full">
            {/* Dashboard View */}
            {activeView === 'dashboard' && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in">
                <div className="animate-slide-down">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 gradient-text">Dashboard Overview</h2>
                  <KPICards />
                </div>

                {/* Attacking IPs Alert */}
                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Active Threats</h3>
                  <AttackingIPs filters={filters} isUnderAttack={attackSimulated} />
                </div>

                {/* Traffic Timeline */}
                <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <TrafficTimeline filters={filters} isUnderAttack={attackSimulated} />
                </div>

                {/* Charts Grid - Responsive 1 col mobile, 2 col tablet+, 2 col desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <TrafficHeatmap filters={filters} isUnderAttack={attackSimulated} />
                  </div>
                  <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <MitigationFunnel filters={filters} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
                    <RiskScatter filters={filters} isUnderAttack={attackSimulated} />
                  </div>
                  <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
                    <ThreatWaterfall filters={filters} />
                  </div>
                </div>

                {/* Gauges */}
                <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
                  <MetricGauges filters={filters} />
                </div>

                {/* Threat Feed */}
                <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Recent Threats</h3>
                  <ThreatFeed filters={filters} isUnderAttack={attackSimulated} />
                </div>
              </div>
            )}

            {/* Analytics View */}
            {activeView === 'analytics' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
                <TrafficTimeline filters={filters} isUnderAttack={attackSimulated} />
                <DetectionAccuracy filters={filters} />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <TrafficHeatmap filters={filters} isUnderAttack={attackSimulated} />
                  <RiskScatter filters={filters} isUnderAttack={attackSimulated} />
                </div>
                <ThreatWaterfall filters={filters} />
              </div>
            )}

            {/* Threats View */}
            {activeView === 'threats' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Threat Analysis</h2>
                <AttackingIPs filters={filters} isUnderAttack={attackSimulated} />
                <MitigationFunnel filters={filters} />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <RiskScatter filters={filters} isUnderAttack={attackSimulated} />
                  <ThreatWaterfall filters={filters} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Threat Feed</h2>
                  <ThreatFeed filters={filters} isUnderAttack={attackSimulated} />
                </div>
              </div>
            )}

            {/* Reports View */}
            {activeView === 'reports' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Security Reports</h2>
                <DetectionAccuracy filters={filters} />
                <MetricGauges filters={filters} />
                <ThreatWaterfall filters={filters} />
              </div>
            )}

            {/* Settings View */}
            {activeView === 'settings' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Settings & Configuration</h2>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-gray-600">Settings configuration coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
