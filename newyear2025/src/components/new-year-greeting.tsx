'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function NewYearGreeting() {
  const [showGreeting, setShowGreeting] = useState(false)

  useEffect(() => {
    const now = new Date()
    const newYear = new Date('2025-01-01T00:00:00')
    if (now >= newYear) {
      setShowGreeting(true)
    }
  }, [])

  if (!showGreeting) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-red-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-red-800">
              🎍 謹賀新年 2025 🎍
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              新年あけましておめでとうございます<br />
              旧年中は大変お世話になりました
              皆様にとって素晴らしい一年となりますように<br />
              本年もどうぞよろしくお願い申し上げます
            </p>
            <Button 
              onClick={() => setShowGreeting(false)}
              className="bg-red-800 hover:bg-red-700 transition-colors"
            >
              閉じる
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

