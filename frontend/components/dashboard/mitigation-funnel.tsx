'use client'

import { useState, useEffect } from 'react'

interface MitigationFunnelProps {
  filters?: { timeRange: string; riskLevel: string; status: string }
}

export default function MitigationFunnel({ filters }: MitigationFunnelProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [filters])

  const funnelData = [
    { stage: 'Initial Requests', count: 10000, color: 'bg-blue-500', percentage: 100 },
    { stage: 'Anomaly Detected', count: 3500, color: 'bg-yellow-500', percentage: 35 },
    { stage: 'Challenge Issued', count: 2100, color: 'bg-orange-500', percentage: 21 },
    { stage: 'Verified Human', count: 1680, color: 'bg-green-500', percentage: 16.8 },
    { stage: 'Permanently Blocked', count: 1400, color: 'bg-red-500', percentage: 14 },
  ]

  if (!mounted) return <div className="h-96 bg-gray-50 rounded-lg animate-pulse" />

  const maxWidth = 100
  const maxCount = funnelData[0].count

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Threat Mitigation Funnel</h3>
      <p className="text-sm text-gray-600 mb-8">Flow of requests through detection and mitigation stages</p>

      <div className="space-y-6">
        {funnelData.map((item, idx) => {
          const width = (item.count / maxCount) * maxWidth
          return (
            <div key={idx} className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item.stage}</span>
                <span className="text-sm font-semibold text-gray-900">{item.count.toLocaleString()} ({item.percentage}%)</span>
              </div>
              <div className="h-12 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className={`h-full ${item.color} flex items-center justify-end pr-4 transition-all duration-300`}
                  style={{ width: `${width}%` }}
                >
                  <span className="text-xs font-bold text-white">
                    {width > 15 && Math.round(item.percentage)}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">10K</p>
            <p className="text-xs text-gray-600">Total Requests</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">1.7K</p>
            <p className="text-xs text-gray-600">Verified</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">1.4K</p>
            <p className="text-xs text-gray-600">Blocked</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">6.9K</p>
            <p className="text-xs text-gray-600">Challenged</p>
          </div>
        </div>
      </div>
    </div>
  )
}
