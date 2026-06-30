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
      style={{ fontFamily: "'Pixelify Sans', sans-serif" }}
    >
      <Image src="/m_background.svg" alt="" fill style={{ objectFit: 'cover', zIndex: 0 }} priority />

      {/* Title */}
      <div className="relative z-10 flex-shrink-0 flex justify-center" style={{ marginBottom: '2vh' }}>
        <Image src="/ManVsMachine.svg" alt="MAN vs MACHINE" width={581} height={112}
          style={{ width: 'clamp(240px, 38vw, 560px)', height: 'auto' }} priority />
      </div>

      {/* Center row: DOCTOR | card | ROBOT */}
      <div className="relative z-10 flex flex-row items-center justify-center w-full" style={{ maxWidth: '98vw' }}>

        {/* DOCTOR character — animated */}
        <div style={{ flexShrink: 0 }}>
          <div className="doctor-score" />
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

            {/* Two-column grid — rows align: name | autocathFFR, hospital | medhubai, score | score */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto auto', width: '100%', flex: 1, gap: '6px 4%', alignItems: 'center', alignContent: 'center' }}>

              {/* Row 1: doctor name | AutocathFFR */}
              <span style={{
                fontFamily: "'Pixelify Sans', sans-serif",
                fontSize: 'clamp(10px, 1.4vw, 18px)',
                color: '#F2DF00',
                textShadow: '1px 1px 0 #000',
                wordBreak: 'break-word',
              }}>{playerName}</span>
              <span style={{
                fontFamily: "'Pixelify Sans', sans-serif",
                fontSize: 'clamp(10px, 1.4vw, 18px)',
                color: '#00e5ff',
                textShadow: '1px 1px 0 #000',
                textAlign: 'right',
              }}>AutocathFFR</span>

              {/* Row 2: hospital | MedHub.AI */}
              <span style={{
                fontFamily: "'Pixelify Sans', sans-serif",
                fontSize: 'clamp(8px, 1.1vw, 15px)',
                color: '#F2DF00',
                textShadow: '1px 1px 0 #000',
                wordBreak: 'break-word',
              }}>{playerHospital}</span>
              <span style={{
                fontFamily: "'Pixelify Sans', sans-serif",
                fontSize: 'clamp(8px, 1.1vw, 15px)',
                color: '#00e5ff',
                textShadow: '1px 1px 0 #000',
                textAlign: 'right',
              }}>MedHub.AI</span>

              {/* Row 3: doctor score | robot score */}
              <img src="/doctor result game score.svg" alt="Doctor result"
                style={{ width: '85%', height: 'auto' }} />
              <img src="/robot result game score.svg" alt="Robot result"
                style={{ width: '85%', height: 'auto', justifySelf: 'end' }} />
            </div>
          </div>
        </div>

        {/* ROBOT character — animated */}
        <div style={{ flexShrink: 0 }}>
          <div className="robot-score" />
        </div>
      </div>
    </div>
  )
}
