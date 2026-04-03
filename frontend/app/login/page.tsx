'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Lock, User, Activity, Play, MousePointer, Zap, Globe, EyeOff, ShieldAlert, Fingerprint, ChevronRight, Sliders, Monitor, Layers, RefreshCw, LockKeyhole, Wifi, CheckCircle2, AlertCircle, Timer } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useBiometrics } from '@/hooks/use-biometrics-engine'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const { metrics, recordKey, updateBotScore, tripHoneypot, simulateVpn, toggleStealthMode, recordLoginAttempt, resetLoginAttempts } = useBiometrics()
  const { toast } = useToast()
  
  const [scanlinesActive, setScanlinesActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [botRunning, setBotRunning] = useState(false)
  const [verificationLogs, setVerificationLogs] = useState<{ id: number; msg: string; status: 'pending' | 'success' | 'error' }[]>([])
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [captchaCode, setCaptchaCode] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaVerifying, setCaptchaVerifying] = useState(false)
  const [lockoutActive, setLockoutActive] = useState(false)
  const [lockoutTimer, setLockoutTimer] = useState(0)
  
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const submitBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    resetLoginAttempts()
  }, [])

  useEffect(() => {
    if (lockoutTimer > 0) {
      const timer = setTimeout(() => setLockoutTimer(v => v - 1), 1000)
      return () => clearTimeout(timer)
    } else if (lockoutTimer === 0 && lockoutActive) {
      setLockoutActive(false)
      resetLoginAttempts()
    }
  }, [lockoutTimer, lockoutActive])

  const generateCaptcha = (length = 4) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaCode(result)
  }

  const runLiveBotAttack = async () => {
    if (botRunning) return
    setBotRunning(true)
    
    if (usernameRef.current) usernameRef.current.value = ''
    if (passwordRef.current) passwordRef.current.value = ''
    
    const typeInto = async (ref: React.RefObject<HTMLInputElement | null>, text: string) => {
      const charDelay = metrics.stealthMode ? 150 : 20 
      for (const char of text) {
        if (ref.current) {
          ref.current.value += char
          ref.current.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }))
          recordKey()
        }
        await new Promise(r => setTimeout(r, charDelay))
      }
    }

    await new Promise(r => setTimeout(r, 200))
    tripHoneypot() 
    
    await typeInto(usernameRef, 'admin@finshield.ai')
    await new Promise(r => setTimeout(r, 100))
    await typeInto(passwordRef, 'bot_attack_2026')
    setBotRunning(false)
    submitBtnRef.current?.click()
  }

  const handleCaptchaVerify = () => {
    setCaptchaVerifying(true)
    setTimeout(() => {
      if (captchaInput.toUpperCase() === captchaCode.toUpperCase()) {
        resetLoginAttempts()
        setShowCaptcha(false)
        completeLogin()
      } else {
        generateCaptcha(6)
        setCaptchaInput('')
      }
      setCaptchaVerifying(false)
    }, 1000)
  }

  const completeLogin = () => {
    resetLoginAttempts()
    setSuccess(true)
    localStorage.setItem('isAuthenticated', 'true')
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (showCaptcha) {
      handleCaptchaVerify()
      return
    }

    const email = usernameRef.current?.value || ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isEmailValid = emailRegex.test(email)

    setLoading(true)
    setVerificationLogs([
      { id: 1, msg: 'Validating_Protocol...', status: 'pending' },
      { id: 2, msg: 'Analyzing_Behavioral...', status: 'pending' },
      { id: 3, msg: 'Inspecting_Payload...', status: 'pending' }
    ])

    updateBotScore()

    setTimeout(() => {
      if (!isEmailValid) {
          setVerificationLogs(prev => prev.map(l => l.id === 1 ? { ...l, status: 'error', msg: 'Protocol_Violation: Invalid Email' } : l))
          setTimeout(() => {
            setLoading(false)
            toast({ title: 'Protocol Rejected', description: 'User_Key must be a valid email format.', variant: 'destructive' })
          }, 1000)
          return
      }

      setVerificationLogs(prev => prev.map(l => l.id === 1 ? { ...l, status: 'success', msg: 'Protocol_Authenticated' } : l))

      setTimeout(() => {
        const payloadCompromised = metrics.threats.sqli || metrics.threats.xss
        setVerificationLogs(prev => prev.map(l => l.id === 3 ? { ...l, status: payloadCompromised ? 'error' : 'success', msg: payloadCompromised ? 'Detected!' : 'Payload_Secure' } : l))
        
        setTimeout(() => {
          if (metrics.status === 'HUMAN') {
            setVerificationLogs(prev => prev.map(l => l.id === 2 ? { ...l, status: 'success', msg: 'Identity Verified' } : l))
            completeLogin()
          } else {
            recordLoginAttempt()
            const isBruteForce = metrics.loginAttempts + 1 >= 3
            if (isBruteForce) {
              setLockoutActive(true); setLockoutTimer(60)
            } else {
              generateCaptcha(6); setShowCaptcha(true)
            }
            setLoading(false)
          }
        }, 800)
      }, 600)
    }, 600)
  }

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 pt-16 font-sans overflow-hidden`}>
      
      {/* Live Identity Banner */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[60] transition-all duration-700 ${metrics.mouseMovements > 0 || metrics.network.isVpn ? 'translate-y-0 opacity-100' : '-translate-y-16 opacity-0'}`}>
        <div className={`px-6 py-2 rounded-xl border-2 backdrop-blur-3xl shadow-3xl flex items-center gap-5 ${
          lockoutActive ? 'bg-red-600/30 border-red-500' :
          metrics.network.isVpn ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400 animate-pulse' :
          'bg-emerald-500/5 border-emerald-500/50 text-emerald-500'
        }`}>
          <div className="flex items-center gap-2">
             {lockoutActive ? <ShieldAlert className="w-4 h-4 text-white" /> : metrics.network.isVpn ? <Globe className="w-4 h-4" /> : <Shield className="w-3.5 h-3.5" />}
             <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                {lockoutActive ? 'BLACKOUT' : metrics.network.isVpn ? 'IP_MASKING: ACTIVE' : `CORE: ${metrics.status}`}
             </span>
          </div>
          <div className={`w-1.5 h-1.5 rounded-full ${metrics.network.isVpn ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />
        </div>
      </div>

      {lockoutActive && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/98 backdrop-blur-3xl px-8 animate-in fade-in duration-500">
           <div className="w-full max-w-lg text-center space-y-12">
                <div className="relative p-10 bg-red-600 rounded-[3.5rem] shadow-[0_0_100px_#ef4444] border-4 border-white/20 ml-auto mr-auto w-fit animate-bounce">
                    <ShieldAlert className="w-20 h-20 text-white" />
                </div>
              <div className="space-y-6">
                <h2 className="text-6xl font-black text-white uppercase tracking-tighter italic leading-none">Hard Lockout</h2>
                <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-red-600/20 border border-red-500/40">
                    <Timer className="w-5 h-5 text-red-500" />
                    <span className="text-xl font-mono font-black text-red-500 uppercase tracking-widest">T-MINUS {lockoutTimer}S</span>
                </div>
              </div>
           </div>
        </div>
      )}

      {scanlinesActive && (
          <div className="fixed inset-0 z-10 pointer-events-none opacity-[0.05] overflow-hidden">
              <div className="w-full h-px bg-blue-600 animate-scan" style={{ animationDuration: '6s' }} />
          </div>
      )}

      <div className="z-10 w-full max-w-[420px] animate-slide-up flex flex-col items-center">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-4 relative drop-shadow-2xl">
            <div className="bg-slate-950 p-3 rounded-2xl border border-white/10 shadow-2xl">
              <Shield className="w-9 h-9 text-blue-500" />
            </div>
            <div className="flex flex-col items-start leading-none">
                <span className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase underline underline-offset-8 decoration-blue-500/30">FinShield AI</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 opacity-50 italic">Security_Core_v4.1</span>
            </div>
          </div>
        </div>

        <Card className={`bg-white/95 backdrop-blur-2xl border-slate-200 shadow-2xl relative w-full border-2 rounded-[3.5rem] overflow-hidden`}>
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-700" />
          <CardHeader className="space-y-1 pb-10 pt-12 text-center relative z-10">
            <CardTitle className="text-4xl font-black text-slate-900 tracking-tighter lowercase italic leading-none">Authorization</CardTitle>
            <CardDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] italic mt-2">Identity Scan Required</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className="relative z-10 px-10 pb-12 space-y-10">
              {!showCaptcha ? (
                <div className="space-y-8">
                  {loading && (
                    <div className="bg-slate-950 p-7 rounded-[2.5rem] space-y-5 animate-in slide-in-from-bottom-4 duration-500 shadow-3xl border border-white/5">
                        {verificationLogs.map((log) => (
                          <div key={log.id} className="flex items-center justify-between group">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${log.status === 'pending' ? 'text-slate-500' : log.status === 'error' ? 'text-red-500' : 'text-emerald-400'}`}>
                                {log.msg}
                            </span>
                            {log.status === 'pending' ? <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" /> : log.status === 'error' ? <AlertCircle className="w-3.5 h-3.5 text-red-500 shadow-[0_0_10px_#ef4444]" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                        ))}
                    </div>
                  )}
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] ml-2 opacity-40">User_Key (Email)</Label>
                    <div className="relative">
                      <User className="absolute left-6 top-5 h-4 w-4 text-slate-400" />
                      <Input ref={usernameRef} placeholder="admin@finshield.ai" className="bg-slate-50 border-slate-100 h-16 text-slate-900 pl-16 rounded-[1.8rem] font-bold tracking-tight focus-visible:ring-blue-600 transition-all shadow-sm" required onKeyDown={recordKey} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] ml-2 opacity-40">Master_Code</Label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-5 h-4 w-4 text-slate-400" />
                      <Input ref={passwordRef} type="password" placeholder="••••••••" className="bg-slate-50 border-slate-100 h-16 text-slate-900 pl-16 rounded-[1.8rem] font-bold tracking-tight focus-visible:ring-blue-600 transition-all shadow-sm" required onKeyDown={recordKey} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="p-12 rounded-[3.5rem] bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden shadow-4xl border border-white/5 group">
                    <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[10px] uppercase font-black text-slate-600 mb-6 tracking-[0.6em] relative z-10 italic">Neural Challenge</span>
                    <div className="text-6xl font-mono font-black tracking-[0.5em] text-blue-500 relative z-10 drop-shadow-[0_0_15px_#2563eb]">{captchaCode}</div>
                  </div>
                  <Input value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="ENTER_ID" className="bg-slate-50 border-slate-200 h-16 text-slate-900 text-center font-mono text-2xl uppercase tracking-[0.8em] focus-visible:ring-blue-600 rounded-[1.8rem] shadow-sm" required autoFocus />
                </div>
              )}
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4 px-2">
                   <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${metrics.loginAttempts > 0 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>Integrity Sync</span>
                      <span className="text-[10px] font-black text-slate-500">{metrics.loginAttempts}/3</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-red-600 transition-all duration-1000 shadow-[0_0_10px_#ef4444]" style={{ width: `${(metrics.loginAttempts / 3) * 100}%` }} />
                   </div>
                </div>
                <Button type="submit" ref={submitBtnRef} className={`w-full font-black uppercase tracking-[0.4em] text-[11px] h-18 shadow-2xl transition-all duration-500 italic ${metrics.loginAttempts > 1 ? 'bg-red-600' : 'bg-slate-950'} text-white rounded-[1.8rem] hover:scale-[1.02] active:scale-95`}>
                  {loading ? "INITIALIZING..." : showCaptcha ? "SYNC_IDENTITY" : "ACCESS_PORTAL"}
                </Button>
              </div>
          </form>
        </Card>
      </div>

      <div className="fixed bottom-10 right-10 z-[70]">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-[1.8rem] w-18 h-18 bg-white shadow-4xl hover:bg-slate-50 border-slate-200 border-2 active:scale-95 group">
              <Activity className="w-8 h-8 text-slate-950 group-hover:text-blue-600 transition-colors" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[440px] border-l-slate-100 bg-white/95 backdrop-blur-3xl px-0 shadow-5xl">
            <div className="px-8 py-8 flex flex-col h-full overflow-y-auto overflow-x-hidden">
                <SheetHeader className="mb-8 text-left border-b border-slate-100 pb-8">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-4">
                            <Activity className="w-6 h-6 text-blue-600" />
                            <SheetTitle className="text-xl font-black italic tracking-tighter text-slate-900 uppercase leading-none">FINSHIELD_COCKPIT</SheetTitle>
                        </div>
                        <Button 
                            variant="destructive" size="sm" 
                            className="h-9 rounded-full font-black text-[9px] uppercase tracking-widest px-4"
                            onClick={() => { resetLoginAttempts(); toast({ title: 'System Flush', description: 'Real-time stats cleared.' }) }}
                        >
                            <RefreshCw className="w-3.5 h-3.5 mr-2" /> Flush
                        </Button>
                    </div>
                </SheetHeader>

                <div className="space-y-10 flex-1 pb-10">
                    <div className="space-y-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-1">Threat Control Hub</span>
                        <div className="grid grid-cols-1 gap-4">
                            
                            <Button onClick={runLiveBotAttack} className="h-18 bg-slate-950 hover:bg-black rounded-[1.8rem] shadow-xl transition-all px-8 text-left group">
                                <Play className="w-5 h-5 text-red-500 mr-6" />
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-black text-white uppercase tracking-widest leading-none">Execute Bot Attack</span>
                                    <span className="text-[8px] text-slate-500 uppercase mt-1 italic leading-none tracking-widest">Neural Sequence</span>
                                </div>
                                <ChevronRight className="ml-auto w-4 h-4 text-slate-800" />
                            </Button>

                            <Button 
                                onClick={async () => {
                                    toast({ title: 'Brute Force Active', description: 'Testing 3-strike threshold.' });
                                    recordLoginAttempt(); await new Promise(r => setTimeout(r, 800));
                                    recordLoginAttempt(); await new Promise(r => setTimeout(r, 800));
                                    recordLoginAttempt(); setTimeout(() => { setLockoutActive(true); setLockoutTimer(60); }, 500);
                                }}
                                className="h-18 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-[1.8rem] shadow-sm px-8 text-left group"
                            >
                                <LockKeyhole className="w-5 h-5 text-red-600 mr-6" />
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest leading-none">Brute Force Burst</span>
                                    <span className="text-[8px] text-slate-400 uppercase mt-1 italic leading-none tracking-widest">Protocol Test</span>
                                </div>
                                <ChevronRight className="ml-auto w-4 h-4 text-slate-100" />
                            </Button>

                            <Button 
                                onClick={() => {
                                    toggleStealthMode(!metrics.stealthMode);
                                    toast({ title: 'Stealth Mode', description: `Simulation set to ${!metrics.stealthMode ? 'LOW-AND-SLOW' : 'DEFAULT'}` })
                                }} 
                                className={`h-18 rounded-[1.8rem] shadow-sm transition-all px-8 border-2 ${metrics.stealthMode ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                            >
                                <EyeOff className="w-5 h-5 mr-6" />
                                <div className="flex flex-col text-left flex-1">
                                    <span className="text-[12px] font-black uppercase tracking-widest leading-none">Low-and-Slow Mode</span>
                                    <span className={`text-[8px] uppercase mt-1 tracking-widest ${metrics.stealthMode ? 'text-purple-200' : 'text-slate-400'}`}>Stealth Identity</span>
                                </div>
                                <div className="px-3 py-1 bg-black/10 rounded-lg text-[9px] font-black">{metrics.stealthMode ? 'ON' : 'OFF'}</div>
                            </Button>

                            <Button 
                                onClick={() => {
                                    simulateVpn(!metrics.network.isVpn);
                                    toast({ title: 'VPN Simulation', description: `VPN Masking turned ${!metrics.network.isVpn ? 'ON' : 'OFF'}` })
                                }} 
                                className={`h-18 rounded-[1.8rem] shadow-sm transition-all px-8 border-2 ${metrics.network.isVpn ? 'bg-cyan-600 border-cyan-600 text-white' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'}`}
                            >
                                <Globe className="w-5 h-5 mr-6" />
                                <div className="flex flex-col text-left flex-1">
                                    <span className="text-[12px] font-black uppercase tracking-widest leading-none">VPN Masking</span>
                                    <span className={`text-[8px] uppercase mt-1 tracking-widest ${metrics.network.isVpn ? 'text-cyan-200' : 'text-slate-400'}`}>IP Rotation</span>
                                </div>
                                <div className="px-3 py-1 bg-black/10 rounded-lg text-[9px] font-black">{metrics.network.isVpn ? 'ACTIVE' : 'OFF'}</div>
                            </Button>

                        </div>
                    </div>

                    <div className="p-8 rounded-[3rem] bg-slate-950 shadow-5xl space-y-8 flex flex-col items-center relative overflow-hidden group">
                        <div className="relative w-44 h-44 flex items-center justify-center bg-black/60 rounded-[3.5rem] border-[4px] border-white/5 shadow-inner">
                            <svg className="w-36 h-36 transform -rotate-90">
                                <circle cx="72" cy="72" r="66" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                                <circle cx="72" cy="72" r="66" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 66} strokeDashoffset={2 * Math.PI * 66 * (1 - metrics.botScore)} className={`transition-all duration-1000 ${metrics.botScore > 0.7 ? 'text-red-500 shadow-[0_0_20px_#ef4444]' : 'text-cyan-400 shadow-[0_0_20px_#22d3ee]'}`} />
                            </svg>
                            <span className={`absolute text-5xl font-black italic tracking-tighter ${metrics.botScore > 0.7 ? 'text-red-500' : 'text-cyan-400'}`}>
                                {Math.round(metrics.botScore * 100)}%
                            </span>
                        </div>
                        <div className="w-full">
                            <div className={`p-6 rounded-[1.8rem] flex items-center justify-between border-2 transition-all ${metrics.honeypotTripped ? 'bg-red-600/20 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-black/40 border-white/5'}`}>
                                <div className="flex items-center gap-4">
                                    <Zap className={`w-5 h-5 ${metrics.honeypotTripped ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest leading-none">Deception Layer</span>
                                        <span className="text-[8px] font-black text-slate-600 uppercase mt-1 tracking-[0.2em] leading-none italic font-mono">HONEYPOT_ACTIVE</span>
                                    </div>
                                </div>
                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${metrics.honeypotTripped ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-500 opacity-60'}`}>
                                    {metrics.honeypotTripped ? 'TRIPPED' : 'INTACT'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <style jsx global>{`
        @font-face { font-family: 'Outfit'; src: url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;900&display=swap'); }
        body { font-family: 'Outfit', sans-serif; }
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        .animate-scan { animation: scan 4s linear infinite; }
        .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
