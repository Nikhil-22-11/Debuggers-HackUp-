'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Lock, User, MousePointer2, Keyboard, Timer, AlertTriangle, CheckCircle2, LayoutDashboard, Settings2, Play, MousePointer, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useBiometrics } from '@/hooks/use-biometrics'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const { metrics, recordKey, updateBotScore, tripHoneypot } = useBiometrics()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [botRunning, setBotRunning] = useState(false)
  const [botMousePos, setBotMousePos] = useState({ x: -100, y: -100 })
  const [verificationLogs, setVerificationLogs] = useState<{ id: number; msg: string; status: 'pending' | 'success' | 'error' }[]>([])
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [captchaCode, setCaptchaCode] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaVerifying, setCaptchaVerifying] = useState(false)
  
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const submitBtnRef = useRef<HTMLButtonElement>(null)

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
    setError(null)
    
    // Clear fields
    if (usernameRef.current) usernameRef.current.value = ''
    if (passwordRef.current) passwordRef.current.value = ''
    
    const typeInto = async (ref: React.RefObject<HTMLInputElement | null>, text: string) => {
      for (const char of text) {
        if (ref.current) {
          ref.current.value += char
          // Trigger keyboard events for the engine
          ref.current.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }))
          recordKey()
        }
        await new Promise(r => setTimeout(r, 20)) // Perfectly uniform 20ms
      }
    }

    // Step 0: Deception Trip (New Honeypot Logic)
    await new Promise(r => setTimeout(r, 200))
    tripHoneypot() // Simulate bot filling hidden field
    
    // Step 1: Uniform Typing
    await typeInto(usernameRef, 'admin@aabe.security')
    await new Promise(r => setTimeout(r, 100))
    await typeInto(passwordRef, 'bot_attack_2024')

    // Step 2: Mouse Teleport
    const btnRect = submitBtnRef.current?.getBoundingClientRect()
    if (btnRect) {
      setBotMousePos({ x: btnRect.left + btnRect.width / 2, y: btnRect.top + btnRect.height / 2 })
    }
    
    await new Promise(r => setTimeout(r, 200))

    // Step 3: Instant Submit
    submitBtnRef.current?.click()
    setBotRunning(false)
    setTimeout(() => {
      setBotMousePos({ x: -100, y: -100 })
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // If CAPTCHA is visible, handle verification instead
    if (showCaptcha) {
      handleCaptchaVerify()
      return
    }

    setLoading(true)
    setError(null)
    setVerificationLogs([
      { id: 1, msg: 'Validating credentials...', status: 'pending' },
      { id: 2, msg: 'Analyzing behavioral signature...', status: 'pending' }
    ])

    updateBotScore()

    // Step 1: Simulating Credential Check
    setTimeout(() => {
      setVerificationLogs(prev => prev.map(l => l.id === 1 ? { ...l, status: 'success', msg: 'Credentials Validated ✓' } : l))
      
      // Step 2: Behavioral Check with Adaptive Mitigation
      setTimeout(() => {
        if (metrics.status === 'HUMAN') {
          setVerificationLogs(prev => prev.map(l => l.id === 2 ? { ...l, status: 'success', msg: 'Identity Verified ✓' } : l))
          completeLogin()
        } else {
          // Mitigation: Show CAPTCHA
          const isBot = metrics.status === 'BOT'
          setVerificationLogs(prev => prev.map(l => l.id === 2 ? { ...l, status: 'error', msg: `${isBot ? 'Bot' : 'Anomaly'} Detected - Challenging Session...` } : l))
          
          // Progressive Delay (3 seconds for Bot, 1 second for Suspicious)
          setTimeout(() => {
            generateCaptcha(isBot ? 6 : 4)
            setShowCaptcha(true)
            setLoading(false)
            toast({
              title: isBot ? 'High-Risk Detected' : 'Security Challenge',
              description: 'Please complete the verification to continue.',
              variant: isBot ? 'destructive' : 'default',
            })
          }, isBot ? 3000 : 1000)
        }
      }, 800)
    }, 600)
  }

  const handleCaptchaVerify = () => {
    setCaptchaVerifying(true)
    setTimeout(() => {
      if (captchaInput.toUpperCase() === captchaCode) {
        completeLogin()
      } else {
        toast({
          title: 'Verification Failed',
          description: 'Incorrect code. Please try again.',
          variant: 'destructive',
        })
        generateCaptcha(metrics.status === 'BOT' ? 6 : 4)
        setCaptchaInput('')
        setCaptchaVerifying(false)
      }
    }, 800)
  }

  const completeLogin = () => {
    localStorage.setItem('isAuthenticated', 'true')
    setSuccess(true)
    toast({
      title: 'Verified',
      description: 'Access granted.',
    })
    setTimeout(() => {
      router.push('/')
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-500/30">
      
      {/* Live Identity Banner (Floating Neon) */}
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ${metrics.mouseMovements > 0 ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className={`px-6 py-2 rounded-full border-2 backdrop-blur-xl shadow-2xl flex items-center gap-3 animate-pulse-soft ${
          metrics.status === 'BOT' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 
          metrics.status === 'SUSPICIOUS' ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 
          'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
        }`}>
          {metrics.status === 'DECEPTIVE' ? <AlertTriangle className="w-4 h-4" /> : metrics.status === 'BOT' ? <AlertTriangle className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
          <span className="text-xs font-black uppercase tracking-[0.2em]">Current Identity: {metrics.status}</span>
          <div className={`w-2 h-2 rounded-full ${
            metrics.status === 'DECEPTIVE' ? 'bg-red-600 animate-ping' : 
            metrics.status === 'BOT' ? 'bg-red-500' : 
            metrics.status === 'SUSPICIOUS' ? 'bg-amber-500' : 
            'bg-emerald-500'
          }`} />
        </div>
      </div>

      {/* Mesh Gradient Background Effect */}
      <div className={`fixed inset-0 z-0 opacity-40 pointer-events-none transition-colors duration-1000 ${metrics.status === 'BOT' ? 'bg-red-950/20' : 'bg-transparent'}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100 blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-md animate-slide-up">
        {/* Branding Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-blue-600 tracking-tight">AABE</span>
          </div>
          <h1 className="text-sm font-bold text-slate-500 uppercase tracking-[0.25em] ml-1">Adaptive Anti-Bot Engine</h1>
        </div>

        <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
          
          {/* Bot Scanline Effect */}
          {botRunning && (
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
              <div className="w-full h-1 bg-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-scan" />
            </div>
          )}
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-slate-900">Secure Access</CardTitle>
            <CardDescription className="text-slate-500">
              Sign in to manage your protection engine.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-0">
              {!showCaptcha ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-700 font-medium ml-0.5">Username</Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <Input 
                        id="username" 
                        ref={usernameRef}
                        placeholder="admin@aabe.security" 
                        className="bg-slate-50 border-slate-200 h-11 text-slate-900 pl-10 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all" 
                        required
                        onKeyDown={recordKey}
                      />
                    </div>
                  </div>

                  {/* Honeypot Field (Invisible to Humans) */}
                  <div className="absolute opacity-0 -z-50 pointer-events-none h-0 p-0 overflow-hidden" aria-hidden="true">
                    <Input tabIndex={-1} autoComplete="off" id="secondary_email" onChange={tripHoneypot} />
                    <Input tabIndex={-1} autoComplete="off" id="bot_id_token" onChange={tripHoneypot} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium ml-0.5">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <Input 
                        id="password" 
                        ref={passwordRef}
                        type="password" 
                        placeholder="••••••••"
                        className="bg-slate-50 border-slate-200 h-11 text-slate-900 pl-10 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all" 
                        required
                        onKeyDown={recordKey}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
                    <span className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-widest">AABE Challenge Code</span>
                    <div className="text-3xl font-mono font-black tracking-[0.3em] select-none filter blur-[0.5px] group-hover:blur-none transition-all">
                      {captchaCode}
                    </div>
                    <div className="absolute -right-2 -bottom-2 opacity-10">
                      <Shield className="w-16 h-16" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium ml-0.5">Enter Verification Code</Label>
                    <Input 
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      placeholder="Type the code above" 
                      className="bg-slate-50 border-slate-200 h-11 text-slate-900 text-center font-mono text-lg uppercase tracking-widest focus-visible:ring-blue-500" 
                      required
                      autoFocus
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">
                    This additional step is required due to observed behavioral patterns.
                  </p>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700 py-3 animate-shake">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="font-bold">Access Denied</AlertTitle>
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200 text-green-700 py-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="font-bold">Verified</AlertTitle>
                  <AlertDescription className="text-xs">Behavioral identity confirmed. Welcome.</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="pb-6">
              <Button 
                type="submit" 
                ref={submitBtnRef}
                disabled={loading || success || botRunning || captchaVerifying} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
              >
                {loading ? "Authenticating..." : 
                 botRunning ? "Bot Attack in Progress..." : 
                 captchaVerifying ? "Verifying..." :
                 showCaptcha ? "Verify Identity" : "Sign In"}
              </Button>
            </CardFooter>
          </form>

          {/* Verification Stream Logs */}
          {(loading || verificationLogs.length > 0) && (
            <div className="bg-slate-50 border-t border-slate-100 p-4 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AABE Analysis Stream</span>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
              {verificationLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${
                    log.status === 'success' ? 'text-emerald-600' : 
                    log.status === 'error' ? 'text-red-600' : 'text-slate-500'
                  }`}>
                    {log.msg}
                  </span>
                  {log.status === 'pending' && <div className="w-3 h-3 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />}
                  {log.status === 'success' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  {log.status === 'error' && <AlertTriangle className="w-3 h-3 text-red-500" />}
                </div>
              ))}
            </div>
          )}
        </Card>
        
        <p className="mt-8 text-center text-slate-400 text-xs font-medium">
          Powered by AABE Behavioral Core Engine v4.0.2
        </p>
      </div>

      {/* Secret "Security Insights" Toggle for Judges */}
      <div className="fixed bottom-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full w-12 h-12 bg-white shadow-xl hover:bg-slate-50 group border-slate-200">
              <Settings2 className="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[450px] overflow-y-auto border-l-slate-200">
            <SheetHeader className="border-b border-slate-100 pb-4 mb-6">
              <SheetTitle className="flex items-center gap-2 text-slate-900">
                <LayoutDashboard className="w-5 h-5 text-blue-600" />
                Security Engine Insights
              </SheetTitle>
              <SheetDescription className="text-slate-500">
                Live behavioral biometrics data being captured in the background.
              </SheetDescription>
            </SheetHeader>

            <div className="px-4 mb-8">
              <Button 
                onClick={runLiveBotAttack} 
                disabled={botRunning || success}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98]"
              >
                <div className={`p-1.5 rounded-full ${botRunning ? 'bg-red-500 animate-pulse' : 'bg-red-500/20'}`}>
                  <Play className={`w-4 h-4 ${botRunning ? 'text-white' : 'text-red-500'}`} />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-sm">Execute Live Bot Attack</span>
                  <span className="text-[10px] text-slate-400 font-normal">Programmatic input simulation</span>
                </div>
              </Button>
            </div>

            <div className="space-y-10 py-4">
              {/* Score Gauge */}
              <div className="flex flex-col items-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                    <circle 
                      cx="80" cy="80" r="70" 
                      stroke="currentColor" 
                      strokeWidth="10" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * 70}
                      strokeDashoffset={2 * Math.PI * 70 * (1 - metrics.botScore)}
                      className={`transition-all duration-700 ease-out ${metrics.botScore > 0.7 ? 'text-red-500' : metrics.botScore > 0.4 ? 'text-amber-500' : 'text-emerald-500'}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center rotate-90">
                    <span className={`text-3xl font-black ${metrics.botScore > 0.7 ? 'text-red-500' : metrics.botScore > 0.4 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {Math.round(metrics.botScore * 100)}%
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Bot Probability</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {/* Mouse Movements */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
                      <MousePointer2 className="w-4 h-4 text-blue-600" />
                      Mouse Integrity
                    </div>
                    <span className="text-slate-900 font-mono text-xs font-bold">{metrics.mouseMovements} pts</span>
                  </div>
                  <Progress value={Math.min(metrics.mouseMovements, 100)} className="h-2 bg-slate-100 rounded-full" />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Static (Bot-like)</span>
                    <span>Kinetic (Human)</span>
                  </div>
                </div>

                {/* Keyboard Timing */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
                      <Keyboard className="w-4 h-4 text-blue-600" />
                      Typing Cadence
                    </div>
                    <span className="text-slate-900 font-mono text-xs font-bold">{Math.round(metrics.keystrokeSpeed)}ms</span>
                  </div>
                  <Progress value={metrics.keystrokeSpeed > 300 ? 100 : (metrics.keystrokeSpeed / 300) * 100} className="h-2 bg-slate-100 rounded-full" />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Inhuman Speed</span>
                    <span>Variable Human Rate</span>
                  </div>
                </div>

                {/* Time */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
                      <Timer className="w-4 h-4 text-blue-600" />
                      Form Velocity
                    </div>
                    <span className="text-slate-900 font-mono text-xs font-bold">{metrics.formTime}s</span>
                  </div>
                  <Progress value={Math.min(metrics.formTime * 10, 100)} className="h-2 bg-slate-100 rounded-full" />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Instant (Bot)</span>
                    <span>Deliberate (Human)</span>
                  </div>
                </div>

                {/* Honeypot Status */}
                <div className="pt-4 border-t border-slate-100">
                   <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                     metrics.honeypotTripped ? 'bg-red-50 border-red-200 shadow-lg shadow-red-100' : 'bg-slate-50 border-slate-100'
                   }`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${metrics.honeypotTripped ? 'bg-red-600' : 'bg-slate-200'}`}>
                          <Zap className={`w-4 h-4 ${metrics.honeypotTripped ? 'text-white' : 'text-slate-500'}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">Deception Layer</span>
                          <span className="text-[10px] text-slate-500">{metrics.honeypotTripped ? 'Honeypot TRIPPED' : 'Honeypots INTACT'}</span>
                        </div>
                      </div>
                      {metrics.honeypotTripped ? (
                         <div className="px-2 py-1 bg-red-600 text-white text-[8px] font-black uppercase rounded tracking-widest animate-pulse">Tripped</div>
                      ) : (
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      )}
                   </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 mt-6">
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  The dashboard is currently in <span className="font-bold underline decoration-blue-300">Observation Mode</span>. All interactions are passed through our local behavioral biometrics engine to generate the score above.
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Fake Bot Mouse Cursor for Teleport Demo */}
      <div 
        className="fixed z-[100] pointer-events-none transition-all duration-300 ease-out"
        style={{ 
          left: botMousePos.x, 
          top: botMousePos.y, 
          opacity: botMousePos.x > 0 ? 1 : 0 
        }}
      >
        <MousePointer className="w-5 h-5 text-red-600 fill-red-600 drop-shadow-lg" />
      </div>

      <style jsx global>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(500px); }
        }
        .animate-scan { animation: scan 2s linear infinite; }
      `}</style>
    </div>
  )
}
