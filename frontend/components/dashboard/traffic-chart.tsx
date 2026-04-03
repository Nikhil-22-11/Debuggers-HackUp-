'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const generateTrafficData = (isUnderAttack: boolean = false) => {
  const data = []
  for (let i = 0; i < 60; i++) {
    const baseHuman = 1000 + Math.random() * 200
    const humanTraffic = baseHuman + Math.sin(i * 0.1) * 50
    
    let botTraffic = Math.random() * 100
    if (isUnderAttack || (i >= 25 && i <= 35)) {
      botTraffic = 4000 + Math.random() * 1000 // Credential stuffing attack spike
    }
    
    data.push({
      time: `${i}s`,
      human: Math.round(humanTraffic),
      bot: Math.round(botTraffic),
    })
  }
  return data
}

interface TrafficChartProps {
  isUnderAttack?: boolean
}

export default function TrafficChart({ isUnderAttack = false }: TrafficChartProps) {
  const [data, setData] = useState<Array<{ time: string; human: number; bot: number }>>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setData(generateTrafficData(isUnderAttack))
  }, [isUnderAttack])

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-foreground mb-2">
        Traffic Analysis (Real-time)
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        60-second live timeline: Human Traffic vs Bot/Attack Traffic
      </p>
      
      {mounted && data.length > 0 ? (
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="humanGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00d9ff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="botGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff1744" stopOpacity={isUnderAttack ? 0.5 : 0.3} />
              <stop offset="95%" stopColor="#ff1744" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280" 
            tick={{ fontSize: 12 }}
            interval={5}
          />
          <YAxis 
            stroke="#6b7280" 
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
              padding: '0.75rem',
            }}
            labelStyle={{ color: '#e8f1ff' }}
            formatter={(value: number) => value.toLocaleString()}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '1.5rem' }}
            iconType="line"
          />
          <Area
            type="monotone"
            dataKey="human"
            stroke="#00d9ff"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#humanGradient)"
            name="Human Traffic"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="bot"
            stroke="#ff1744"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#botGradient)"
            name="Bot/Script Traffic"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      ) : (
        <div className="h-80 bg-slate-800/40 rounded flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      )}
    </div>
  )
}
