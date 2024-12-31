'use client'

import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Linkedin } from 'lucide-react'

interface SocialShareProps {
  text: string
}

export function SocialShare({ text }: SocialShareProps) {
  const encodedText = encodeURIComponent(text)
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedText}`
  const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodedText}`

  return (
    <div className="flex justify-center space-x-2 mt-4">
      <Button
        onClick={() => window.open(twitterUrl, '_blank')}
        className="bg-[#1DA1F2] hover:bg-[#1a91da] transition-colors"
      >
        <Twitter className="w-4 h-4 mr-2" />
        Twitter
      </Button>
      <Button
        onClick={() => window.open(facebookUrl, '_blank')}
        className="bg-[#4267B2] hover:bg-[#365899] transition-colors"
      >
        <Facebook className="w-4 h-4 mr-2" />
        Facebook
      </Button>
      <Button
        onClick={() => window.open(linkedinUrl, '_blank')}
        className="bg-[#0077B5] hover:bg-[#006699] transition-colors"
      >
        <Linkedin className="w-4 h-4 mr-2" />
        LinkedIn
      </Button>
    </div>
  )
}

