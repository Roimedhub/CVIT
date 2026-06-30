'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type Player = {
  id: string
  name: string
  hospital: string
  xp: number
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const router = useRouter()

  useEffect(() => {
    supabase
      .from('cvit_players')
      .select('id, name, hospital, xp')
      .order('xp', { ascending: false })
      .limit(11)
      .then(({ data }) => { if (data) setPlayers(data) })
  }, [])

  return (
    <div
      className="w-screen h-screen relative flex items-center justify-center overflow-hidden select-none"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      {/* Background */}
      <Image src="/m_background.svg" alt="" fill style={{ objectFit: 'cover', zIndex: 0 }} priority />

      {/* ── MAIN LAYOUT — two panels side by side ── */}
      <div className="relative z-10 flex flex-row items-stretch justify-center"
        style={{ width: '95vw', height: '90vh', gap: '1vw' }}>

        {/* ── LEFT PANEL — leaderboard list ── */}
        <div style={{
          position: 'relative', width: '30vw', minWidth: 240, maxWidth: 380, flexShrink: 0,
          background: '#4143AF',
          boxShadow: '0 0 54px rgba(25,26,70,1)',
          borderRadius: 8,
        }}>

          {/* Content over background */}
          <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', padding: '4% 6%' }}>

            {/* Leaderboard title animation */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2%' }}>
              <div className="leaderboard-anim" />
            </div>

            {/* Player list */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 'clamp(4px, 1vh, 12px)', overflowY: 'auto' }}>
              {players.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 4px' }}>
                  <span style={{ fontSize: 'clamp(7px, 0.85vw, 11px)', color: '#F2DF00' }}>
                    {i + 1}. {p.name}
                  </span>
                  <span style={{ fontSize: 'clamp(7px, 0.85vw, 11px)', color: '#F2DF00' }}>{p.xp} ⭐</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — video + play button ── */}
        <div style={{
          position: 'relative', flex: 1, minWidth: 0,
          background: '#4143AF',
          boxShadow: '0 0 48px rgba(0,0,0,0.65)',
          borderRadius: 8,
        }}>

          {/* Content over background */}
          <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '6% 8% 4%' }}>

            {/* Engagement video — constrained inside the box */}
            <video
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/game-rounds/GAME_Engagement_video_new_new.mp4`}
              autoPlay
              loop
              muted
              playsInline
              style={{
                height: 460,
                width: 'auto',
                maxWidth: '100%',
                aspectRatio: '1920/1262',
                borderRadius: 12,
                display: 'block',
                objectFit: 'cover',
              }}
            />

            {/* Play button — inside box, near bottom */}
            <div role="button" onClick={() => router.push('/')} style={{ cursor: 'pointer', marginBottom: '2%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Play-Leaderboard.svg" alt="Play"
                style={{ width: 'clamp(100px, 10vw, 160px)', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
