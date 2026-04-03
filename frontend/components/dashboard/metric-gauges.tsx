'use client'

import { useState, useEffect } from 'react'

interface MetricGaugesProps {
  filters?: { timeRange: string; riskLevel: string; status: string }
}

export default function MetricGauges({ filters }: MetricGaugesProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [filters])

  const gauges = [
    {
      label: 'Detection Accuracy',
      value: 94.2,
      color: 'from-blue-500 to-blue-600',
      status: 'Excellent'
    },
    {
      label: 'System Uptime',
      value: 99.9,
      color: 'from-green-500 to-green-600',
      status: 'Optimal'
    },
    {
      label: 'False Positive Rate',
      value: 5.8,
      max: 100,
      inverse: true,
      color: 'from-amber-500 to-amber-600',
      status: 'Low'
    },
    {
      label: 'Mitigation Speed',
      value: 87.3,
      color: 'from-purple-500 to-purple-600',
      status: 'Fast'
    }
  ]

  if (!mounted) {
    return <div className="h-96 bg-gray-50 rounded-lg animate-pulse" />
  }

  const getGradientColors = (colorClass: string) => {
    const colorMap: { [key: string]: { from: string; to: string } } = {
      'from-blue-500 to-blue-600': { from: '#3b82f6', to: '#2563eb' },
      'from-green-500 to-green-600': { from: '#10b981', to: '#059669' },
      'from-amber-500 to-amber-600': { from: '#f59e0b', to: '#d97706' },
      'from-purple-500 to-purple-600': { from: '#a855f7', to: '#9333ea' },
    }
    return colorMap[colorClass] || { from: '#3b82f6', to: '#2563eb' }
  }

  const Gauge = ({ label, value, color, status, max = 100, inverse = false }: any) => {
    const displayValue = inverse ? max - value : value
    const percentage = (displayValue / max) * 100
    const gradientColors = getGradientColors(color)
    const gaugeId = label.replace(/\s+/g, '-')
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <svg viewBox="0 0 100 60" className="w-full h-full">
            <defs>
              <linearGradient id={`gauge-${gaugeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={gradientColors.from} />
                <stop offset="100%" stopColor={gradientColors.to} />
              </linearGradient>
            </defs>
            {/* Background arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
              strokeLinecap="round"
            />
            
            {/* Progress arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke={`url(#gauge-${gaugeId})`}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(percentage / 100) * 251} 251`}
            />
          </svg>
          
          {/* Center value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{displayValue.toFixed(1)}</span>
            <span className="text-xs text-gray-500">{inverse ? 'Low' : 'High'}</span>
          </div>
        </div>
        
        <p className="text-sm font-semibold text-gray-900 text-center mb-1">{label}</p>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
          {status}
        </span>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Performance Metrics</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {gauges.map((gauge) => (
          <Gauge
            key={gauge.label}
            label={gauge.label}
            value={gauge.value}
            color={gauge.color}
            status={gauge.status}
            max={gauge.max}
            inverse={gauge.inverse}
          />
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">24h Threats</p>
          <p className="text-xl font-bold text-gray-900">2,847</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">Blocked Rate</p>
          <p className="text-xl font-bold text-red-600">66%</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">Avg Response</p>
          <p className="text-xl font-bold text-blue-600">142ms</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">Active Rules</p>
          <p className="text-xl font-bold text-purple-600">847</p>
        </div>
      </div>
    </div>
  )
}
