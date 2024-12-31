'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion'
import { SocialShare } from './social-share'

interface OmikujiProps {
  name: string;
  goals: string;
}

export function Omikuji({ name, goals }: OmikujiProps) {
  const [isDrawn, setIsDrawn] = useState(false)
  const [omikuji, setOmikuji] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleDrawOmikuji = async () => {
    setIsDrawn(true)
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/generate-omikuji', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${name}さんのおみくじを引きました。以下の目標と希望を考慮してください：${goals}`,
          identifier: name
        })
      })
      const data = await response.json()
      if (data.error) {
        setError(data.error)
      } else if (data.omikuji) {
        setOmikuji(data.omikuji)
      }
    } catch (error) {
      setError('おみくじの生成中にエラーが発生しました。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-red-200 shadow-lg">
      <CardHeader className="text-center border-b border-red-200">
        <CardTitle className="text-xl md:text-2xl font-bold text-red-800">🎋 2025年のおみくじ 🎋</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {!isDrawn ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <Button 
                onClick={handleDrawOmikuji}
                className="bg-red-800 hover:bg-red-700 text-white px-8 py-6 text-lg transition-colors"
                disabled={!name || !goals}
              >
                おみくじを引く
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center space-y-4"
            >
              {isLoading ? (
                <div className="text-lg">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    🎋
                  </motion.div>
                  <p>おみくじを選んでいます...</p>
                </div>
              ) : error ? (
                <div>
                  <p className="text-red-600">{error}</p>
                  <Button 
                    onClick={() => setIsDrawn(false)}
                    variant="outline"
                    className="mt-4"
                  >
                    もう一度引く
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-xl md:text-2xl font-bold text-red-800"
                  >
                    {omikuji.split('\n')[0]}
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-gray-700 whitespace-pre-line bg-red-50 rounded-lg p-4"
                  >
                    {omikuji.split('\n').slice(1).join('\n')}
                  </motion.div>
                  <SocialShare text={`私の2025年のおみくじ結果:\n${omikuji}`} />
                  <Button 
                    onClick={() => setIsDrawn(false)}
                    variant="outline"
                    className="mt-4"
                  >
                    もう一度引く
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

