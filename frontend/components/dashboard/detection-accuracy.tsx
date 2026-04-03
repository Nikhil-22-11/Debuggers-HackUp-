'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface DetectionAccuracyProps {
  filters?: { timeRange: string; riskLevel: string; status: string }
}

const accuracyData = [
  { name: 'True Positives', value: 4521, fill: '#10b981' },
  { name: 'True Negatives', value: 98234, fill: '#3b82f6' },
  { name: 'False Positives', value: 82, fill: '#f59e0b' },
  { name: 'False Negatives', value: 23, fill: '#ef4444' },
]

export default function DetectionAccuracy({ filters }: DetectionAccuracyProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [filters])

  if (!mounted) return <div className="h-80 bg-gray-50 rounded-lg animate-pulse" />

  const total = accuracyData.reduce((sum, item) => sum + item.value, 0)
  const accuracy = ((4521 + 98234) / total * 100).toFixed(2)
  const truePositiveRate = (4521 / (4521 + 23) * 100).toFixed(2)
  const falsePositiveRate = (82 / (82 + 98234) * 100).toFixed(3)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Detection Accuracy Metrics</h3>
        <p className="text-sm text-gray-600">Model performance analysis over the selected period</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={accuracyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} stroke="#6b7280" />
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
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {accuracyData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">Accuracy</p>
          <p className="text-3xl font-bold text-green-900 mt-1">{accuracy}%</p>
          <p className="text-xs text-green-600 mt-2">Overall correctness</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Sensitivity</p>
          <p className="text-3xl font-bold text-blue-900 mt-1">{truePositiveRate}%</p>
          <p className="text-xs text-blue-600 mt-2">True positive rate</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">False Positive</p>
          <p className="text-3xl font-bold text-amber-900 mt-1">{falsePositiveRate}%</p>
          <p className="text-xs text-amber-600 mt-2">Low false alarms</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide">Precision</p>
          <p className="text-3xl font-bold text-purple-900 mt-1">98.2%</p>
          <p className="text-xs text-purple-600 mt-2">Prediction reliability</p>
        </div>
      </div>
    </div>
  )
}
