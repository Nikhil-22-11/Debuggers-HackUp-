import { Zap, Shield, AlertOctagon, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BiometricMetrics } from '@/hooks/use-biometrics'
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
    <div className="glass-effect sticky top-0 z-10 border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AABE Security Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Adaptive Anti-Bot Engine Protection</p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {biometrics && (
            <div className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border transition-all duration-500 card-hover ${
              biometrics.status === 'BOT' ? 'bg-red-50 border-red-200 shadow-red-100 shadow-lg' : 
              biometrics.status === 'SUSPICIOUS' ? 'bg-amber-50 border-amber-200 shadow-amber-100 shadow-lg' : 
              'bg-blue-50 border-blue-200'
            }`}>
              {biometrics.status === 'BOT' ? <AlertOctagon className="w-4 h-4 text-red-600 animate-pulse" /> : 
               biometrics.status === 'SUSPICIOUS' ? <AlertOctagon className="w-4 h-4 text-amber-600 animate-bounce" /> : 
               <Shield className="w-4 h-4 text-blue-600" />}
              <div className="flex flex-col">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                   biometrics.status === 'BOT' ? 'text-red-700' : 
                   biometrics.status === 'SUSPICIOUS' ? 'text-amber-700' : 
                   'text-blue-700'
                }`}>Identity: {biometrics.status}</span>
                <span className="text-[9px] text-slate-500 font-medium">Confidence: {biometrics.confidence}%</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-50 rounded-lg border border-green-200 flex-1 sm:flex-none card-hover">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft" />
            <span className="text-xs sm:text-sm font-medium text-green-700">System Online</span>
          </div>
          
          {onSimulateAttack && (
            <Button
              onClick={onSimulateAttack}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 card-hover shadow-lg shadow-red-200"
            >
              <Zap className="w-3 sm:w-4 h-3 sm:h-4" />
              <span className="hidden sm:inline">Simulate Attack</span>
              <span className="sm:hidden">Attack</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
