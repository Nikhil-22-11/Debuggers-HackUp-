'use client'

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

export interface BiometricMetrics {
  mouseMovements: number
  keystrokeSpeed: number // ms between keys
  formTime: number // seconds
  botScore: number // 0 to 1
  isBot: boolean
  status: 'HUMAN' | 'SUSPICIOUS' | 'BOT' | 'DECEPTIVE' | 'COMPROMISED' | 'MALICIOUS'
  confidence: number
  honeypotTripped: boolean
  network: {
    ip: string
    isVpn: boolean
    geo: string
    reputation: 'CLEAN' | 'LOW' | 'MALICIOUS'
  }
  stealthMode: boolean
  aiIntegrity: number // 0-100% human probability
  loginAttempts: number // track brute force
  threats: {
      sqli: boolean
      xss: boolean
      bola: boolean
      bruteForce: boolean
  }
}

interface BiometricsContextType {
  metrics: BiometricMetrics
  recordKey: () => void
  updateBotScore: () => void
  tripHoneypot: () => void
  simulateVpn: (active: boolean) => void
  toggleStealthMode: (active: boolean) => void
  toggleBOLA: (active: boolean) => void
  triggerAttackSimulation: (active: boolean) => void
  recordLoginAttempt: () => void
  resetLoginAttempts: () => void
}

const BiometricsContext = createContext<BiometricsContextType | undefined>(undefined)

