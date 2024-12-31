'use client'

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

export function Confetti() {
  const [isNewYear, setIsNewYear] = useState(false)

  useEffect(() => {
    const checkNewYear = () => {
      const now = new Date()
      const newYear = new Date('2025-01-01T00:00:00')
      if (now >= newYear) {
        setIsNewYear(true)
        celebrateNewYear()
      }
    }

    const celebrateNewYear = () => {
      const duration = 15 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)
    }

    const timer = setInterval(checkNewYear, 1000)
    return () => clearInterval(timer)
  }, [])

  return null
}

