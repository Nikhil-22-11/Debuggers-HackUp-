'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Copy, Check, Globe, ShieldAlert, Activity } from 'lucide-react'

interface AttackingIP {
  ip: string
  country: string
  attempts: number
  severity: 'critical' | 'high' | 'medium'
  lastSeen: string
}

const generateAttackingIPs = (isUnderAttack: boolean): AttackingIP[] => {
  const baseIPs: AttackingIP[] = [
    { ip: '203.45.112.89', country: 'Shanghai, China', attempts: 4521, severity: 'critical', lastSeen: '2 min ago' },
    { ip: '185.220.101.45', country: 'Moscow, Russia', attempts: 3248, severity: 'high', lastSeen: '5 min ago' },
    { ip: '91.243.55.123', country: 'Hanoi, Vietnam', attempts: 2156, severity: 'high', lastSeen: '8 min ago' },
  ]

  if (isUnderAttack) {
    return [
      { ip: '45.142.182.99', country: 'São Paulo, Brazil', attempts: 12534, severity: 'critical', lastSeen: 'now' },
      { ip: '203.112.45.67', country: 'Mumbai, India', attempts: 9876, severity: 'critical', lastSeen: '1 min ago' },
      ...baseIPs,
    ]
  }

  return baseIPs
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-600/10 border-red-500/30 text-red-700 shadow-red-500/5'
    case 'high': return 'bg-amber-600/10 border-amber-500/30 text-amber-700 shadow-amber-500/5'
    case 'medium': return 'bg-blue-600/10 border-blue-500/30 text-blue-700 shadow-blue-500/5'
    default: return 'bg-slate-100 border-slate-200 text-slate-700'
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
    <div className="bg-transparent space-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-5">
          <div className="p-3 bg-red-600 rounded-2xl shadow-xl shadow-red-500/20">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">Active_Threat_Signatures</h2>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mt-1">{ips.length} Malicious Nodes Identified</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ips.map((ipData) => (
          <div
            key={ipData.ip}
            className={`p-6 rounded-[2.5rem] border-2 transition-all hover:scale-[1.02] active:scale-95 shadow-xl flex flex-col justify-between h-[200px] ${getSeverityColor(ipData.severity)}`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <Globe className="w-3.5 h-3.5 opacity-40 flex-shrink-0" />
                    <code className="text-sm font-mono font-black truncate tracking-tighter">{ipData.ip}</code>
                </div>
                <button
                  onClick={() => copyToClipboard(ipData.ip)}
                  className="p-2.5 bg-white/50 hover:bg-white rounded-xl transition-all shadow-sm flex-shrink-0"
                >
                  {copied === ipData.ip ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              
              <div className="flex flex-col gap-1 px-1">
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Origin</span>
                 <span className="text-sm font-bold truncate leading-none uppercase italic tracking-tight">{ipData.country}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 flex items-end justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Auth_Attempts</span>
                    <span className="text-3xl font-black italic tracking-tighter leading-none">{ipData.attempts.toLocaleString()}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-black/10`}>
                    {ipData.severity}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
