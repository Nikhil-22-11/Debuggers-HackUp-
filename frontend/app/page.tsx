'use client'

import { useState, useCallback, useEffect } from 'react'
import Sidebar from '@/components/dashboard/sidebar'
import Header from '@/components/dashboard/header'
import KPICards from '@/components/dashboard/kpi-cards'
import TrafficTimeline from '@/components/dashboard/traffic-timeline'
import TrafficHeatmap from '@/components/dashboard/traffic-heatmap'
import MitigationFunnel from '@/components/dashboard/mitigation-funnel'
import RiskScatter from '@/components/dashboard/risk-scatter'
import ThreatWaterfall from '@/components/dashboard/threat-waterfall'
import MetricGauges from '@/components/dashboard/metric-gauges'
import ThreatFeed from '@/components/dashboard/threat-feed'
import AttackingIPs from '@/components/dashboard/attacking-ips'
import DetectionAccuracy from '@/components/dashboard/detection-accuracy'
import NetworkIntel from '@/components/dashboard/network-intel'
import AdvancedThreatIntel from '@/components/dashboard/advanced-threat-intel'
import { useToast } from '@/hooks/use-toast'
import { useBiometrics } from '@/hooks/use-biometrics-engine'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Zap, Play, Wifi, EyeOff, ShieldAlert, Bug, Activity, RefreshCw, Terminal, Globe, Shield, ChevronRight, Layers, Monitor, Sliders, Database, History, Settings2, User, Moon, Sun, Fingerprint, MapPin, Search, FileText, Download, CheckCircle2, AlertCircle, Lock, Key, Settings, Server, ShieldCheck, Map, Smartphone, Globe2, Rss, ArrowRight, Share2, Archive, Calendar, DatabaseZap, Power, Radio } from 'lucide-react'

export interface FilterState {
  timeRange: string
  riskLevel: string
  status: string
}

