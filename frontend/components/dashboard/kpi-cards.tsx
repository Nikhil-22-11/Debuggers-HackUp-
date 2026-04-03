'use client'

import { Activity, ShieldAlert, CheckCircle2, AlertTriangle, Layers } from 'lucide-react'

const KPICard = ({ label, value, highlight, color }: { label: string; value: string; highlight?: boolean; color?: 'blue' | 'red' | 'green' | 'purple' }) => {
  let bgColor = 'bg-white border-slate-100 shadow-xl'
  let textColor = 'text-slate-950'
  let accentColor = 'bg-slate-100'
  let iconColor = 'text-slate-400'
  
  if (highlight) {
    switch (color) {
      case 'red':
        bgColor = 'bg-red-600/5 border-red-500/20'
        textColor = 'text-red-700 shadow-red-500/5'
        accentColor = 'bg-red-500/10'
        iconColor = 'text-red-500'
        break
      case 'blue':
        bgColor = 'bg-blue-600/5 border-blue-500/20'
        textColor = 'text-blue-700 shadow-blue-500/5'
        accentColor = 'bg-blue-500/10'
        iconColor = 'text-blue-500'
        break
      case 'green':
        bgColor = 'bg-emerald-600/5 border-emerald-500/20'
        textColor = 'text-emerald-700 shadow-emerald-500/5'
        accentColor = 'bg-emerald-500/10'
        iconColor = 'text-emerald-500'
        break
      case 'purple':
        bgColor = 'bg-purple-600/5 border-purple-500/20'
        textColor = 'text-purple-700 shadow-purple-500/5'
        accentColor = 'bg-purple-500/10'
        iconColor = 'text-purple-500'
        break
    }
  }

  const GetIcon = () => {
    switch(color) {
        case 'red': return <ShieldAlert className={`w-5 h-5 ${iconColor}`} />
        case 'blue': return <Activity className={`w-5 h-5 ${iconColor}`} />
        case 'green': return <CheckCircle2 className={`w-5 h-5 ${iconColor}`} />
        default: return <Layers className={`w-5 h-5 ${iconColor}`} />
    }
  }

  return (
    <div className={`rounded-[3rem] border-2 p-8 ${bgColor} transition-all duration-300 hover:scale-[1.03] active:scale-95 flex flex-col justify-between h-[250px] shadow-2xl relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 p-8 flex-shrink-0 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-125">
          <GetIcon />
      </div>
      
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 truncate max-w-full italic px-1">{label}</p>
        <p className={`text-6xl font-black italic tracking-tighter ${textColor} leading-none`}>
            {value}
        </p>
      </div>
      
      <div className="w-full flex items-center justify-between">
          <div className={`h-1.5 w-12 rounded-full ${accentColor}`} />
          <span className="text-[8px] font-black uppercase tracking-widest opacity-20">Sentinel_Node_Pulse</span>
      </div>
    </div>
  )
}

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <KPICard label="Total Ingress" value="2.4M" color="blue" highlight={true} />
      <KPICard label="Bots Interdicted" value="1.68M" highlight={true} color="red" />
      <KPICard label="Engine Accuracy" value="99.2%" highlight={true} color="blue" />
      <KPICard label="Integrity Score" value="98%" highlight={true} color="green" />
    </div>
  )
}
