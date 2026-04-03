'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const data = [
  {
    axis: 'Mouse Velocity',
    humanBaseline: 65,
    suspicious: 25,
  },
  {
    axis: 'Keystroke Entropy',
    humanBaseline: 72,
    suspicious: 92,
  },
  {
    axis: 'Request Rate',
    humanBaseline: 45,
    suspicious: 95,
  },
  {
    axis: 'Browser Fingerprint',
    humanBaseline: 85,
    suspicious: 15,
  },
  {
    axis: 'IP Reputation',
    humanBaseline: 90,
    suspicious: 20,
  },
]

export default function BehavioralRadar() {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-sm">
      <h2 className="text-lg font-bold text-foreground mb-2">
        Behavioral Signatures
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        Human Baseline vs Current Suspicious Session
      </p>
      
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data}>
          <PolarGrid stroke="#374151" opacity={0.5} />
          <PolarAngleAxis 
            dataKey="axis" 
            stroke="#9ca3af"
            tick={{ fontSize: 11 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            stroke="#374151"
            tick={{ fontSize: 10 }}
          />
          <Radar
            name="Human Baseline"
            dataKey="humanBaseline"
            stroke="#1dd1a1"
            fill="#1dd1a1"
            fillOpacity={0.3}
          />
          <Radar
            name="Suspicious Session"
            dataKey="suspicious"
            stroke="#ff1744"
            fill="#ff1744"
            fillOpacity={0.4}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '1rem' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#e8f1ff' }}
            formatter={(value: number) => value}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
