'use client'

import { MapPin, ArrowUpRight, TrendingUp, Globe, Activity } from 'lucide-react'

const shifts = [
    { city: 'São Paulo', country: 'Brazil', change: '+24%', status: 'up' },
    { city: 'Moscow', country: 'Russia', change: '-12%', status: 'down' },
    { city: 'Shanghai', country: 'China', change: '+8%', status: 'up' },
    { city: 'Mumbai', country: 'India', change: '+15%', status: 'up' },
]

export default function GeoShifts() {
  return (
    <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl space-y-8 flex flex-col justify-between h-full group hover:shadow-2xl transition-all duration-700">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-sky-50 rounded-xl group-hover:rotate-12 transition-all">
                <Globe className="w-5 h-5 text-sky-600" />
            </div>
            <div className="flex flex-col">
                <h3 className="text-lg font-black text-slate-900 leading-none">Geo_Shifts</h3>
                <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Dynamic_Origins</span>
            </div>
          </div>
          <Activity className="w-4 h-4 text-slate-200 animate-pulse" />
      </div>

      <div className="space-y-4">
          {shifts.map((shift) => (
              <div key={shift.city} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-sky-100 transition-all cursor-default">
                  <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-sky-500 opacity-60" />
                      <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold text-slate-800 leading-none">{shift.city}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{shift.country}</span>
                      </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black ${
                      shift.status === 'up' ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'
                  }`}>
                      <ArrowUpRight className={`w-3 h-3 ${shift.status === 'down' ? 'rotate-90' : ''}`} />
                      {shift.change}
                  </div>
              </div>
          ))}
      </div>

      <div className="pt-6 border-t border-slate-100 flex items-center justify-between opacity-30">
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">Tracking.Global.Nodes</span>
          <TrendingUp className="w-3 h-3" />
      </div>
    </div>
  )
}
