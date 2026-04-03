'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface ThreatWaterfallProps {
  filters?: { timeRange: string; riskLevel: string; status: string }
}

export default function ThreatWaterfall({ filters }: ThreatWaterfallProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [filters])

  const waterfallData = [
    { name: 'Total Detected', value: 5000, fill: '#3b82f6' },
    { name: 'False Positives', value: -280, fill: '#10b981' },
    { name: 'Real Threats', value: 4720, fill: '#8b5cf6' },
    { name: 'Blocked', value: 3304, fill: '#ef4444' },
    { name: 'Challenged', value: 944, fill: '#f59e0b' },
    { name: 'Allowed (Safe)', value: 472, fill: '#10b981' },
  ]

  if (!mounted) {
    return <div className="h-96 bg-gray-50 rounded-lg animate-pulse" />
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Threat Breakdown & Resolution</h3>
      <p className="text-sm text-gray-600 mb-6">Waterfall analysis of detected threats through mitigation pipeline</p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              color: '#1f2937'
            }}
            formatter={(value: number) => [Math.abs(value).toLocaleString(), 'Count']}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {waterfallData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <p className="text-xs text-gray-600 uppercase tracking-wide">Detected Threats</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">5,000</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
          <p className="text-xs text-gray-600 uppercase tracking-wide">Blocked</p>
          <p className="text-2xl font-bold text-red-600 mt-1">3,304</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
          <p className="text-xs text-gray-600 uppercase tracking-wide">Challenged</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">944</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <p className="text-xs text-gray-600 uppercase tracking-wide">Allowed Safe</p>
          <p className="text-2xl font-bold text-green-600 mt-1">472</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <p className="text-xs text-gray-600 uppercase tracking-wide">Real Threats</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">4,720</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
          <p className="text-xs text-gray-600 uppercase tracking-wide">False Positives</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">280</p>
        </div>
      </div>
    </div>
  )
}
