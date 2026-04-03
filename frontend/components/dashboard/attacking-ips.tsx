'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Copy, Check } from 'lucide-react'

interface AttackingIP {
  ip: string
  country: string
  attempts: number
  severity: 'critical' | 'high' | 'medium'
  lastSeen: string
}

const generateAttackingIPs = (isUnderAttack: boolean): AttackingIP[] => {
  const baseIPs: AttackingIP[] = [
    { ip: '203.45.112.89', country: 'China', attempts: 4521, severity: 'critical', lastSeen: '2 min ago' },
    { ip: '185.220.101.45', country: 'Russia', attempts: 3248, severity: 'high', lastSeen: '5 min ago' },
    { ip: '91.243.55.123', country: 'Vietnam', attempts: 2156, severity: 'high', lastSeen: '8 min ago' },
  ]

  if (isUnderAttack) {
    return [
      { ip: '45.142.182.99', country: 'Brazil', attempts: 12534, severity: 'critical', lastSeen: 'now' },
      { ip: '203.112.45.67', country: 'India', attempts: 9876, severity: 'critical', lastSeen: '1 min ago' },
      { ip: '87.25.198.41', country: 'Ukraine', attempts: 7623, severity: 'high', lastSeen: '2 min ago' },
      ...baseIPs,
    ]
  }

  return baseIPs
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 border-red-300 text-red-800'
    case 'high':
      return 'bg-orange-100 border-orange-300 text-orange-800'
    case 'medium':
      return 'bg-yellow-100 border-yellow-300 text-yellow-800'
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800'
  }
}

interface AttackingIPsProps {
  filters?: { timeRange: string; riskLevel: string; status: string }
  isUnderAttack?: boolean
}

export default function AttackingIPs({ filters, isUnderAttack }: AttackingIPsProps) {
  const [ips, setIps] = useState<AttackingIP[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIps(generateAttackingIPs(isUnderAttack || false))
  }, [isUnderAttack, filters])

  const copyToClipboard = (ip: string) => {
    navigator.clipboard.writeText(ip)
    setCopied(ip)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!mounted) return null

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Active Threat Sources</h2>
          <p className="text-sm text-gray-600">{ips.length} malicious IP addresses detected</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {ips.map((ipData) => (
          <div
            key={ipData.ip}
            className={`p-3 sm:p-4 rounded-xl border card-hover transition-all ${getSeverityColor(ipData.severity)}`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <code className="text-xs sm:text-sm font-mono font-bold truncate flex-1">{ipData.ip}</code>
                <button
                  onClick={() => copyToClipboard(ipData.ip)}
                  className="p-1 hover:bg-white/50 rounded transition-colors flex-shrink-0"
                  title="Copy IP"
                >
                  {copied === ipData.ip ? (
                    <Check className="w-3 sm:w-4 h-3 sm:h-4" />
                  ) : (
                    <Copy className="w-3 sm:w-4 h-3 sm:h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs font-medium opacity-75 line-clamp-2">
                {ipData.country} • {ipData.attempts.toLocaleString()} attempts
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-white/20">
                <div className="text-sm sm:text-lg font-bold">{ipData.attempts}</div>
                <p className="text-xs opacity-75 capitalize">{ipData.severity} threat</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
