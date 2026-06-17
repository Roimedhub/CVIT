'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import BackgroundPattern from '../components/BackgroundPattern'

export default function GamePage() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState('Doctor name')
  const [guess, setGuess] = useState('')
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [countdown, setCountdown] = useState<number | 'GO!' | null>(3)

  useEffect(() => {
    const name = sessionStorage.getItem('playerName')
    if (name) setPlayerName(name)
  }, [])

  // Countdown logic — runs on mount and after each round
  useEffect(() => {
    const sequence: (number | 'GO!' | null)[] = [3, 2, 1, 'GO!', null]
    let i = 0
    setCountdown(3)
    const interval = setInterval(() => {
      i++
      setCountdown(sequence[i] ?? null)
      if (i >= sequence.length - 1) clearInterval(interval)
    }, 900)
    return () => clearInterval(interval)
  }, [round])

  const startNextRound = () => {
    if (!guess) return
    setGuess('')
    setRound(r => r + 1)
  }

  return (
    <div
      className="bg-m-pattern w-screen h-screen relative flex flex-col overflow-hidden select-none"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      <BackgroundPattern />

      {/* ── TOP HUD ── */}
      <div className="relative z-10 flex items-center justify-between px-3 py-2 flex-shrink-0"
        style={{ height: '13vh', background: 'rgba(0,0,0,0.25)' }}
      >
        {/* Doctor side */}
        <div className="flex items-center gap-2">
          <div style={{
            width: 64, height: 64, border: '3px solid #f8d20b',
            borderRadius: 6, overflow: 'hidden', flexShrink: 0,
            background: '#1a1a6e'
          }}>
            <Image src="/doctor.png" alt="Doctor" width={64} height={64}
              className="object-cover w-full h-full" style={{ imageRendering: 'pixelated', transform: 'scaleX(-1)' }} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white" style={{ fontSize: 10 }}>{playerName}</span>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: 10, color: '#f8d20b' }}>{score}</span>
              <span style={{ fontSize: 12 }}>⭐</span>
            </div>
          </div>
        </div>

        {/* Center — title + round */}
        <div className="flex flex-col items-center gap-1">
          <span className="title-gradient" style={{ fontSize: 'clamp(10px, 1.4vw, 18px)', WebkitTextStroke: '1px #7a0000' }}>
            MAN vs MACHINE
          </span>
          <div style={{
            background: '#f8d20b', border: '2px solid #c4900a',
            borderRadius: 20, padding: '3px 16px',
          }}>
            <span style={{ fontSize: 10, color: '#1a1a1a' }}>ROUND {round}</span>
          </div>
        </div>

        {/* AI side */}
        <div className="flex items-center gap-2 flex-row-reverse">
          <div style={{
            width: 64, height: 64, border: '3px solid #00e5ff',
            borderRadius: 6, overflow: 'hidden', flexShrink: 0,
            background: '#1a1a6e'
          }}>
            <Image src="/robot.png" alt="AI" width={64} height={64}
              className="object-cover w-full h-full" style={{ imageRendering: 'pixelated' }} />
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-white" style={{ fontSize: 10 }}>AutocathFFR</span>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: 12 }}>⭐</span>
              <span style={{ fontSize: 10, color: '#f8d20b' }}>0</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN AREA ── */}
      <div className="relative z-10 flex flex-1 items-center min-h-0 px-2 gap-2" style={{ paddingBottom: '11vh' }}>

        {/* Doctor character */}
        <div className="flex-shrink-0 flex items-center justify-center h-full" style={{ width: '14vw', paddingBottom: '4vh' }}>
          <Image src="/doctor.png" alt="Doctor" width={180} height={320}
            className="object-contain"
            style={{ imageRendering: 'pixelated', maxHeight: '70%', transform: 'scaleX(-1)' }}
          />
        </div>

        {/* Center content — video + game slide */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 h-full min-w-0">

          {/* Video placeholder */}
          <div style={{
            width: '100%', aspectRatio: '16/9', maxHeight: '44%',
            border: '3px solid #7878e0', borderRadius: 12,
            background: '#0a0a2e', position: 'relative', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* TODO: replace with <video> tag */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: '#7878e0' }}>3 sec loop video</div>
              <div style={{ fontSize: 8, color: '#555', marginTop: 4 }}>angiogram.mp4</div>
            </div>
          </div>

          {/* Game slide placeholder */}
          <div style={{
            width: '100%', aspectRatio: '4/3', maxHeight: '44%',
            border: '3px solid #7878e0', borderRadius: 12,
            background: '#0a0a2e', position: 'relative', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* TODO: replace with <img> of game slide */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: '#FFA200' }}>Game slide</div>
              <div style={{ fontSize: 8, color: '#555', marginTop: 4 }}>frame with lesions</div>
            </div>
          </div>
        </div>

        {/* Robot character */}
        <div className="flex-shrink-0 flex items-center justify-center h-full" style={{ width: '14vw', paddingBottom: '4vh' }}>
          <div style={{ overflow: 'hidden', width: 220, height: 400, clipPath: 'inset(0 0 0 6px)' }}>
            <div className="robot-sprite" />
          </div>
        </div>
      </div>

      {/* ── BOTTOM INPUT BAR ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-2 px-4"
        style={{ height: '11vh', background: 'rgba(10,10,60,0.85)', borderTop: '2px solid #3a3a9e' }}
      >
        <input
          className="game-input flex-1 rounded px-3 py-2"
          style={{ fontSize: 12, height: '5vh' }}
          type="number"
          min="0" max="1" step="0.01"
          placeholder="Enter FFR value (0.00 – 1.00)"
          value={guess}
          onChange={e => setGuess(e.target.value)}
        />
        <div
          role="button"
          onClick={() => {
            if (!guess) return
            // TODO: submit guess logic
            setGuess('')
            setRound(r => r + 1)
          }}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 12,
            padding: '10px 20px',
            borderRadius: 6,
            backgroundColor: '#00FF99',
            backgroundImage: 'none',
            border: '3px solid #005c2e',
            boxShadow: '0 4px 0 #005c2e',
            color: '#001a0d',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          NEXT ▶
        </div>
      </div>

      {/* Floor strip behind bottom bar */}
      <div className="floor-gradient absolute bottom-0 left-0 right-0 z-0" style={{ height: '11vh' }} />

      {/* ── COUNTDOWN OVERLAY ── */}
      {countdown !== null && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(10,10,50,0.65)', backdropFilter: 'blur(2px)' }}
        >
          <div
            key={String(countdown)}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: countdown === 'GO!' ? 'clamp(60px, 10vw, 130px)' : 'clamp(100px, 18vw, 220px)',
              color: countdown === 'GO!' ? '#00FF99' : '#ffffff',
              textShadow: countdown === 'GO!'
                ? '0 0 40px #00FF99, 4px 4px 0 #005c2e'
                : '6px 6px 0 #1a1a6e, -2px -2px 0 #3a3aae',
              animation: 'countPop 0.9s ease-out forwards',
              lineHeight: 1,
            }}
          >
            {countdown}
          </div>
        </div>
      )}

      <style>{`
        @keyframes countPop {
          0%   { transform: scale(1.6); opacity: 0; }
          20%  { transform: scale(1.0); opacity: 1; }
          75%  { transform: scale(1.0); opacity: 1; }
          100% { transform: scale(0.7); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
