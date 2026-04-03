'use client'

import { useState, useEffect } from 'react'
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface TimelineProps {
  filters?: { timeRange: string; riskLevel: string; status: string }
  isUnderAttack?: boolean
}

const generateTimelineData = (isUnderAttack: boolean) => {
  const data = []
  for (let i = 0; i < 60; i++) {
    const humanTraffic = 1200 + Math.random() * 400 + Math.sin(i * 0.1) * 100
    let botTraffic = Math.random() * 150
    
    if (isUnderAttack && i >= 25 && i <= 35) {
      botTraffic = 3500 + Math.random() * 1000
    }
    
    data.push({
      time: `${i}s`,
      human: Math.round(humanTraffic),
      bot: Math.round(botTraffic),
      blocked: Math.round(botTraffic * 0.95),
    })
  }
  return data
}

export default function TrafficTimeline({ filters, isUnderAttack }: TimelineProps) {
  const [data, setData] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setData(generateTimelineData(isUnderAttack || false))
  }, [isUnderAttack, filters])

  if (!mounted || data.length === 0) return <div className="h-80 bg-gray-50 rounded-lg animate-pulse" />

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Traffic Timeline (Real-time)</h3>
        <p className="text-sm text-gray-600">60-second window showing human vs bot traffic with mitigation rate</p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="humanGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" stroke="#6b7280" interval={9} />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
            formatter={(value: number) => value.toLocaleString()}
            labelStyle={{ color: '#1f2937' }}
          />
          <Legend wrapperStyle={{ paddingTop: '1.5rem' }} />
          
          <Bar dataKey="blocked" fill="#10b981" name="Requests Blocked" opacity={0.7} />
          <Line
            type="monotone"
            dataKey="human"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            name="Human Traffic"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="bot"
            stroke="#ef4444"
            strokeWidth={3}
            dot={false}
            name="Bot/Attack Traffic"
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-600 font-medium uppercase">Human Traffic Peak</p>
          <p className="text-2xl font-bold text-blue-900">1,548</p>
          <p className="text-xs text-blue-600 mt-1">requests/min</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs text-red-600 font-medium uppercase">Bot Activity</p>
          <p className="text-2xl font-bold text-red-900">892</p>
          <p className="text-xs text-red-600 mt-1">requests/min</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-600 font-medium uppercase">Blocked Rate</p>
          <p className="text-2xl font-bold text-green-900">99.2%</p>
          <p className="text-xs text-green-600 mt-1">of bot traffic</p>
        </div>
      </div>
    </div>
  )
}
