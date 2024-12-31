'use client'

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

type Shape = 'square' | 'circle' | 'star'

export function Confetti() {
  const [hasShownConfetti, setHasShownConfetti] = useState(false)
  const [showTestButton, setShowTestButton] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setShowTestButton(true)
    }
  }, [])

  const celebrateNewYear = () => {
    const duration = 15 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { 
      startVelocity: 30, 
      spread: 360, 
      ticks: 60, 
      zIndex: 0,
      shapes: ['circle', 'square'] as Shape[], // 型アサーションを追加
      colors: ['#FF0000', '#FFD700', '#FF1493', '#4B0082', '#00FF00']
    }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        window.clearInterval(interval)
        return
      }

      const particleCount = Math.floor(50 * (timeLeft / duration))
      
      // 左側の発射
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      
      // 右側の発射
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
      
      // 中央からの発射
      if (timeLeft > duration / 2) {
        confetti({
          ...defaults,
          particleCount: Math.floor(particleCount * 0.5),
          origin: { x: 0.5, y: 0.5 },
          gravity: 1.2,
          scalar: 0.8
        })
      }
    }, 250)

    // キラキラエフェクト
    setTimeout(() => {
      const end = Date.now() + 3000
      const colors = ['#ff0000', '#ffd700', '#00ff00', '#0099ff']

      ;(function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }())
    }, 1000)
  }

  useEffect(() => {
    const checkAndCelebrate = () => {
      const now = new Date()
      const newYear = new Date('2025-01-01T00:00:00')
      const isNewYear = now >= newYear

      if (isNewYear && !hasShownConfetti) {
        celebrateNewYear()
        setHasShownConfetti(true)
        localStorage.setItem('confettiDisplayed2025', 'true')
      }
    }

    const hasDisplayedBefore = localStorage.getItem('confettiDisplayed2025')
    if (!hasDisplayedBefore) {
      checkAndCelebrate()
    }

    const timer = setInterval(checkAndCelebrate, 1000)
    return () => clearInterval(timer)
  }, [hasShownConfetti])

  if (!showTestButton) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => {
          celebrateNewYear()
          localStorage.removeItem('confettiDisplayed2025')
        }}
        className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-md transition-colors"
      >
        コンフェッティテスト
      </button>
    </div>
  )
}