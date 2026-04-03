'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Globe, MapPin, ShieldAlert, Zap, Terminal, Activity, Info, Crosshair, Radar, BarChart3 } from 'lucide-react'

// HIGH-FIDELITY SIMPLIFIED WORLD PATHS
const CONTINENTS = [
  { id: 'na', d: 'M40,50 L55,45 L70,35 L85,45 L95,65 L85,85 L65,95 L45,95 L30,80 Z', name: 'NORTH_AMERICA' }, // NA
  { id: 'sa', d: 'M65,95 L80,105 L75,135 L60,155 L45,145 L50,115 Z', name: 'SOUTH_AMERICA' }, // SA
  { id: 'eu', d: 'M115,40 L135,35 L150,45 L145,65 L130,75 L115,65 Z', name: 'EUROPE' }, // EU
  { id: 'af', d: 'M115,75 L145,85 L155,115 L140,145 L115,140 L105,115 Z', name: 'AFRICA' }, // AF
  { id: 'as', d: 'M150,45 L195,35 L245,55 L265,95 L225,125 L185,115 L155,85 Z', name: 'ASIA' }, // ASIA
  { id: 'oc', d: 'M235,125 L265,135 L255,155 L230,155 L220,135 Z', name: 'OCEANIA' } // OC
]

const THREAT_NODES = [
    { city: 'São Paulo', code: 'BR', x: 68, y: 125, count: 42, ips: ['187.35.x.x', '177.10.x.x'], type: 'SQL_INJECTION' },
    { city: 'Moscow', code: 'RU', x: 165, y: 55, count: 128, ips: ['95.161.x.x', '46.161.x.x'], type: 'BOTNET_BURST' },
    { city: 'New York', code: 'US', x: 55, y: 65, count: 52, ips: ['74.125.x.x', '35.201.x.x'], type: 'XSS_ATTEMPT' },
    { city: 'Beijing', code: 'CN', x: 225, y: 75, count: 89, ips: ['112.98.x.x', '180.160.x.x'], type: 'CREDENTIAL_STUFFING' },
    { city: 'London', code: 'UK', x: 120, y: 55, count: 14, ips: ['31.25.x.x'], type: 'SCANNER' }
]

