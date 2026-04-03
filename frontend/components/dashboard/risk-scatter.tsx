'use client'

import { useState, useEffect } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface RiskScatterProps {
  filters?: { timeRange: string; riskLevel: string; status: string }
  isUnderAttack?: boolean
}

export default function RiskScatter({ filters, isUnderAttack }: RiskScatterProps) {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<Array<{ x: number; y: number; value: number; type: string }>>([])

  useEffect(() => {
    setMounted(true)
    
    // Generate scatter data based on filters and attack state
    const scatterData = []
    
    // Human traffic - low risk cluster
    for (let i = 0; i < 25; i++) {
      scatterData.push({
        x: 20 + Math.random() * 40,
        y: 30 + Math.random() * 40,
        value: Math.random() * 20 + 5,
        type: 'human'
      })
    }
    
    // Bot traffic - high risk cluster
    for (let i = 0; i < 15; i++) {
      scatterData.push({
        x: 70 + Math.random() * 25,
        y: 70 + Math.random() * 25,
        value: Math.random() * 30 + 70,
        type: 'bot'
      })
    }
    
    // Mixed/suspicious cluster
    for (let i = 0; i < 10; i++) {
      scatterData.push({
        x: 45 + Math.random() * 30,
        y: 50 + Math.random() * 30,
        value: Math.random() * 40 + 40,
        type: 'suspicious'
      })
    }
    
    setData(scatterData)
  }, [filters, isUnderAttack])

  if (!mounted || data.length === 0) {
    return <div className="h-96 bg-gray-50 rounded-lg animate-pulse" />
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'human':
        return '#3b82f6'
      case 'bot':
        return '#ef4444'
      case 'suspicious':
        return '#f59e0b'
      default:
        return '#6b7280'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Score Distribution</h3>
      <p className="text-sm text-gray-600 mb-6">Request Frequency vs Anomaly Score</p>

      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="x"
            label={{ value: 'Request Frequency (%)', position: 'insideBottomRight', offset: -10 }}
            stroke="#6b7280"
          />
          <YAxis
            dataKey="y"
            label={{ value: 'Anomaly Score', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              color: '#1f2937'
            }}
            cursor={{ strokeDasharray: '3 3', stroke: '#9ca3af' }}
            formatter={(value: number) => value.toFixed(2)}
          />
          <Legend
            wrapperStyle={{ paddingTop: '1.5rem' }}
            formatter={(value) => {
              if (value === 'human') return 'Human Traffic'
              if (value === 'bot') return 'Bot Traffic'
              return 'Suspicious Activity'
            }}
          />
          <Scatter name="human" data={data.filter(d => d.type === 'human')} fill="#3b82f6" />
          <Scatter name="bot" data={data.filter(d => d.type === 'bot')} fill="#ef4444" />
          <Scatter name="suspicious" data={data.filter(d => d.type === 'suspicious')} fill="#f59e0b" />
        </ScatterChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <div>
            <p className="text-xs text-gray-600">Human Traffic</p>
            <p className="text-sm font-semibold text-gray-900">25 requests</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div>
            <p className="text-xs text-gray-600">Bot Traffic</p>
            <p className="text-sm font-semibold text-gray-900">15 requests</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div>
            <p className="text-xs text-gray-600">Suspicious</p>
            <p className="text-sm font-semibold text-gray-900">10 requests</p>
          </div>
        </div>
      </div>
    </div>
  )
}
