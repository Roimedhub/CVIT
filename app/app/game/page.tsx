'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [roundBanner, setRoundBanner] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [timeLeft, setTimeLeft] = useState(90)
  const [timerActive, setTimerActive] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const name = sessionStorage.getItem('playerName')
    if (name) setPlayerName(name)
  }, [])

  // Round 1: 3→2→1→GO! then start timer. Subsequent rounds: show "ROUND X" briefly.
  useEffect(() => {
    if (round === 1) {
      const sequence: (number | 'GO!' | null)[] = [3, 2, 1, 'GO!', null]
      let i = 0
      setCountdown(3)
      const interval = setInterval(() => {
        i++
        const val = sequence[i] ?? null
        setCountdown(val)
        if (val === 'GO!') setTimerActive(true)
        if (i >= sequence.length - 1) clearInterval(interval)
      }, 900)
      return () => clearInterval(interval)
    } else {
      setRoundBanner(round)
      const t = setTimeout(() => setRoundBanner(null), 1500)
      return () => clearTimeout(t)
    }
  }, [round])

  // 90-second game timer — only ticks when active
  useEffect(() => {
    if (!timerActive) return
    if (timeLeft <= 0) {
      const t = setTimeout(() => setShowScore(true), 3000)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, timerActive])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setIsPlaying(true) }
    else { v.pause(); setIsPlaying(false) }
  }

  const handleScroll = (e: React.WheelEvent) => {
    const v = videoRef.current
    if (!v || isPlaying) return
    e.preventDefault()
    const fps = 15
    const step = 1 / fps
    v.currentTime = Math.min(v.duration, Math.max(0, v.currentTime + (e.deltaY > 0 ? step : -step)))
  }

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
      <Image src="/m_background.svg" alt="" fill style={{ objectFit: 'cover', zIndex: 0 }} priority />

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
            <Image src="/DoctorGame.svg" alt="Doctor" width={64} height={64}
              className="object-cover w-full h-full" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white" style={{ fontSize: 10 }}>{playerName}</span>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: 10, color: '#f8d20b' }}>{score}</span>
              <span style={{ fontSize: 12 }}>⭐</span>
            </div>
          </div>
        </div>

        {/* Center — round + timer */}
        <div className="flex flex-col items-center gap-1">
          {/* ROUND badge */}
          <div style={{
            background: '#6E71FF',
            borderRadius: 8,
            padding: 'clamp(4px, 0.8vh, 8px) clamp(14px, 2vw, 28px)',
          }}>
            <span style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(11px, 1.6vw, 20px)',
              color: '#ffffff',
              WebkitTextStroke: '1px #000',
              textShadow: '2px 2px 0 #000',
              letterSpacing: '0.05em',
              lineHeight: 1,
            }}>ROUND {round}</span>
          </div>
          {/* Timer — styled like Timer.svg: yellow, black outline */}
          <div style={{ position: 'relative' }}>
            <Image src="/Timer.svg" alt="timer" width={326} height={88}
              style={{ width: 'clamp(100px, 14vw, 200px)', height: 'auto', opacity: 0 }} />
            <span style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(16px, 2.4vw, 36px)',
              color: timeLeft <= 10 ? '#ff4444' : '#F2DF00',
              WebkitTextStroke: '2px #000',
              textShadow: '3px 3px 0 #000',
              lineHeight: 1,
            }}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* AI side */}
        <div className="flex items-center gap-2 flex-row-reverse">
          <div style={{
            width: 64, height: 64, border: '3px solid #00e5ff',
            borderRadius: 6, overflow: 'hidden', flexShrink: 0,
            background: '#1a1a6e'
          }}>
            <Image src="/RobotGame.svg" alt="AI" width={64} height={64}
              className="object-cover w-full h-full" />
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

        {/* Doctor buzzer (left) */}
        <div className="flex-shrink-0 flex items-center justify-center h-full" style={{ width: '14vw' }}>
          <Image src="/OrangeBuzzer.svg" alt="Doctor Buzzer" width={180} height={180}
            className="object-contain" style={{ width: 'clamp(80px, 10vw, 160px)', height: 'auto' }}
          />
        </div>

        {/* Center content — video + frame side by side */}
        <div className="flex-1 flex flex-row items-center justify-center gap-3 h-full min-w-0">

          {/* Angiogram video — 512×512 */}
          <div
            onClick={togglePlay}
            onWheel={handleScroll}
            style={{
              width: 'min(68vh, 40vw)', height: 'min(68vh, 40vw)',
              flexShrink: 0,
              border: '3px solid #7878e0', borderRadius: 12,
              background: '#000', overflow: 'hidden',
              cursor: 'pointer', position: 'relative',
            }}
          >
            <video
              ref={videoRef}
              key={round}
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            >
              <source src="/round1_h264.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Game frame — 512×512 */}
          <div style={{
            width: 'min(68vh, 40vw)', height: 'min(68vh, 40vw)',
            flexShrink: 0,
            border: '3px solid #7878e0', borderRadius: 12,
            background: '#0a0a2e', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Image src="/TestFrame.png" alt="Game frame" width={512} height={512}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
          </div>
        </div>

        {/* Robot buzzer (right) */}
        <div className="flex-shrink-0 flex items-center justify-center h-full" style={{ width: '14vw' }}>
          <Image src="/GreenBuzzer.svg" alt="Robot Buzzer" width={180} height={180}
            className="object-contain" style={{ width: 'clamp(80px, 10vw, 160px)', height: 'auto' }}
          />
        </div>
      </div>

      {/* ── BOTTOM INPUT BAR ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-3" style={{ height: '11vh' }}>
        <input
          className="game-input rounded px-3"
          style={{ fontSize: 11, height: '5.5vh', width: 'clamp(300px, 50vw, 640px)',
            background: 'rgba(10,10,60,0.85)', border: '2px solid #3a3a9e', borderRadius: 10 }}
          type="number"
          min="0" max="1" step="0.01"
          placeholder="Enter FFR Value"
          value={guess}
          onChange={e => setGuess(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && guess) { setGuess(''); setRound(r => r + 1) } }}
        />
        <div
          role="button"
          onClick={() => {
            if (!guess) return
            setGuess('')
            setRound(r => r + 1)
          }}
          style={{
            cursor: 'pointer', flexShrink: 0,
            padding: '0 24px',
            height: '5.5vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1,
            borderRadius: 14,
            background: 'linear-gradient(180deg, #02D2AC 59%, #83E4C2 75%, #1FB883 86.5%, #023730 100%)',
            border: '4px solid #000',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(13px, 1.4vw, 18px)',
            color: '#ffffff',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>NEXT</span>
            <span style={{ fontSize: '1.5em', transform: 'translateY(-15%)', display: 'inline-block' }}>▶</span>
          </span>
        </div>
      </div>

      {/* ── TIME OUT OVERLAY ── */}
      {timeLeft <= 0 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
          <Image src="/TIMEOUT.svg" alt="TIME OUT" width={600} height={200}
            style={{ width: 'clamp(300px, 50vw, 700px)', height: 'auto' }} />
        </div>
      )}

      {/* ── GAME SCORE OVERLAY ── */}
      {showScore && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div style={{ position: 'relative', width: 'clamp(340px, 55vw, 700px)' }}>
            {/* Background rectangle */}
            <Image src="/RectangleGameScore.png" alt="" width={700} height={400}
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 16 }} />

            {/* Content overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center',
              padding: '5% 8% 7%',
              gap: '6%',
            }}>
              {/* Game Score title */}
              <Image src="/GameScore.svg" alt="GAME SCORE" width={400} height={80}
                style={{ width: '70%', height: 'auto', flexShrink: 0 }} />

              {/* Two columns */}
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', flex: 1 }}>

                {/* Doctor side */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
                  <Image src="/DoctorName.svg" alt="Doctor name" width={200} height={40}
                    style={{ width: 'clamp(100px, 18vw, 220px)', height: 'auto' }} />
                  <Image src="/Organization.svg" alt="Organization" width={200} height={40}
                    style={{ width: 'clamp(100px, 18vw, 220px)', height: 'auto' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(18px, 2.5vw, 32px)', color: '#fff' }}>60</span>
                    <span style={{ fontSize: 'clamp(18px, 2.5vw, 32px)' }}>⭐</span>
                  </div>
                </div>

                {/* AI side */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16 }}>
                  <Image src="/AutocathFFR.svg" alt="AutocathFFR" width={200} height={40}
                    style={{ width: 'clamp(100px, 18vw, 220px)', height: 'auto' }} />
                  <Image src="/MedhubAI.svg" alt="Medhub.AI" width={200} height={40}
                    style={{ width: 'clamp(100px, 18vw, 220px)', height: 'auto' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(18px, 2.5vw, 32px)', color: '#fff' }}>85</span>
                    <span style={{ fontSize: 'clamp(18px, 2.5vw, 32px)' }}>⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ROUND BANNER (between rounds) ── */}
      {roundBanner !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(10,10,50,0.65)', backdropFilter: 'blur(2px)', pointerEvents: 'none' }}>
          <div key={roundBanner} style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(40px, 8vw, 100px)',
            color: '#ffffff',
            textShadow: '6px 6px 0 #1a1a6e, -2px -2px 0 #3a3aae',
            animation: 'countPop 1.5s ease-out forwards',
            lineHeight: 1, textAlign: 'center',
          }}>
            ROUND {roundBanner}
          </div>
        </div>
      )}

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
