'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ShieldAlert, Fingerprint, Bug, Brain, AlertOctagon, Terminal, Activity, Zap, Cpu, Waves, Radar, BarChart3, PowerOff, Radio, ScanLine, Lock, Play, RefreshCw } from 'lucide-react'
import { useBiometrics } from '@/hooks/use-biometrics-engine'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

interface AdvancedThreatIntelProps {
  isActive?: boolean
  onSimulate?: () => void
}

export default function AdvancedThreatIntel({ isActive = true, onSimulate }: AdvancedThreatIntelProps) {
  const { metrics } = useBiometrics()
  const { threats, aiIntegrity, botScore } = metrics
  const [displayText, setDisplayText] = useState('CALIBRATING_SENSORS...')

  useEffect(() => {
    if (isActive) {
      const texts = ['ANALYZING_BEHAVIORAL_RHYTHMS...', 'DECRYPTING_ENCRYPTED_FLOWS...', 'MAPPING_NEURAL_CADENCES...', 'SCANNING_ENDPOINTS...']
      let i = 0
      const interval = setInterval(() => {
        setDisplayText(texts[i % texts.length])
        i++
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isActive])

  return (
    <Card className={`relative overflow-hidden border-none shadow-3xl backdrop-blur-3xl transition-all duration-1000 group ${
        isActive ? 'bg-[#0B101B] text-white scale-[1.01] shadow-[0_40px_80px_rgba(37,99,235,0.15)]' : 'bg-slate-100 dark:bg-slate-900/40 text-slate-400'
    }`}>
      {/* Animated HUD Overlays */}
      {isActive && (
        <>
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.02)_50%)] bg-[length:100%_4px] animate-scan-fast opacity-40" />
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full blur-[100px] bg-blue-600/10 animate-pulse duration-[5000ms]" />
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all rotate-12 scale-150"><Zap className="w-40 h-40" /></div>
        </>
      )}
      
      <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-8 border-b border-white/5 mx-4">
        <div className="flex items-center gap-5">
          <div className={`p-3 rounded-[1.2rem] transition-all duration-1000 ${
              isActive ? 'bg-blue-600 shadow-xl shadow-blue-500/20 rotate-0' : 'bg-slate-200 dark:bg-slate-800 rotate-12'
          }`}>
            <ShieldAlert className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
          </div>
          <div className="flex flex-col">
            <CardTitle className="text-[12px] font-black uppercase tracking-[0.3em] leading-none opacity-80">
              Advanced_Threat_Core
            </CardTitle>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2 leading-none">v4.1.0_Sentinel_Node</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
            {isActive ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 rounded-full border border-blue-500/20">
                    <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                    <span className="text-[9px] font-black text-blue-400 tracking-[0.2em]">LIVE_SCAN</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded-full">
                    <PowerOff className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[9px] font-black text-slate-400 tracking-[0.2em]">OFFLINE</span>
                </div>
            )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pt-10 space-y-10 px-8">
        
        {/* ACTIVE NEURAL STREAM */}
        {isActive ? (
            <div className="space-y-8">
                <Sheet>
                <SheetTrigger asChild>
                    <div className="group cursor-pointer space-y-5 p-6 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-95 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Brain className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Biometric_Intelligence</span>
                            </div>
                            <div className={`px-4 py-1.5 rounded-2xl text-[10px] font-black border transition-colors ${aiIntegrity > 80 ? 'bg-blue-600/20 text-blue-400 border-blue-500/10' : 'bg-red-600/20 text-red-500 border-red-500/20'}`}>
                                {aiIntegrity}% HUMAN
                            </div>
                        </div>
                        
                        <div className="relative h-2 w-full bg-slate-950/50 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className={`h-full transition-all duration-1000 relative ${aiIntegrity > 80 ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-red-500'}`}
                                style={{ width: `${aiIntegrity}%` }}
                            >
                                <div className="absolute top-0 right-0 h-full w-4 bg-white/40 blur-md animate-pulse-fast" />
                            </div>
                        </div>
                        <div className="flex justify-between items-center px-2">
                             <div className="flex items-center gap-2">
                                <ScanLine className="w-3 h-3 text-blue-400 group-hover:animate-pulse" />
                                <p className="text-[9px] text-blue-400 font-extrabold uppercase tracking-widest">{displayText}</p>
                             </div>
                             <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                    </div>
                </SheetTrigger>
                <SheetContent className="w-[450px] bg-[#0B0F19] border-none text-white p-12 overflow-y-auto">
                    <SheetHeader className="pb-10 border-b border-white/5">
                        <SheetTitle className="flex items-center gap-5 text-2xl font-black italic tracking-tighter">
                            <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/20">
                                <Cpu className="w-7 h-7 text-blue-400" />
                            </div>
                            NEURAL_HUB
                        </SheetTitle>
                        <SheetDescription className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mt-2">
                            Advanced.Biometric.Diagnostics.v4.1
                        </SheetDescription>
                    </SheetHeader>

                    <div className="py-12 space-y-12">
                        <div className="flex flex-col items-center">
                            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                                <div className={`absolute inset-0 rounded-full border-2 border-dashed animate-spin-slow ${aiIntegrity > 50 ? 'border-blue-500/20' : 'border-red-500/20'}`} />
                                <div className={`absolute inset-4 rounded-full border animate-pulse ${aiIntegrity > 50 ? 'border-blue-500/10' : 'border-red-500/10'}`} />
                                <span className={`text-6xl font-black tracking-tighter italic ${aiIntegrity > 50 ? 'text-blue-400' : 'text-red-400'}`}>{aiIntegrity}%</span>
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500">Integrity_Coefficient</span>
                        </div>

                        <div className="space-y-10 px-4">
                            <Button 
                                onClick={onSimulate}
                                className="w-full h-16 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl active:scale-95"
                            >
                                <Play className="w-4 h-4 mr-3" /> Trigger_Bot_Pattern
                            </Button>
                        </div>
                        
                        <div className="p-8 rounded-[2.2rem] bg-slate-900/60 border border-white/5 font-mono text-[10px] space-y-3 shadow-inner">
                            <div className="text-blue-500 font-black underline underline-offset-4 mb-4 uppercase">System_Output:</div>
                            <div className="text-slate-500">[{new Date().toLocaleTimeString()}] INITIATING_DEEP_SCAN...</div>
                            <div className={aiIntegrity < 50 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                                RESULT: {aiIntegrity < 50 ? "ALERT_BOT_SIGNATURE_CONFIRMED" : "IDENTITY_CONFIRMED_HUMAN"}
                            </div>
                        </div>
                    </div>
                </SheetContent>
                </Sheet>

                {/* DYNAMIC WAF GRID */}
                <div className="grid grid-cols-2 gap-6">
                    {[
                        { label: 'SQL_INTERDICT', icon: Terminal, active: threats.sqli, id: 'SQLi' },
                        { label: 'XSS_MITIGATION', icon: Zap, active: threats.xss, id: 'XSS' }
                    ].map(waf => (
                        <div key={waf.id} className={`p-4.5 rounded-[1.8rem] border-none transition-all duration-700 ${
                            waf.active ? 'bg-red-600 shadow-[0_20px_40px_rgba(220,38,38,0.3)] text-white' : 'bg-white/5 text-slate-500'
                        }`}>
                            <div className="flex items-center gap-2.5 mb-2.5">
                                <waf.icon className={`w-3.5 h-3.5 ${waf.active ? 'text-white' : 'text-slate-600'}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">[{waf.id}]</span>
                            </div>
                            <div className={`text-[11px] font-black italic tracking-tighter leading-none ${waf.active ? 'text-white' : 'text-slate-600'}`}>
                                {waf.active ? 'MITIGATED' : 'SCANNING...'}
                            </div>
                        </div>
                    ))}
                </div>

                {/* STIMULATION ACTION */}
                <Button 
                    onClick={onSimulate}
                    variant="outline"
                    className="w-full h-16 rounded-[2rem] border-2 border-white/5 bg-white/5 hover:bg-red-600/10 hover:border-red-600/30 text-slate-400 hover:text-red-500 font-black uppercase tracking-[0.3em] text-[10px] transition-all active:scale-95 group/btn shadow-sm"
                >
                    <Activity className="w-4 h-4 mr-3 group-hover/btn:animate-pulse" /> Simulate_Bot_Pattern
                </Button>
            </div>
        ) : (
            <div className="p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                <Lock className="w-10 h-10 text-slate-400" />
                <span className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400">Core_Offline</span>
            </div>
        )}

      </CardContent>
    </Card>
  )
}