export const BiometricsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSimulating, setIsSimulating] = useState(false)
  const [metrics, setMetrics] = useState<BiometricMetrics>({
    mouseMovements: 0,
    keystrokeSpeed: 0,
    formTime: 0,
    botScore: 0,
    isBot: false,
    status: 'HUMAN',
    confidence: 100,
    honeypotTripped: false,
    network: {
        ip: '103.14.212.18',
        isVpn: false,
        geo: 'Durgapur, India',
        reputation: 'CLEAN'
    },
    stealthMode: false,
    aiIntegrity: 100,
    loginAttempts: 0,
    threats: {
        sqli: false,
        xss: false,
        bola: false,
        bruteForce: false
    }
  })

  const honeypotRef = useRef<boolean>(false)
  const networkRef = useRef<{isVpn: boolean, reputation: 'CLEAN' | 'MALICIOUS'}>({ isVpn: false, reputation: 'CLEAN' })
  const stealthRef = useRef<boolean>(false)
  const lastKeyTime = useRef<number>(Date.now())
  const startTime = useRef<number>(Date.now())
  const mouseCount = useRef<number>(0)
  const keyIntervals = useRef<number[]>([])
  const isSimulatingRef = useRef<boolean>(false)

  const updateBotScore = useCallback(() => {
    let score = 0
    
    // IF GLOBAL SIMULATION IS ACTIVE - OVERRIDE EVERYTHING
    if (isSimulatingRef.current) {
        setMetrics(prev => ({
            ...prev,
            botScore: 1.0,
            isBot: true,
            status: 'MALICIOUS',
            aiIntegrity: 0,
            confidence: 0,
            threats: {
                sqli: true,
                xss: true,
                bola: true,
                bruteForce: true
            },
            network: {
                ...prev.network,
                isVpn: true,
                reputation: 'MALICIOUS',
                ip: '192.168.1.1 (Botnet)',
                geo: 'Moscow, RU (Center)'
            }
        }))
        return
    }

    // NORMAL LOGIC
    if (mouseCount.current < 10) score += 0.3
    else if (mouseCount.current < 50) score += 0.1

    if (keyIntervals.current.length > 0) {
      const avgInterval = keyIntervals.current.reduce((a, b) => a + b, 0) / keyIntervals.current.length
      const variance = keyIntervals.current.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / keyIntervals.current.length
      if (avgInterval < 50) score += 0.5 
      if (variance < 2) score += 0.4 
      if (stealthRef.current && avgInterval > 100 && variance < 5) score += 0.25 
    }

    const totalTime = (Date.now() - startTime.current) / 1000
    if (totalTime < 1) score += 0.4
    else if (totalTime < 2) score += 0.2

    let finalScore = Math.min(Math.round(score * 100) / 100, 1.0)
    
    if (honeypotRef.current) finalScore = 1.0
    if (networkRef.current.isVpn) finalScore = Math.max(finalScore, 0.45) 
    
    const currentInput = document.activeElement instanceof HTMLInputElement ? document.activeElement.value : ''
    const isSQLi = /('|--|#|union|select|insert|delete|drop|update)/gi.test(currentInput)
    const isXSS = /(<script|javascript|onerror|onclick|alert)/gi.test(currentInput)
    
    if (isSQLi) finalScore = Math.max(finalScore, 0.9)
    if (isXSS) finalScore = Math.max(finalScore, 0.85)

    const status = honeypotRef.current ? 'DECEPTIVE' : 
                   isSQLi || isXSS ? 'MALICIOUS' :
                   networkRef.current.isVpn ? 'COMPROMISED' : 
                   finalScore > 0.7 ? 'BOT' : 
                   finalScore > 0.3 ? 'SUSPICIOUS' : 'HUMAN'
                   
    const confidence = Math.round((1 - finalScore) * 100)
    const integrity = honeypotRef.current ? 5 : 
                      finalScore > 0.8 ? 12 : 
                      finalScore > 0.6 ? 38 : 
                      finalScore > 0.3 ? 65 : 98

    setMetrics(prev => ({
      ...prev,
      mouseMovements: mouseCount.current,
      keystrokeSpeed: keyIntervals.current.length > 0 ? (keyIntervals.current.reduce((a, b) => a + b, 0) / keyIntervals.current.length) : 0,
      formTime: Math.round(totalTime * 10) / 10,
      botScore: finalScore,
      isBot: finalScore > 0.75 || honeypotRef.current,
      status,
      confidence,
      honeypotTripped: honeypotRef.current,
      stealthMode: stealthRef.current,
      aiIntegrity: integrity,
      threats: {
          sqli: isSQLi,
          xss: isXSS,
          bola: prev.threats.bola,
          bruteForce: prev.loginAttempts >= 3
      },
      network: {
          ...prev.network,
          isVpn: networkRef.current.isVpn,
          reputation: networkRef.current.reputation,
          ip: networkRef.current.isVpn ? '192.168.1.1 (Datacenter)' : '103.14.212.18 (Residential)',
          geo: networkRef.current.isVpn ? 'New York, US (Proxy)' : 'Durgapur, India'
      }
    }))
  }, [])

  const triggerAttackSimulation = useCallback((active: boolean) => {
    isSimulatingRef.current = active
    setIsSimulating(active)
    updateBotScore()
  }, [updateBotScore])

  const simulateVpn = useCallback((active: boolean) => {
      networkRef.current = { isVpn: active, reputation: active ? 'MALICIOUS' : 'CLEAN' }
      updateBotScore()
  }, [updateBotScore])

  const tripHoneypot = useCallback(() => {
    honeypotRef.current = true
    updateBotScore()
  }, [updateBotScore])

  const toggleStealthMode = useCallback((active: boolean) => {
    stealthRef.current = active
    updateBotScore()
  }, [updateBotScore])

  const toggleBOLA = useCallback((active: boolean) => {
    setMetrics(prev => ({
        ...prev,
        threats: { ...prev.threats, bola: active },
        status: active ? 'MALICIOUS' : prev.status
    }))
  }, [])

  const recordLoginAttempt = useCallback(() => {
    setMetrics(prev => ({ ...prev, loginAttempts: prev.loginAttempts + 1 }))
    updateBotScore()
  }, [updateBotScore])

  const resetLoginAttempts = useCallback(() => {
    setMetrics(prev => ({ ...prev, loginAttempts: 0 }))
    updateBotScore()
  }, [updateBotScore])

  const handleMouseMove = useCallback(() => {
    mouseCount.current += 1
    if (mouseCount.current % 10 === 0) updateBotScore()
  }, [updateBotScore])

  const handleKeyDown = useCallback(() => {
    const now = Date.now()
    const interval = now - lastKeyTime.current
    if (interval < 5000) keyIntervals.current.push(interval)
    lastKeyTime.current = now
    updateBotScore()
  }, [updateBotScore])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleMouseMove, handleKeyDown])

  return (
    <BiometricsContext.Provider value={{ 
        metrics, 
        recordKey: handleKeyDown, 
        updateBotScore, 
        tripHoneypot, 
        simulateVpn,
        toggleStealthMode,
        toggleBOLA,
        triggerAttackSimulation,
        recordLoginAttempt,
        resetLoginAttempts
    }}>
      {children}
    </BiometricsContext.Provider>
  )
}

export const useBiometrics = () => {
  const context = useContext(BiometricsContext)
  if (context === undefined) throw new Error('useBiometrics must be used within a BiometricsProvider')
  return context
}
