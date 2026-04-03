'use client'

import { useState, useEffect } from 'react'

interface ThreatEntry {
  id: number
  ip: string
  timestamp: string
  isolationForestScore: number
  status: 'Allowed' | 'MFA' | 'Blocked'
}

interface ThreatFeedProps {
  isUnderAttack?: boolean
  filters?: { timeRange: string; riskLevel: string; status: string }
}

const generateThreats = (includeAttackRows: boolean = false): ThreatEntry[] => {
  const ips = [
    '192.168.1.105',
    '10.0.0.42',
    '203.0.113.156',
    '198.51.100.89',
    '172.16.0.201',
  ]

  const statuses: Array<'Allowed' | 'MFA' | 'Blocked'> = ['Allowed', 'MFA', 'Blocked']

  const threats = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    ip: ips[Math.floor(Math.random() * ips.length)],
    timestamp: new Date(Date.now() - (i + 1) * 30000).toLocaleTimeString(),
    isolationForestScore: 0.45 + Math.random() * 0.5,
    status: statuses[Math.floor(Math.random() * statuses.length)] as 'Allowed' | 'MFA' | 'Blocked',
  }))

  if (includeAttackRows) {
    const attackIps = ['45.142.182.99', '203.112.45.67', '87.25.198.41']
    for (let i = 0; i < 3; i++) {
      threats.unshift({
        id: Math.random() * 1000000,
        ip: attackIps[i],
        timestamp: new Date().toLocaleTimeString(),
        isolationForestScore: 0.95 + Math.random() * 0.05,
        status: 'Blocked',
      })
    }
  }

  return threats
}

export default function ThreatFeed({ isUnderAttack = false, filters }: ThreatFeedProps) {
  const [threats, setThreats] = useState<ThreatEntry[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setThreats(generateThreats(isUnderAttack))
  }, [isUnderAttack, filters])

  useEffect(() => {
    const interval = setInterval(() => {
      setThreats(prev => {
        const ips = ['192.168.1.105', '10.0.0.42', '203.0.113.156', '198.51.100.89', '172.16.0.201']
        const statuses: Array<'Allowed' | 'MFA' | 'Blocked'> = ['Allowed', 'MFA', 'Blocked']
        
        const newThreat: ThreatEntry = {
          id: Math.random() * 1000000,
          ip: ips[Math.floor(Math.random() * ips.length)],
          timestamp: new Date().toLocaleTimeString(),
          isolationForestScore: isUnderAttack 
            ? 0.95 + Math.random() * 0.05
            : 0.45 + Math.random() * 0.5,
          status: isUnderAttack 
            ? 'Blocked'
            : statuses[Math.floor(Math.random() * statuses.length)] as 'Allowed' | 'MFA' | 'Blocked',
        }
        return [newThreat, ...prev.slice(0, 7)]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isUnderAttack])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Allowed':
        return 'bg-green-50 border-green-200 text-green-700'
      case 'MFA':
        return 'bg-amber-50 border-amber-200 text-amber-700'
      case 'Blocked':
        return 'bg-red-50 border-red-200 text-red-700'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700'
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 glass-effect p-4 sm:p-6">
      <div className="space-y-2 sm:space-y-3 max-h-96 sm:max-h-[500px] overflow-y-auto">
        {threats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recent threats detected
          </div>
        ) : (
          threats.map(threat => (
            <div 
              key={threat.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-gray-200 card-hover transition-all"
            >
              <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                <p className="font-mono text-xs sm:text-sm text-gray-900 truncate">
                  {threat.ip}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {threat.timestamp}
                </p>
              </div>
              
              <div className="flex items-center justify-between sm:gap-4 sm:ml-4 sm:flex-shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                <div className="text-left sm:text-right flex-1 sm:flex-none">
                  <p className="text-xs sm:text-sm font-bold text-blue-600">
                    {threat.isolationForestScore.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Score
                  </p>
                </div>
                
                <div className={`px-2 sm:px-3 py-1 rounded-full border font-semibold text-xs whitespace-nowrap ${getStatusColor(threat.status)}`}>
                  {threat.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
