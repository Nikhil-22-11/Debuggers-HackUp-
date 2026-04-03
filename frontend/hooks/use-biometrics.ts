'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

export interface BiometricMetrics {
  mouseMovements: number
  keystrokeSpeed: number // ms between keys
  formTime: number // seconds
  botScore: number // 0 to 1
  isBot: boolean
  status: 'HUMAN' | 'SUSPICIOUS' | 'BOT' | 'DECEPTIVE'
  confidence: number
  honeypotTripped: boolean
}

export const useBiometrics = () => {
  const [metrics, setMetrics] = useState<BiometricMetrics>({
    mouseMovements: 0,
    keystrokeSpeed: 0,
    formTime: 0,
    botScore: 0,
    isBot: false,
    status: 'HUMAN',
    confidence: 100,
    honeypotTripped: false,
  })

  const honeypotRef = useRef<boolean>(false)

  const lastKeyTime = useRef<number>(Date.now())
  const startTime = useRef<number>(Date.now())
  const mouseCount = useRef<number>(0)
  const keyIntervals = useRef<number[]>([])

  const updateBotScore = useCallback(() => {
    let score = 0
    
    // 1. Mouse movement (Bots often have 0 or very few movements)
    if (mouseCount.current < 10) score += 0.3
    else if (mouseCount.current < 50) score += 0.1

    // 2. Keystroke timing (Bots are inhumanly fast or perfectly rhythmic)
    if (keyIntervals.current.length > 0) {
      const avgInterval = keyIntervals.current.reduce((a, b) => a + b, 0) / keyIntervals.current.length
      const variance = keyIntervals.current.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / keyIntervals.current.length
      
      if (avgInterval < 50) score += 0.5 // < 50ms is inhumanly fast
      if (variance < 2) score += 0.4 // Perfectly rhythmic (variance < 2ms) is robot-like
    }

    // 3. Total form time
    const totalTime = (Date.now() - startTime.current) / 1000
    if (totalTime < 1) score += 0.4 // Fast fill < 1s
    else if (totalTime < 2) score += 0.2

    let finalScore = Math.min(Math.round(score * 100) / 100, 1.0)
    
    // Honeypot override (Instant 1.0)
    if (honeypotRef.current) finalScore = 1.0
    
    const status = honeypotRef.current ? 'DECEPTIVE' : finalScore > 0.7 ? 'BOT' : finalScore > 0.3 ? 'SUSPICIOUS' : 'HUMAN'
    const confidence = Math.round((1 - finalScore) * 100)
    
    setMetrics(prev => ({
      ...prev,
      mouseMovements: mouseCount.current,
      keystrokeSpeed: keyIntervals.current.length > 0 ? (keyIntervals.current.reduce((a, b) => a + b, 0) / keyIntervals.current.length) : 0,
      formTime: Math.round(totalTime * 10) / 10,
      botScore: finalScore,
      isBot: finalScore > 0.75 || honeypotRef.current,
      status,
      confidence,
      honeypotTripped: honeypotRef.current
    }))
  }, [])

  const tripHoneypot = useCallback(() => {
    honeypotRef.current = true
    updateBotScore()
  }, [updateBotScore])

  const handleMouseMove = useCallback(() => {
    mouseCount.current += 1
    // Update score every few movements to avoid over-rendering but keep it feeling "live"
    if (mouseCount.current % 10 === 0) {
      updateBotScore()
    }
  }, [updateBotScore])

  const handleKeyDown = useCallback(() => {
    const now = Date.now()
    const interval = now - lastKeyTime.current
    if (interval < 5000) { // filter out long breaks
      keyIntervals.current.push(interval)
    }
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

  return {
    metrics,
    recordKey: handleKeyDown,
    updateBotScore,
    tripHoneypot
  }
}
