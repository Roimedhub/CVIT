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

    // Auto-navigate to leaderboard after 7 seconds
    const t = setTimeout(() => router.push('/leaderboard'), 7000)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div
      className="w-screen h-screen relative flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      {/* Same background as login */}
      <Image src="/m_background.svg" alt="" fill style={{ objectFit: 'cover', zIndex: 0 }} priority />

      {/* Same title as login */}
      <div className="relative z-10 flex-shrink-0 flex justify-center" style={{ marginBottom: '2vh' }}>
        <Image src="/ManVsMachine.svg" alt="MAN vs MACHINE" width={581} height={112}
          style={{ width: 'clamp(240px, 38vw, 560px)', height: 'auto' }} priority />
      </div>

      {/* Center row: DOCTOR character | rectangle card | ROBOT character */}
      <div className="relative z-10 flex flex-row items-center justify-center w-full"
        style={{ gap: 0, maxWidth: '95vw' }}>

        {/* DOCTOR character — left of rectangle */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-end' }}>
          <img src="/DOCTOR game score.svg" alt="Doctor"
            style={{ width: 'clamp(80px, 12vw, 170px)', height: 'auto', display: 'block' }} />
        </div>

        {/* Main rectangle card */}
        <div style={{ position: 'relative', width: 'clamp(320px, 54vw, 820px)', flexShrink: 0 }}>
          <img src="/Gamescore beckground.svg" alt=""
            style={{ width: '100%', height: 'auto', display: 'block' }} />

          {/* Content overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center',
            padding: '6% 6% 8%',
            gap: '5%',
          }}>
            {/* Game Score title */}
            <img src="/game score title.svg" alt="Game Score"
              style={{ width: '65%', height: 'auto', flexShrink: 0 }} />

            {/* Two-column row: doctor info | autocath info */}
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4%', flex: 1 }}>

              {/* Left: doctor name/org + score */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10%' }}>
                <img src="/doctor name and organization game score.svg" alt="Doctor info"
                  style={{ width: '90%', height: 'auto' }} />
                <img src="/doctor result game score.svg" alt="Doctor result"
                  style={{ width: '80%', height: 'auto' }} />
              </div>

              {/* Right: autocathFFR/MedHubAI + robot score */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10%' }}>
                <img src="/autocathFFR - MedHubai game score.svg" alt="AutocathFFR"
                  style={{ width: '90%', height: 'auto' }} />
                <img src="/robot result game score.svg" alt="Robot result"
                  style={{ width: '80%', height: 'auto' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ROBOT character — right of rectangle */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-end' }}>
          <img src="/ROBOT game score.svg" alt="Robot"
            style={{ width: 'clamp(80px, 12vw, 170px)', height: 'auto', display: 'block' }} />
        </div>
      </div>
    </div>
  )
}
