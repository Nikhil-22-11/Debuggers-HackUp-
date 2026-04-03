'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, Wifi, Shield, Zap, AlertTriangle, MapPin } from 'lucide-react'
import { useBiometrics } from '@/hooks/use-biometrics-engine'

export default function NetworkIntel() {
  const { metrics } = useBiometrics()
  const network = metrics.network

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50 border-b border-slate-100">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
          <Globe className="w-4 h-4 text-blue-600" />
          Network Identity Profile
        </CardTitle>
        <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
          network.isVpn ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
        }`}>
          {network.isVpn ? 'Anomalous' : 'Residential'}
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Connection Reputation Gauge */}
        <div className="flex flex-col items-center justify-center py-2">
            <div className={`text-2xl font-black mb-1 ${network.isVpn ? 'text-amber-600' : 'text-emerald-600'}`}>
                {network.isVpn ? '82% RISK' : 'CLEAN'}
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Connection Reputation</div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Public IP</span>
                <div className="flex items-center gap-2">
                    <Wifi className={`w-3 h-3 ${network.isVpn ? 'text-amber-500' : 'text-slate-400'}`} />
                    <span className="text-xs font-mono font-bold text-slate-700 truncate">{network.ip}</span>
                </div>
            </div>
            <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Geolocation</span>
                <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700 truncate">{network.geo}</span>
                </div>
            </div>
        </div>

        {/* Signals */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-500">VPN / Proxy Detection</span>
                {network.isVpn ? (
                    <div className="flex items-center gap-1 text-amber-600">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Datacenter Node Found</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 text-emerald-600">
                        <Shield className="w-3 h-3" />
                        <span>ISP Integrity Verified</span>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-500">Geo-Shift Integrity</span>
                <div className="flex items-center gap-1 text-emerald-600">
                    <Shield className="w-3 h-3" />
                    <span>No Anomalous Travel</span>
                </div>
            </div>
        </div>

        {/* Threat Alert (Only when VPN) */}
        {network.isVpn && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 animate-pulse-soft">
                <p className="text-[10px] text-amber-800 leading-tight">
                    <span className="font-black">SECURITY ALERT:</span> The current connection originates from a known hosting provider. Manual review recommended for this session.
                </p>
            </div>
        )}
      </CardContent>
    </Card>
  )
}