export default function Home() {
  const router = useRouter()
  const { metrics, simulateVpn, toggleStealthMode, toggleBOLA, triggerAttackSimulation, resetLoginAttempts } = useBiometrics()

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated')
    if (auth !== 'true') {
      router.replace('/login')
    }
  }, [router])

  const [activeView, setActiveView] = useState('dashboard')
  const [attackSimulated, setAttackSimulated] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isAdvancedActive, setIsAdvancedActive] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    timeRange: 'Last 24 Hours',
    riskLevel: 'All Levels',
    status: 'All'
  })
  
  const { toast } = useToast()

  const handleSimulateAttack = useCallback(() => {
    setAttackSimulated(true)
    triggerAttackSimulation(true)
    toast({ title: 'Interdiction Cycle', description: `Simulation Active. Advanced Monitoring Live.` })
    
    setTimeout(() => {
        setAttackSimulated(false)
        triggerAttackSimulation(false)
    }, 12000)
  }, [toast, triggerAttackSimulation])

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-1000 ${isDarkMode ? 'dark bg-[#0B0F19] text-white' : 'bg-[#f8fafc] text-slate-900 border-none'}`}>
      
      <div className={`hidden lg:block relative z-10 border-none transition-all`}>
        <Sidebar activeView={activeView} onViewChange={setActiveView} filters={filters} onFilterChange={handleFilterChange} />
      </div>

      <div className={`flex-1 flex flex-col overflow-hidden relative z-10 transition-all ${attackSimulated ? 'bg-red-500/5 shadow-[inset_0_0_100px_rgba(239,68,68,0.05)]' : ''}`}>
        <Header onSimulateAttack={handleSimulateAttack} biometrics={metrics} />

        <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="px-8 lg:px-12 py-12 max-w-[1700px] mx-auto w-full space-y-16 animate-in fade-in duration-1000">
            
            <div className="flex flex-col gap-3 mb-14">
                <div className="flex items-center gap-4">
                   <div className="w-2.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_#2563eb]" />
                   <h2 className="text-4xl font-black tracking-tighter uppercase leading-none italic">{activeView}</h2>
                </div>
                <span className="text-[11px] font-black uppercase text-slate-300 dark:text-slate-700 tracking-[0.5em] ml-6">FinShield AI Core v4.1.0</span>
            </div>

            {/* DASHBOARD VIEW */}
            {activeView === 'dashboard' && (
              <div className="space-y-14 animate-in slide-in-from-bottom-5 duration-700">
                <KPICards />
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                    <div className={`xl:col-span-8 rounded-[3.5rem] p-12 shadow-3xl transition-all duration-700 border-none ${isDarkMode ? 'bg-slate-900/40 opacity-90' : 'bg-white'}`}>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20"><Activity className="w-5 h-5 text-white" /></div>
                            <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none">Traffic Dynamics Matrix</h3>
                        </div>
                        <TrafficTimeline filters={filters} isUnderAttack={attackSimulated} />
                    </div>
                    <div className="xl:col-span-4 space-y-12 h-full">
                        <AdvancedThreatIntel isActive={isAdvancedActive} onSimulate={handleSimulateAttack} />
                        <NetworkIntel />
                    </div>
                </div>
                <div className="w-full">
                    <ThreatFeed filters={filters} isUnderAttack={attackSimulated} />
                </div>
              </div>
            )}

            {/* ANALYTICS VIEW - MAP PURGED */}
            {activeView === 'analytics' && (
              <div className="space-y-16 animate-in fade-in duration-700 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className={`rounded-[3.5rem] p-12 shadow-2xl border-none ${isDarkMode ? 'bg-slate-900/40' : 'bg-white'}`}><TrafficHeatmap filters={filters} isUnderAttack={attackSimulated} /></div>
                    <div className={`rounded-[3.5rem] p-12 shadow-2xl border-none ${isDarkMode ? 'bg-slate-900/40' : 'bg-white'}`}><DetectionAccuracy filters={filters} /></div>
                    <div className={`rounded-[3.5rem] p-12 shadow-2xl border-none ${isDarkMode ? 'bg-slate-900/40' : 'bg-white'}`}><RiskScatter filters={filters} isUnderAttack={attackSimulated} /></div>
                    <div className={`rounded-[3.5rem] p-12 shadow-2xl border-none ${isDarkMode ? 'bg-slate-900/40' : 'bg-white'}`}><MitigationFunnel filters={filters} /></div>
                </div>
              </div>
            )}

            {activeView === 'threats' && (
              <div className="space-y-12 animate-in fade-in duration-700 pb-20">
                <div className={`rounded-[3.5rem] p-14 shadow-3xl border-none ${isDarkMode ? 'bg-slate-900/40' : 'bg-white'}`}><AttackingIPs filters={filters} isUnderAttack={attackSimulated} /></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12">
                    <div className={`rounded-[3.5rem] p-14 shadow-2xl border-none ${isDarkMode ? 'bg-slate-900/40' : 'bg-white'}`}><ThreatWaterfall filters={filters} /></div>
                    <div className={`rounded-[3.5rem] p-14 shadow-2xl border-none ${isDarkMode ? 'bg-slate-900/40' : 'bg-white'}`}><MetricGauges filters={filters} /></div>
                </div>
              </div>
            )}

            {activeView === 'reports' && (
              <div className="space-y-12 animate-in zoom-in duration-700 pb-24 max-w-[1300px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[ { title: 'Security_Log', desc: 'Full behavioral cycle logs.', icon: DatabaseZap, color: 'blue' },
                       { title: 'Threat_Vector', desc: 'Pattern recognized bot-data.', icon: ShieldCheck, color: 'emerald' },
                       { title: 'Audit_History', desc: 'Historical override archives.', icon: Archive, color: 'purple' }
                    ].map((report) => {
                        const Icon = report.icon
                        return (
                        <div key={report.title} className={`p-12 rounded-[2.5rem] border-none shadow-2xl space-y-10 flex flex-col justify-between hover:-translate-y-2 transition-all group ${isDarkMode ? 'bg-slate-900/40' : 'bg-white'}`}>
                            <div className={`p-4 rounded-3xl w-fit ${report.color === 'blue' ? 'bg-blue-50 dark:bg-blue-600/10' : report.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-600/10' : 'bg-purple-50 dark:bg-purple-600/10'}`}>
                                <Icon className={`w-8 h-8 ${report.color === 'blue' ? 'text-blue-600' : report.color === 'emerald' ? 'text-emerald-600' : 'text-purple-600'}`} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{report.title}</h3>
                                <p className="text-[13px] font-black text-slate-400 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">{report.desc}</p>
                            </div>
                            <Button className="w-full h-16 rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-sm"><Download className="w-4 h-4 mr-3" /> Get_Archive</Button>
                        </div>
                        )
                    })}
                </div>
              </div>
            )}

            {activeView === 'settings' && (
              <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    <div className={`p-12 rounded-[3.5rem] border-none shadow-3xl flex flex-col justify-between h-full group ${isDarkMode ? 'bg-slate-900/40' : 'bg-white'}`}>
                        <div className="flex items-center gap-6 mb-12">
                            <div className="p-3.5 bg-blue-50 dark:bg-blue-600/10 rounded-2xl shadow-lg shadow-blue-500/5 transition-all group-hover:shadow-blue-500/20"><Key className="w-6 h-6 text-blue-600 font-black" /></div>
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">API Infrastructure</h3>
                                <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-2">Surveillance_Archives</p>
                            </div>
                        </div>
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4 group-hover:text-blue-500 transition-colors">Production API Key</Label>
                                <div className="flex gap-4">
                                    <Input defaultValue="fs_node_••••••••••••••••••••" className={`h-16 rounded-[1.8rem] font-mono px-8 font-black flex-1 border-none ${isDarkMode ? 'bg-slate-950/40' : 'bg-slate-50'}`} disabled />
                                    <Button variant="outline" className="h-16 rounded-[1.8rem] px-8 font-black border-2 active:scale-95 text-xs">Rotate</Button>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4">Alert Webhook URL</Label>
                                <Input defaultValue="https://api.finshield.ai/events/v4" className={`h-16 rounded-[1.8rem] px-8 font-bold border-none ${isDarkMode ? 'bg-slate-950/40' : 'bg-slate-50'}`} />
                            </div>
                        </div>
                    </div>

                    <div className={`p-12 rounded-[3.5rem] border-none shadow-3xl flex flex-col justify-between h-full group ${isDarkMode ? 'bg-slate-900/40' : 'bg-white'}`}>
                        <div className="flex items-center gap-6 mb-12">
                            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-600/10 rounded-2xl shadow-lg shadow-emerald-500/5"><ShieldCheck className="w-6 h-6 text-emerald-600" /></div>
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">Protection Thresholds</h3>
                                <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-2">Active_Interdiction_Logic</p>
                            </div>
                        </div>
                        <div className="space-y-12">
                            <div className={`flex items-center justify-between p-8 rounded-[2rem] transition-all border-2 border-dashed ${isAdvancedActive ? 'bg-blue-600/5 border-blue-500' : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-50'}`}>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3">
                                        <Radio className={`w-4 h-4 ${isAdvancedActive ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`} />
                                        <span className={`text-sm font-black uppercase tracking-tight ${isAdvancedActive ? 'text-blue-600' : 'text-slate-400'}`}>Advanced Intelligence Scan</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">Activate global threat HUD</span>
                                </div>
                                <Switch checked={isAdvancedActive} onCheckedChange={setIsAdvancedActive} className="scale-[1.3] data-[state=checked]:bg-blue-600" />
                            </div>
                            
                            <div className="flex items-center justify-between px-2">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black leading-none uppercase tracking-tight">Aggressive Bot Mitigation</span>
                                    <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 mt-3 uppercase tracking-widest">Enable bot interdiction flow</span>
                                </div>
                                <Switch className="scale-[1.3]" />
                            </div>
                        </div>
                    </div>

                    <div className={`p-12 rounded-[3.5rem] border-none shadow-3xl space-y-14 group ${isDarkMode ? 'bg-slate-900/40' : 'bg-white'}`}>
                        <div className="flex items-center gap-6">
                            <div className="p-3.5 bg-purple-50 dark:bg-purple-600/10 rounded-2xl shadow-lg shadow-purple-500/5"><Smartphone className="w-6 h-6 text-purple-600" /></div>
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">Identity Verification</h3>
                                <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-2 leading-none italic">Biometric_Neural_Calibration</p>
                            </div>
                        </div>
                        <div className="space-y-12">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black leading-none uppercase tracking-tight">Behavioral Profiling</span>
                                    <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 mt-3 uppercase tracking-widest leading-none">Neural mouse tracking</span>
                                </div>
                                <Switch defaultChecked className="scale-[1.3] data-[state=checked]:bg-purple-600" />
                            </div>
                            <div className="flex items-center justify-between px-2">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black leading-none uppercase tracking-tight">Privacy Masking</span>
                                    <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 mt-3 uppercase tracking-widest leading-none">Telemetry Anonymization</span>
                                </div>
                                <Switch className="scale-[1.3]" />
                            </div>
                        </div>
                    </div>

                    <div className={`p-12 rounded-[3.5rem] border-none shadow-3xl space-y-14 group ${isDarkMode ? 'bg-slate-900/40' : 'bg-white'}`}>
                        <div className="flex items-center gap-6">
                            <div className="p-3.5 bg-sky-50 dark:bg-sky-600/10 rounded-2xl shadow-lg shadow-sky-500/5"><Globe2 className="w-6 h-6 text-sky-600" /></div>
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">Geo Infrastructure</h3>
                                <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-2 leading-none italic">Regional_Traffic_Governance</p>
                            </div>
                        </div>
                        <div className="space-y-12">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black leading-none uppercase tracking-tight">Restrict High-Risk Geos</span>
                                    <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 mt-3 uppercase tracking-widest leading-none">Tier-3 Threat Auto-Block</span>
                                </div>
                                <Switch defaultChecked className="scale-[1.3] data-[state=checked]:bg-sky-600" />
                            </div>
                            <div className="flex items-center justify-between px-2">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black leading-none uppercase tracking-tight">Strict VPN Policy</span>
                                    <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 mt-3 uppercase tracking-widest leading-none">Datacenter Exit Denial</span>
                                </div>
                                <Switch className="scale-[1.3]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`p-14 rounded-[4rem] border-none flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl transition-all duration-1000 relative overflow-hidden group ${isDarkMode ? 'bg-slate-950 border border-slate-900' : 'bg-slate-950'}`}>
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all group-hover:scale-110"><Shield className="w-40 h-40 text-white" /></div>
                    <div className="flex items-center gap-12 relative z-10">
                        <div className={`p-8 rounded-[2.5rem] bg-white/5 border border-white/5 active:scale-95 transition-all text-white ${isDarkMode ? 'rotate-12 bg-white/10' : ''}`}>
                            {isDarkMode ? <Moon className="w-12 h-12" /> : <Sun className="w-12 h-12" />}
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">FinShield Autonomous Elite</h3>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                                <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.5em] leading-none">Node_Persistence_Active_v4.1</span>
                            </div>
                        </div>
                    </div>
                    <Button onClick={() => setIsDarkMode(!isDarkMode)} className="bg-white hover:bg-slate-100 text-slate-950 font-black uppercase tracking-[0.3em] py-12 px-20 rounded-[2.5rem] active:scale-95 relative z-10 shadow-2xl transition-all lg:w-fit w-full text-xs">
                        {isDarkMode ? 'SWITCH_LIGHT' : 'SWITCH_OBSIDIAN'}
                    </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

    </div>
  )
}
