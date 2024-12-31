'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from 'lucide-react'

export function NewYearGreeting() {
  const [showGreeting, setShowGreeting] = useState(false)
  const [showTestButton, setShowTestButton] = useState(false)

  useEffect(() => {
    // 開発環境の場合のみテストボタンを表示
    if (process.env.NODE_ENV === 'development') {
      setShowTestButton(true)
    }

    const checkAndShowGreeting = () => {
      const now = new Date()
      const newYear = new Date('2025-01-01T00:00:00')
      const isNewYear = now >= newYear
      
      // LocalStorageで表示履歴を確認
      const hasDisplayedBefore = localStorage.getItem('greetingDisplayed2025')

      if (isNewYear && !hasDisplayedBefore) {
        setShowGreeting(true)
        localStorage.setItem('greetingDisplayed2025', 'true')
      }
    }

    checkAndShowGreeting()
  }, [])

  const handleCloseGreeting = () => {
    setShowGreeting(false)
  }

  const handleTestGreeting = () => {
    localStorage.removeItem('greetingDisplayed2025')
    setShowGreeting(true)
  }

  return (
    <>
      <AnimatePresence>
        {showGreeting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-red-200 shadow-lg">
              <CardHeader className="relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-gold-400 to-red-600" />
                <CardTitle className="text-2xl font-bold text-center text-red-800 mt-2">
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-6 h-6 text-red-600" />
                    謹賀新年 2025
                    <Sparkles className="w-6 h-6 text-red-600" />
                  </motion.div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="space-y-4 text-gray-800">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg"
                  >
                    新年あけましておめでとうございます
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-base"
                  >
                    旧年中は格別のご厚情を賜り<br />
                    誠にありがとうございました
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-base"
                  >
                    本年もお付き合いのほど<br />
                    よろしくお願い申し上げます
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    onClick={handleCloseGreeting}
                    className="bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white px-8 py-2 rounded-full shadow-lg transition-all duration-300"
                  >
                    閉じる
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {showTestButton && (
        <div className="fixed bottom-4 left-4 z-50">
          <Button
            onClick={handleTestGreeting}
            className="bg-red-800 hover:bg-red-700 text-white"
          >
            年賀状テスト
          </Button>
        </div>
      )}
    </>
  )
}