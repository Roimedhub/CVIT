'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function GameScorePage() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState('Doctor name')
  const [playerHospital, setPlayerHospital] = useState('Organization')
  const [score, setScore] = useState(0)
  const [robotScore, setRobotScore] = useState(0)

  useEffect(() => {
    const name = sessionStorage.getItem('playerName')
    const hospital = sessionStorage.getItem('playerHospital')
    const xp = sessionStorage.getItem('finalScore')
    const rxp = sessionStorage.getItem('robotFinalScore')
    if (name) setPlayerName(name)
    if (hospital) setPlayerHospital(hospital)
    if (xp) setScore(Number(xp))
    if (rxp) setRobotScore(Number(rxp))

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

            {/* Two columns — each has name/org stacked above score, centered */}
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flex: 1, alignItems: 'center', justifyContent: 'space-around', gap: '4%' }}>

              {/* LEFT — Doctor */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, flex: 1, paddingLeft: '8%' }}>
                <span style={{
                  fontFamily: "'Pixelify Sans', sans-serif",
                  fontSize: 'clamp(13px, 1.8vw, 24px)',
                  color: '#F2DF00',
                  textShadow: '1px 1px 0 #000',
                  wordBreak: 'break-word',
                }}>{playerName}</span>
                <span style={{
                  fontFamily: "'Pixelify Sans', sans-serif",
                  fontSize: 'clamp(10px, 1.3vw, 18px)',
                  color: '#F2DF00',
                  textShadow: '1px 1px 0 #000',
                  wordBreak: 'break-word',
                }}>{playerHospital}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 'clamp(22px, 3vw, 42px)',
                    color: '#fff',
                    textShadow: '2px 2px 0 #000',
                  }}>{score}</span>
                  <span style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}>⭐</span>
                </div>
              </div>

              {/* RIGHT — Robot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, flex: 1, paddingLeft: '8%' }}>
                <span style={{
                  fontFamily: "'Pixelify Sans', sans-serif",
                  fontSize: 'clamp(13px, 1.8vw, 24px)',
                  color: '#00e5ff',
                  textShadow: '1px 1px 0 #000',
                }}>AutocathFFR</span>
                <span style={{
                  fontFamily: "'Pixelify Sans', sans-serif",
                  fontSize: 'clamp(10px, 1.3vw, 18px)',
                  color: '#00e5ff',
                  textShadow: '1px 1px 0 #000',
                }}>MedHub.AI</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 'clamp(22px, 3vw, 42px)',
                    color: '#fff',
                    textShadow: '2px 2px 0 #000',
                  }}>{robotScore}</span>
                  <span style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', filter: 'hue-rotate(160deg)' }}>⭐</span>
                </div>
              </div>
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
