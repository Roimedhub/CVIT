'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const VIDEO_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/game-rounds/GAME_Engagement_video_new_new.mp4`

export default function VideoPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onEnd = () => router.push('/leaderboard')
    video.addEventListener('ended', onEnd)
    return () => video.removeEventListener('ended', onEnd)
  }, [router])

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        muted
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  )
}
