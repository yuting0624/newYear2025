'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Confetti } from '@/components/confetti'
import { Omikuji } from '@/components/omikuji'
import { NewYearGreeting } from '@/components/new-year-greeting'
import { SocialShare } from '@/components/social-share'
import { motion, AnimatePresence } from 'framer-motion'
import { Github } from 'lucide-react'
import { keyframes } from '@emotion/react'

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const animateGradient = {
  animation: `${gradientAnimation} 3s ease infinite`
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState('')
  const [name, setName] = useState('')
  const [goals, setGoals] = useState('')
  const [resolution, setResolution] = useState('')
  const [error, setError] = useState('')
  const [isGeneratingResolution, setIsGeneratingResolution] = useState(false)
  const [isNewYear, setIsNewYear] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const newYear = new Date('2025-01-01T00:00:00')
      const diff = newYear.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft('明けましておめでとうございます！')
        setIsNewYear(true)
        clearInterval(timer)
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setTimeLeft(`${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleGenerateResolution = async () => {
    if (name && goals) {
      setError('')
      setIsGeneratingResolution(true)
      try {
        const response = await fetch('/api/generate-resolution', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `${name}さんの2025年の抱負を生成してください。以下の目標と希望を考慮してください：${goals}`,
            identifier: name
          })
        })
        const data = await response.json()
        if (data.error) {
          setError(data.error)
        } else if (data.resolution) {
          setResolution(data.resolution)
        }
      } catch (error) {
        setError('エラーが発生しました。もう一度お試しください。')
      } finally {
        setIsGeneratingResolution(false)
      }
    }
  }

  return (
    <main className="min-h-screen bg-[url('/japanese-pattern.svg')] bg-repeat">
      <div className="min-h-screen bg-white/30 backdrop-blur-sm px-4 py-8 flex flex-col items-center justify-center space-y-6 md:space-y-8">
        <Confetti />
        <NewYearGreeting />
        
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-red-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold text-center text-red-800">
                {isNewYear ? '2025年、新年おめでとう！' : '2025年まで'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.p
                  key={timeLeft}
                  initial={{ y: 20, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -20, opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-3xl md:text-5xl font-extrabold text-center"
                >
                  <span className="bg-gradient-to-r from-red-600 via-pink-500 to-purple-600 text-transparent bg-clip-text bg-300% animate-gradient">
                    {timeLeft}
                  </span>
                </motion.p>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-red-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl font-bold text-red-800">
                🎍 AI抱負ジェネレーター 🎍
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">お名前</Label>
                  <Input 
                    id="name" 
                    placeholder="名前を入力してください" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="border-red-200 focus:ring-red-800"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="goals">2025年の目標や希望</Label>
                  <Textarea 
                    id="goals" 
                    placeholder="例：健康的な生活を送りたい、新しい趣味を見つけたい..." 
                    value={goals} 
                    onChange={(e) => setGoals(e.target.value)}
                    className="border-red-200 focus:ring-red-800 min-h-[80px]"
                    rows={3}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                <Button 
                  onClick={handleGenerateResolution} 
                  disabled={isGeneratingResolution || !name || !goals}
                  className="bg-red-800 hover:bg-red-700 transition-colors"
                >
                  {isGeneratingResolution ? '生成中...' : '抱負を生成'}
                </Button>
                {resolution && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-sm md:text-base whitespace-pre-line rounded-lg bg-red-50 p-4"
                  >
                    {resolution}
                    <SocialShare text={`私の2025年の抱負:\n${resolution}`} />
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-md"
        >
          <Omikuji name={name} goals={goals} />
        </motion.div>

        <footer className="w-full max-w-md text-center text-sm text-gray-600">
          <p>Created with ❤️ by Yu</p>
        </footer>
      </div>
    </main>
  )
}

