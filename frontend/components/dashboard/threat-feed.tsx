'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Shield, ShieldAlert, ShieldCheck, Globe, Clock, Activity, Terminal, AlertTriangle, Fingerprint, Lock, Eye, Ban, CheckCircle2, ChevronRight, MoreHorizontal } from 'lucide-react'
import { FilterState } from '@/app/page'

interface ThreatEntry {
  id: string
  ip: string
  geo: string
  score: number
  classification: string
  subCategory: string
  action: 'ALLOWED' | 'BLOCKED' | 'MFA'
  time: string
}

export default function ThreatFeed({ filters, isUnderAttack }: { filters: FilterState, isUnderAttack: boolean }) {
  const [entries, setEntries] = useState<ThreatEntry[]>([
    { id: '1', ip: '198.51.100.89', geo: 'Brazil', score: 0.47, classification: 'Bot Pattern', subCategory: 'ACCOUNT TAKEOVER', action: 'MFA', time: '10:40:57 PM' },
    { id: '2', ip: '198.51.100.89', geo: 'Japan', score: 0.70, classification: 'Bot Pattern', subCategory: 'ACCOUNT TAKEOVER', action: 'MFA', time: '10:40:53 PM' },
    { id: '3', ip: '10.0.0.42', geo: 'United States', score: 0.55, classification: 'XSS Attempt', subCategory: 'SYSTEM BREACH', action: 'ALLOWED', time: '10:40:49 PM' },
    { id: '4', ip: '192.168.1.105', geo: 'Brazil', score: 0.49, classification: 'Credential Reuse', subCategory: 'DATA EXFILTRATION', action: 'BLOCKED', time: '10:40:45 PM' },
    { id: '5', ip: '172.16.0.201', geo: 'Japan', score: 0.68, classification: 'Credential Reuse', subCategory: 'DATA EXFILTRATION', action: 'BLOCKED', time: '10:40:41 PM' },
    { id: '6', ip: '198.51.100.89', geo: 'Japan', score: 0.85, classification: 'XSS Attempt', subCategory: 'SYSTEM BREACH', action: 'ALLOWED', time: '10:40:37 PM' },
    { id: '7', ip: '172.16.0.201', geo: 'Japan', score: 0.51, classification: 'Credential Reuse', subCategory: 'INFORMATION LEAK', action: 'ALLOWED', time: '10:40:03 PM' },
    { id: '8', ip: '198.51.100.89', geo: 'United States', score: 0.59, classification: 'Anomaly', subCategory: 'DATA EXFILTRATION', action: 'BLOCKED', time: '10:39:33 PM' },
    { id: '9', ip: '172.16.0.201', geo: 'Germany', score: 0.64, classification: 'Anomaly', subCategory: 'DATA EXFILTRATION', action: 'MFA', time: '10:39:03 PM' }
  ])

  useEffect(() => {
    if (isUnderAttack) {
      const newEntry: ThreatEntry = {
        id: Date.now().toString(),
        ip: '95.161.212.18',
        geo: 'Moscow, RU',
        score: 0.98,
        classification: 'Bot Pattern',
        subCategory: 'RDoS_INJECTION',
        action: 'BLOCKED',
        time: new Date().toLocaleTimeString()
      }
      setEntries(prev => [newEntry, ...prev.slice(0, 15)])
    }
  }, [isUnderAttack])

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
        if (filters.status !== 'All' && e.action !== filters.status.toUpperCase()) return false
        if (filters.riskLevel !== 'All Levels') {
            if (filters.riskLevel === 'High' && e.score < 0.7) return false
            if (filters.riskLevel === 'Medium' && (e.score < 0.4 || e.score > 0.7)) return false
        }
        return true
    })
  }, [entries, filters])

  return (
    <Card className="relative overflow-hidden border-none shadow-3xl bg-white dark:bg-slate-900/40 rounded-[3rem] transition-all duration-1000">
      <CardHeader className="px-10 py-10">
        <CardTitle className="text-2xl font-black italic tracking-tighter uppercase text-slate-800 dark:text-white">Recent Defensive Actions Feed</CardTitle>
      </CardHeader>
      
      <CardContent className="px-0 pb-12">
        <ScrollArea className="h-[600px] w-full px-10">
          <div className="w-full min-w-[800px]">
             {/* Header Labels */}
             <div className="grid grid-cols-12 gap-4 pb-6 px-4 border-b border-slate-100 dark:border-white/5 opacity-40">
                <span className="col-span-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Source/Geo</span>
                <span className="col-span-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Score</span>
                <span className="col-span-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Classification</span>
                <span className="col-span-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right pr-4">Action</span>
             </div>

             {/* Feed Entries */}
             <div className="space-y-4 pt-6">
                {filteredEntries.map((entry) => (
                    <div key={entry.id} className="grid grid-cols-12 gap-4 items-center px-4 py-4 rounded-[2rem] hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-all group">
                        
                        <div className="col-span-4 flex flex-col justify-center">
                            <span className="text-[15px] font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">{entry.ip}</span>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                {entry.geo} <span className="opacity-40 font-mono ml-2">· {entry.time}</span>
                            </span>
                        </div>

                        <div className="col-span-2 flex justify-center">
                            <span className={`text-[16px] font-black transition-all ${
                                entry.score > 0.7 ? 'text-red-500' : entry.score > 0.5 ? 'text-amber-500' : 'text-emerald-500'
                            }`}>
                                {entry.score.toFixed(2)}
                            </span>
                        </div>

                        <div className="col-span-4 flex flex-col justify-center">
                            {entry.action === 'ALLOWED' ? (
                                <>
                                    <span className="text-[13px] font-black text-emerald-600 dark:text-emerald-500 tracking-tight leading-none">Trusted Traffic</span>
                                    <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-tighter leading-none italic mt-1 font-mono">NODE_SIGNAL_CLEAN</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-[13px] font-black text-slate-700 dark:text-slate-300 tracking-tight leading-none mb-1">{entry.classification}</span>
                                    <span className="text-[10px] font-black text-red-500/80 uppercase tracking-tighter leading-none italic">
                                        → {entry.subCategory}
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="col-span-2 flex justify-end pr-4">
                            <div className={`px-4 py-1.5 rounded-full border-2 text-[10px] font-black tracking-widest uppercase transition-all shadow-sm ${
                                entry.action === 'BLOCKED' ? 'bg-red-500/10 border-red-500 text-red-500' : 
                                entry.action === 'ALLOWED' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 
                                'bg-amber-500/10 border-amber-500 text-amber-500'
                            }`}>
                                {entry.action}
                            </div>
                        </div>

                    </div>
                ))}
             </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
