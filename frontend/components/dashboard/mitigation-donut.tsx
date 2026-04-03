'use client'

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { name: 'Hard Blocked', value: 70, color: '#ff1744' },
  { name: 'MFA Triggered', value: 25, color: '#fbbf24' },
  { name: 'CAPTCHA Served', value: 5, color: '#1dd1a1' },
]

export default function MitigationDonut() {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-sm">
      <h2 className="text-lg font-bold text-foreground mb-2">
        Threat Mitigation Breakdown
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        Distribution of automated actions
      </p>
      
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `${value}%`}
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#e8f1ff' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '1rem' }}
            formatter={(value) => {
              const item = data.find(d => d.name === value)
              return `${value} (${item?.value}%)`
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
