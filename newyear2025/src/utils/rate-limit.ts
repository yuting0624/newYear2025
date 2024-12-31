import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
})

export async function checkRateLimit(identifier: string): Promise<boolean> {
  const key = `rate_limit:${identifier}`
  const limit = 5 // 1日あたりの制限回数
  
  const current = await redis.incr(key)
  if (current === 1) {
    await redis.expire(key, 24 * 60 * 60) // 24時間後に期限切れ
  }
  
  return current <= limit
}

