import { Zap, Shield, AlertOctagon, LogOut, Activity, Globe, Wifi, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BiometricMetrics } from '@/hooks/use-biometrics-engine'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  onSimulateAttack?: () => void
  biometrics?: BiometricMetrics
}

export default function Header({ onSimulateAttack, biometrics }: HeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    router.replace('/login')
  }

  return (
    <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-500">
      <div className="px-8 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">FinShield AI Dashboard</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Adaptive Anti-Bot Engine Protection</p>
        </div>
        
        <div className="flex items-center gap-4">
          {biometrics && (
            <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border transition-all duration-700 ${
              biometrics.status === 'BOT' ? 'bg-red-50 dark:bg-red-950/20 border-red-200' : 
              biometrics.status === 'SUSPICIOUS' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200' : 
              'bg-blue-50 dark:bg-blue-950/20 border-blue-200 shadow-sm shadow-blue-500/5'
            }`}>
              <div className="p-2 bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                {biometrics.status === 'BOT' || biometrics.status === 'SUSPICIOUS' ? <AlertOctagon className="w-4.5 h-4.5 text-amber-600 animate-pulse" /> : 
                 <Shield className="w-4.5 h-4.5 text-blue-600" />}
              </div>
              <div className="flex flex-col">
                <span className={`text-[11px] font-black uppercase tracking-widest leading-none ${
                   biometrics.status === 'BOT' ? 'text-red-700 dark:text-red-400' : 
                   biometrics.status === 'SUSPICIOUS' ? 'text-amber-700' : 
                   'text-blue-700 dark:text-blue-400'
                }`}>IDENTITY: {biometrics.status}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1">Confidence: {biometrics.confidence}%</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex-1 sm:flex-none shadow-sm">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_#10b981]" />
            <span className="text-[12px] font-bold text-emerald-700 dark:text-emerald-400 leading-none">System Online</span>
          </div>
          
          {onSimulateAttack && (
            <Button
              onClick={onSimulateAttack}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-bold tracking-tight py-6 px-10 rounded-2xl shadow-md active:scale-95 transition-all text-sm"
            >
              <Zap className="w-4 h-4 mr-2" />
              <span>Simulate Attack</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 transition-all active:scale-95 text-slate-500 dark:text-slate-400"
            title="Disconnect"
          >
            <LogOut className="w-4.5 h-4.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
