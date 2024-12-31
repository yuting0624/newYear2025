import { Redis } from '@upstash/redis'
import { generateWithGemini } from '@/utils/gemini'
import { checkRateLimit } from '@/utils/rate-limit'
import { NextResponse } from 'next/server'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

interface ResolutionData {
  name: string
  goals: string
  resolution: string
  timestamp: string
}

export async function POST(req: Request) {
  try {
    const { prompt, identifier, name, goals } = await req.json()
    
    const isAllowed = await checkRateLimit(identifier)
    if (!isAllowed) {
      return NextResponse.json(
        { error: '本日の生成回数上限に達しました。' },
        { status: 429 }
      )
    }

    const systemPrompt = `あなたは新年の抱負を生成するAIアシスタントです。
    ユーザーの名前と目標を考慮して、具体的で実現可能な抱負を3つ提案してください。
    出力は簡潔に、絵文字を使って親しみやすく表現してください。

    出力形式：
    ✨ ${new Date().getFullYear() + 1}年の抱負 ✨

    1️⃣ [抱負1] 
    💫 [簡単なアドバイス]

    2️⃣ [抱負2]
    💫 [簡単なアドバイス]

    3️⃣ [抱負3]
    💫 [簡単なアドバイス]

    🌟 [短い応援メッセージ]`;

    const fullPrompt = `${systemPrompt}\n\n${prompt}`;
    const resolution = await generateWithGemini(fullPrompt);

    const data: ResolutionData = {
      name,
      goals,
      resolution,
      timestamp: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    }
    
    await redis.lpush('resolutions', JSON.stringify(data))

    return NextResponse.json({ resolution })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: '抱負の生成中にエラーが発生しました。' },
      { status: 500 }
    )
  }
}