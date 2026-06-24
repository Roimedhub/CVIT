'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function GameScorePage() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState('Doctor name')
  const [playerHospital, setPlayerHospital] = useState('Organization')
  const [score, setScore] = useState(0)

  useEffect(() => {
    const name = sessionStorage.getItem('playerName')
    const hospital = sessionStorage.getItem('playerHospital')
    const xp = sessionStorage.getItem('finalScore')
    if (name) setPlayerName(name)
    if (hospital) setPlayerHospital(hospital)
    if (xp) setScore(Number(xp))

    const t = setTimeout(() => router.push('/leaderboard'), 7000)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div
      className="w-screen h-screen relative flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      <Image src="/m_background.svg" alt="" fill style={{ objectFit: 'cover', zIndex: 0 }} priority />

      {/* Title */}
      <div className="relative z-10 flex-shrink-0 flex justify-center" style={{ marginBottom: '2vh' }}>
        <Image src="/ManVsMachine.svg" alt="MAN vs MACHINE" width={581} height={112}
          style={{ width: 'clamp(240px, 38vw, 560px)', height: 'auto' }} priority />
      </div>

      {/* Center row: DOCTOR | card | ROBOT */}
      <div className="relative z-10 flex flex-row items-center justify-center w-full" style={{ maxWidth: '98vw' }}>

        {/* DOCTOR character */}
        <div style={{ flexShrink: 0 }}>
          <img src="/DOCTOR game score.svg" alt="Doctor"
            style={{ width: 'clamp(120px, 18vw, 260px)', height: 'auto', display: 'block' }} />
        </div>

        {/* Card — smaller rectangle */}
        <div style={{ position: 'relative', width: 'clamp(260px, 38vw, 580px)', flexShrink: 0 }}>
          <img src="/Gamescore beckground.svg" alt=""
            style={{ width: '100%', height: 'auto', display: 'block' }} />

          {/* Content overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center',
            padding: '7% 6% 9%',
            gap: '6%',
          }}>
            {/* Game Score title */}
            <img src="/game score title.svg" alt="Game Score"
              style={{ width: '70%', height: 'auto', flexShrink: 0 }} />

            {/* Two-column row */}
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4%', flex: 1 }}>

              {/* Left: real doctor name/hospital + score SVG */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'clamp(7px, 1vw, 13px)',
                  color: '#F2DF00',
                  WebkitTextStroke: '1px #000',
                  textShadow: '1px 1px 0 #000',
                  wordBreak: 'break-all',
                }}>{playerName}</span>
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'clamp(6px, 0.8vw, 11px)',
                  color: '#F2DF00',
                  WebkitTextStroke: '1px #000',
                  textShadow: '1px 1px 0 #000',
                  wordBreak: 'break-all',
                }}>{playerHospital}</span>
                <img src="/doctor result game score.svg" alt="Doctor result"
                  style={{ width: '85%', height: 'auto', marginTop: '8%' }} />
              </div>

              {/* Right: autocathFFR/MedHubAI + robot score */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <img src="/autocathFFR - MedHubai game score.svg" alt="AutocathFFR"
                  style={{ width: '90%', height: 'auto' }} />
                <img src="/robot result game score.svg" alt="Robot result"
                  style={{ width: '85%', height: 'auto', marginTop: '8%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ROBOT character */}
        <div style={{ flexShrink: 0 }}>
          <img src="/ROBOT game score.svg" alt="Robot"
            style={{ width: 'clamp(120px, 18vw, 260px)', height: 'auto', display: 'block' }} />
        </div>
      </div>
    </div>
  )
}
