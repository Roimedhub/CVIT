'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '../../lib/supabase'

type Player = {
  id: string
  name: string
  hospital: string
  xp: number
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    supabase
      .from('cvit_players')
      .select('id, name, hospital, xp')
      .order('xp', { ascending: false })
      .limit(10)
      .then(({ data }) => { if (data) setPlayers(data) })
  }, [])

  return (
    <div
      className="w-screen h-screen relative flex overflow-hidden select-none"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      {/* Background */}
      <Image src="/m_background.svg" alt="" fill style={{ objectFit: 'cover', zIndex: 0 }} priority />

      {/* ── LEFT SIDEBAR — Leaderboard ── */}
      <div className="relative z-10 flex flex-col items-center"
        style={{ width: '32vw', minWidth: 260, maxWidth: 420, padding: '2vh 2vw', flexShrink: 0 }}>

        {/* Leaderboard title */}
        <Image src="/Leaderboard-title.svg" alt="Leaderboard" width={400} height={100}
          style={{ width: '90%', height: 'auto', marginBottom: '2vh' }} />

        {/* Doctor frame avatar */}
        <Image src="/Leaderboard-Doctor-frame.svg" alt="Doctor" width={120} height={140}
          style={{ width: 'clamp(70px, 8vw, 110px)', height: 'auto', marginBottom: '2vh' }} />

        {/* Leaderboard list background */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Image src="/Leaderboard_Overview.svg" alt="" width={400} height={600}
            style={{ width: '100%', height: 'auto', display: 'block' }} />

          {/* Player list overlay */}
          <div style={{
            position: 'absolute', inset: '8% 6% 6%',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-around',
          }}>
            {players.length === 0
              ? Array.from({ length: 10 }, (_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'clamp(7px, 0.9vw, 11px)', color: '#F2DF00' }}>
                    {i + 1}. Doctor name
                  </span>
                  <span style={{ fontSize: 'clamp(7px, 0.9vw, 11px)', color: '#F2DF00' }}>1200 ⭐</span>
                </div>
              ))
              : players.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'clamp(7px, 0.9vw, 11px)', color: '#F2DF00' }}>
                    {i + 1}. {p.name}
                  </span>
                  <span style={{ fontSize: 'clamp(7px, 0.9vw, 11px)', color: '#F2DF00' }}>{p.xp} ⭐</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE — AutocathFFR + video ── */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 gap-6 px-6">

        {/* AutocathFFR title */}
        <Image src="/AutocathFFR.svg" alt="AutocathFFR" width={500} height={80}
          style={{ width: 'clamp(200px, 35vw, 500px)', height: 'auto' }} />

        {/* Engagement video placeholder */}
        <div style={{
          width: '100%', maxWidth: 700, aspectRatio: '16/9',
          border: '4px solid #7878e0', borderRadius: 16,
          background: '#0a0a2e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* TODO: replace with engagement video */}
          <span style={{ fontSize: 'clamp(8px, 1vw, 12px)', color: '#7878e0' }}>Engagement video</span>
        </div>
      </div>
    </div>
  )
}
