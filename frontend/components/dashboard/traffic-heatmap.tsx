'use client'

import { useState, useEffect } from 'react'

interface TrafficHeatmapProps {
  filters?: { timeRange: string; riskLevel: string; status: string }
  isUnderAttack?: boolean
}

export default function TrafficHeatmap({ filters, isUnderAttack }: TrafficHeatmapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [filters, isUnderAttack])

  // Generate heatmap data - 7 days x 24 hours
  const generateHeatmapData = () => {
    const data = []
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const intensity = Math.random() * 100
        const isBotTraffic = Math.random() > 0.7
        
        data.push({
          day: days[day],
          hour: `${hour.toString().padStart(2, '0')}:00`,
          intensity,
          isBotTraffic,
        })
      }
    }
    return data
  }

  const heatmapData = generateHeatmapData()
  
  if (!mounted) return <div className="h-80 bg-gray-50 rounded-lg animate-pulse" />

  const getColor = (intensity: number, isBotTraffic: boolean) => {
    if (isBotTraffic) {
      if (intensity > 75) return 'bg-red-500'
      if (intensity > 50) return 'bg-red-400'
      if (intensity > 25) return 'bg-red-300'
      return 'bg-red-200'
    }
    
    if (intensity > 75) return 'bg-blue-500'
    if (intensity > 50) return 'bg-blue-400'
    if (intensity > 25) return 'bg-blue-300'
    return 'bg-blue-100'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Intensity Heatmap</h3>
      <p className="text-sm text-gray-600 mb-6">7-day hourly traffic patterns (Blue: Human, Red: Bot)</p>
      
      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Hour labels */}
          <div className="flex gap-1">
            <div className="w-16" /> {/* Day column spacer */}
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-6 text-center text-xs text-gray-500 font-medium">
                {i % 6 === 0 ? i : ''}
              </div>
            ))}
          </div>

          {/* Heatmap rows */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIdx) => (
            <div key={day} className="flex gap-1 mb-1">
              <div className="w-16 flex items-center pr-2 text-sm font-medium text-gray-700 border-r">
                {day}
              </div>
              {Array.from({ length: 24 }).map((_, hour) => {
                const dataPoint = heatmapData[dayIdx * 24 + hour]
                return (
                  <div
                    key={`${day}-${hour}`}
                    className={`w-6 h-6 rounded ${getColor(dataPoint.intensity, dataPoint.isBotTraffic)} cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-gray-300 transition-all`}
                    title={`${day} ${hour}:00 - ${dataPoint.intensity.toFixed(0)}% intensity`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded" />
          <span className="text-gray-600">Human Traffic (High)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 rounded" />
          <span className="text-gray-600">Human Traffic (Low)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span className="text-gray-600">Bot Traffic (High)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded" />
          <span className="text-gray-600">Bot Traffic (Low)</span>
        </div>
      </div>
    </div>
  )
}