export default function GlobalThreatMap({ isUnderAttack = false }: { isUnderAttack?: boolean }) {
  return (
    <Card className="relative overflow-hidden border-none shadow-3xl bg-white dark:bg-[#0B101B]/80 rounded-[3.5rem] transition-all duration-1000 group">
      
      {/* HUD Scanner Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.07] overflow-hidden">
          <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(37,99,235,0.05)_50%)] bg-[length:100%_4px] animate-scan-fast" />
      </div>

      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-0 pt-12 px-12 relative z-10">
        <div className="flex items-center gap-6">
            <div className={`p-4 rounded-3xl transition-all duration-1000 ${isUnderAttack ? 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)] rotate-0' : 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.2)]'}`}>
                <Radar className={`w-6 h-6 text-white ${isUnderAttack ? 'animate-pulse' : 'animate-spin-slow'}`} />
            </div>
            <div className="flex flex-col">
                <CardTitle className="text-2xl font-black italic tracking-tighter uppercase leading-none">Security_Intelligence_HUD</CardTitle>
                <div className="flex items-center gap-3 mt-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${isUnderAttack ? 'bg-red-500 animate-ping shadow-[0_0_10px_#ef4444]' : 'bg-emerald-500 animate-pulse-slow'} shadow-sm`} />
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] leading-none">Scanning_Global_Nodes_v4.1</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5">
                <Globe className="w-3.5 h-3.5 text-blue-500 mr-2" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{isUnderAttack ? 'THREATMAP_ACTIVE' : 'HUD_STANDBY'}</span>
             </div>
        </div>
      </CardHeader>

      <CardContent className="p-12 relative z-10">
        <div className="relative aspect-[21/9] w-full bg-slate-50/10 dark:bg-slate-950/40 rounded-[3rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-inner">
          <svg viewBox="0 0 300 180" className="w-full h-full transform transition-transform duration-1000 group-hover:scale-[1.01]">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* CONTINENTS */}
            {CONTINENTS.map(continent => (
              <path key={continent.id} d={continent.d} 
                    className="fill-slate-200 dark:fill-slate-800/40 transition-colors duration-1000 hover:fill-slate-300 dark:hover:fill-blue-900/20" />
            ))}

            {/* PULSING THREAT NODES */}
            {THREAT_NODES.map(node => (
              <g key={node.city} className="cursor-crosshair">
                {/* Visual Pulse Rings */}
                <circle cx={node.x} cy={node.y} r="6" 
                        className={`fill-red-500/10 animate-ping-slow ${isUnderAttack || node.count > 50 ? 'block' : 'hidden'}`} />
                <circle cx={node.x} cy={node.y} r="3" 
                        className={`fill-red-500/30 animate-pulse ${isUnderAttack ? 'block' : 'hidden'}`} />
                
                {/* Hover Card Trigger */}
                <foreignObject x={node.x - 3} y={node.y - 3} width="6" height="6">
                  <HoverCard openDelay={0}>
                    <HoverCardTrigger asChild>
                       <div className={`w-6 h-6 -ml-3 -mt-3 flex items-center justify-center transition-all duration-500 ${
                           isUnderAttack && node.count > 50 ? 'scale-125' : 'scale-100'
                       }`}>
                           <div className={`w-3 h-3 rounded-full border-2 transition-all ${
                               isUnderAttack ? 'bg-red-600 border-white shadow-[0_0_15px_#ef4444]' : 
                               node.count > 50 ? 'bg-red-500 border-white' : 'bg-blue-600 border-white'
                           }`} />
                       </div>
                    </HoverCardTrigger>
                    <HoverCardContent side="top" className="w-[320px] bg-white/95 dark:bg-[#0B101B]/95 border-none shadow-5xl p-0 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl animate-in zoom-in-95 duration-200">
                        <div className="p-8 space-y-8">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-6">
                                <div className="flex items-center gap-4 text-slate-800 dark:text-white">
                                    <MapPin className="w-5 h-5 text-blue-500" />
                                    <div className="flex flex-col">
                                        <span className="text-[12px] font-black italic tracking-tighter uppercase leading-none">{node.city}</span>
                                        <span className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-widest">{node.code}_NODE_ACTIVE</span>
                                    </div>
                                </div>
                                <div className="px-5 py-2 bg-red-600 text-white rounded-full shadow-lg shadow-red-500/20">
                                    <span className="text-[10px] font-black uppercase tracking-widest">{node.count} EVENTS</span>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <Crosshair className="w-4 h-4 text-red-500" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none italic">Primary_Threat_Vector:</span>
                                    </div>
                                    <span className="text-[14px] font-black text-red-500 uppercase tracking-tight ml-7 leading-none">{node.type}</span>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl space-y-4 border border-slate-100 dark:border-white/5 min-h-[140px] shadow-inner">
                                    <div className="flex items-center gap-3 mb-2 underline underline-offset-4 decoration-blue-500/50">
                                        <Terminal className="w-3.5 h-3.5 text-blue-500" />
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Live_Interdiction_Log:</span>
                                    </div>
                                    {node.ips.map(ip => (
                                        <div key={ip} className="flex items-center justify-between group/ip py-1">
                                            <span className="text-[11px] font-mono font-black text-slate-900 dark:text-blue-400 tracking-wider">[{ip}]</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                <span className="text-[9px] font-black text-emerald-500 uppercase italic opacity-0 group-hover/ip:opacity-100 transition-opacity">MITIGATED</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Activity className="w-4 h-4 text-blue-500" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none opacity-50">v4.1.0_IdentityMATCH</span>
                                </div>
                                <BarChart3 className="w-4 h-4 text-slate-600" />
                            </div>
                        </div>
                    </HoverCardContent>
                  </HoverCard>
                </foreignObject>
              </g>
            ))}
          </svg>

          {/* Map Legend Hud */}
          <div className="absolute bottom-12 left-12 flex flex-col gap-5 p-8 rounded-[2rem] bg-white/50 dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700">
             {[ { color: 'bg-blue-600', label: 'CLEAN_SIGNAL' }, { color: 'bg-red-600', label: 'THREAT_MATCH' } ].map(i => (
                 <div key={i.label} className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${i.color} shadow-lg`} />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">{i.label}</span>
                 </div>
             ))}
          </div>

          {/* Top Control Bar Scan Line Overlay */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-blue-600/2 to-transparent pointer-events-none" />
        </div>
      </CardContent>

      {/* Decorative Corner HUD Elements */}
      <div className="absolute top-12 right-12 flex flex-col items-end gap-2 opacity-20 pointer-events-none">
          <div className="w-12 h-0.5 bg-blue-600" />
          <div className="w-0.5 h-12 bg-blue-600" />
      </div>
    </Card>
  )
}
