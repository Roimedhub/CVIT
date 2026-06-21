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
      <div className="relative z-10 flex flex-col"
        style={{ width: '32vw', minWidth: 260, maxWidth: 420, padding: '1.5vh 2vw', flexShrink: 0 }}>

        {/* Show only the top portion of the SVG (title banner + doctor frame).
            The SVG viewBox is 894×1745. The header+avatar takes ~43% of the height.
            We clip by limiting container height to 43% of the SVG's natural rendered height.
            Natural rendered height = width × (1745/894) ≈ width × 1.952
            Clip height = 1.952 × 0.43 × width ≈ 0.84 × width → padding-bottom trick */}
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden', height: '84%', maxHeight: '44vw' }}>
          <Image
            src="/Leaderboard_Overview.svg"
            alt="Leaderboard"
            width={894}
            height={1745}
            style={{ width: '100%', height: 'auto', display: 'block', position: 'absolute', top: 0, left: 0 }}
          />
        </div>

        {/* Real player list — rendered below the clipped header graphic */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: 'clamp(4px, 0.9vh, 10px)',
          paddingTop: 'clamp(4px, 1vh, 12px)',
          paddingLeft: '2%',
          paddingRight: '2%',
        }}>
          {players.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(10,10,60,0.45)',
              borderRadius: 6,
              padding: '2px 8px',
            }}>
              <span style={{ fontSize: 'clamp(7px, 0.85vw, 11px)', color: '#F2DF00' }}>
                {i + 1}. {p.name}
              </span>
              <span style={{ fontSize: 'clamp(7px, 0.85vw, 11px)', color: '#F2DF00' }}>{p.xp} ⭐</span>
            </div>
          ))}
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
          <span style={{ fontSize: 'clamp(8px, 1vw, 12px)', color: '#7878e0' }}>Engagement video</span>
        </div>
      </div>
    </div>
  )
}
