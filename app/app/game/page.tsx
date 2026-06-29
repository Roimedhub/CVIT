'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const STORAGE_URL = 'https://kdrweurtenixsvjcfxdi.supabase.co/storage/v1/object/public/game-rounds'

type GameCase = {
  case_name: string
  invasive: number
  autocath: number
  video_file: string
  frame_file: string
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function GamePage() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState('Doctor name')
  const [playerHospital, setPlayerHospital] = useState('Organization')
  const [playerId, setPlayerId] = useState('')
  const [guess, setGuess] = useState('')
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [robotScore, setRobotScore] = useState(0)
  const [countdown, setCountdown] = useState<number | 'GO!' | null>(3)

  const [timeLeft, setTimeLeft] = useState(90)
  const [timerActive, setTimerActive] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [showRoundResult, setShowRoundResult] = useState(false)
  const [showXP, setShowXP] = useState(false)
  const [showNextRound, setShowNextRound] = useState(false)
  const [currentGuess, setCurrentGuess] = useState('')
  const [cases, setCases] = useState<GameCase[]>([])
  const [showDoctorBuzz, setShowDoctorBuzz] = useState(false)
  const [showRobotBuzz, setShowRobotBuzz] = useState(false)

  const currentCase = cases[round - 1] ?? null

  // Auto-play video whenever the case changes
  // Navigate to game-score page when time is up
  useEffect(() => {
    if (!showScore) return
    sessionStorage.setItem('finalScore', String(score))
    router.push('/game-score')
  }, [showScore, router, score])

  useEffect(() => {
    const name = sessionStorage.getItem('playerName')
    const hospital = sessionStorage.getItem('playerHospital')
    const id = sessionStorage.getItem('playerId')
    if (name) setPlayerName(name)
    if (hospital) setPlayerHospital(hospital)
    if (id) setPlayerId(id)
  }, [])

  // Fetch and shuffle cases from Supabase once on mount
  useEffect(() => {
    supabase
      .from('game_rounds')
      .select('case_name, invasive, autocath, video_file, frame_file')
      .then(({ data }) => {
        if (data) setCases(shuffle(data as GameCase[]))
      })
  }, [])

  // Round 1: 3→2→1→GO! then start timer. Subsequent rounds: show "ROUND X" briefly.
  useEffect(() => {
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
  }, [])

  // Robot buzz: random trigger 5–15s after each round starts
  useEffect(() => {
    setShowRobotBuzz(false)
    const delay = 5000 + Math.random() * 10000
    const t = setTimeout(() => setShowRobotBuzz(true), delay)
    return () => clearTimeout(t)
  }, [round])

  // 90-second game timer — only ticks when active
  useEffect(() => {
    if (!timerActive) return
    if (timeLeft <= 0) {
      if (playerId) {
        fetch('/api/players', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: playerId, xp: 60 }),
        }).catch(console.error)
      }
      const t = setTimeout(() => setShowScore(true), 3000)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, timerActive])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleDone = () => {
    if (!guess) return
    setCurrentGuess(guess)
    setGuess('')
    setTimerActive(false)
    setShowDoctorBuzz(true)   // immediately show buzz

    setTimeout(() => {
      setShowRoundResult(true) // round result after 2s
    }, 2000)

    setTimeout(() => {
      setShowXP(true)
      setScore(s => s + 16)
      setRobotScore(s => s + 20)
    }, 3000)

    setTimeout(() => {
      setShowXP(false)
      setShowRoundResult(false)
      setShowNextRound(true)
    }, 7000)

    setTimeout(() => {
      setShowNextRound(false)
      setRound(r => r + 1)
      setTimerActive(true)
      setShowDoctorBuzz(false)
      setShowRobotBuzz(false)
    }, 10000)
  }

  return (
    <div
      className="w-screen h-screen relative flex flex-col overflow-hidden select-none"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      <Image src="/m_background.svg" alt="" fill style={{ objectFit: 'cover', zIndex: 0 }} priority />

      {/* ── HEADER BAR ── */}
      <div
        className="relative z-10 flex-shrink-0 flex items-center justify-between px-4"
        style={{ height: '13vh' }}
      >
        {/* Header background image */}
        <Image
          src="/header background.png"
          alt=""
          fill
          style={{ objectFit: 'cover', zIndex: -1 }}
          priority
        />

        {/* Doctor side */}
        <div className="flex items-center gap-2">
          <div style={{
            width: 56, height: 56, border: '3px solid #f8d20b',
            borderRadius: 6, overflow: 'hidden', flexShrink: 0,
            background: '#1a1a6e',
          }}>
            <Image src="/DoctorGame.svg" alt="Doctor" width={56} height={56}
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

        {/* Center — timer only (round badge is below header, absolute) */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(20px, 2.8vw, 42px)',
            color: timeLeft <= 10 ? '#ff4444' : '#F2DF00',
            WebkitTextStroke: '2px #000',
            textShadow: '3px 3px 0 #000',
            lineHeight: 1,
          }}>{formatTime(timeLeft)}</span>
        </div>

        {/* AI side */}
        <div className="flex items-center gap-2 flex-row-reverse">
          <div style={{
            width: 56, height: 56, border: '3px solid #00e5ff',
            borderRadius: 6, overflow: 'hidden', flexShrink: 0,
            background: '#1a1a6e',
          }}>
            <Image src="/RobotGame.svg" alt="AI" width={56} height={56}
              className="object-cover w-full h-full" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-white" style={{ fontSize: 10 }}>AutocathFFR</span>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: 12 }}>⭐</span>
              <span style={{ fontSize: 10, color: '#f8d20b' }}>{robotScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROUND BADGE — sits just below header, centered ── */}
      <div style={{
        position: 'absolute', top: '10vh', left: 0, right: 0, zIndex: 11,
        display: 'flex', justifyContent: 'center', pointerEvents: 'none',
      }}>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            src="/Round x background.png"
            alt=""
            width={160}
            height={36}
            style={{ width: 'clamp(200px, 26vw, 380px)', height: 'clamp(28px, 3.5vh, 44px)', display: 'block' }}
          />
          <span style={{
            position: 'absolute',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(9px, 1.2vw, 15px)',
            color: '#ffffff',
            WebkitTextStroke: '1px #000',
            textShadow: '2px 2px 0 #000',
            lineHeight: 1,
          }}>ROUND {round}</span>
        </div>
      </div>

      {/* ── MAIN AREA + BOTTOM INPUT ── */}
      <div className="relative z-10 flex flex-col flex-1 min-h-0 items-center"
        style={{ paddingLeft: '16vw', paddingRight: '16vw', paddingBottom: '12vh', paddingTop: '1vh' }}>

        {/* Video + frame panel */}
        <div style={{
          display: 'flex', flexDirection: 'row',
          alignItems: 'center', justifyContent: 'center',
          gap: 12,
          background: '#0d0d2e',
          border: '4px solid #6E71FF',
          borderRadius: 20,
          padding: 10,
          boxShadow: '0 0 32px rgba(110,113,255,0.5)',
          flex: 1,
          width: '100%',
          minHeight: 0,
        }}>
          {/* Angiogram GIF */}
          <div style={{
            flex: 1, minWidth: 0,
            aspectRatio: '1/1',
            maxHeight: '100%',
            border: '2px solid #3a3a9e', borderRadius: 8,
            background: '#000', overflow: 'hidden',
          }}>
            {currentCase && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={currentCase.case_name}
                src={`${STORAGE_URL}/${currentCase.video_file}.gif`}
                alt="Angiogram"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
            )}
          </div>

          {/* Game frame */}
          <div style={{
            flex: 1, minWidth: 0,
            aspectRatio: '1/1',
            maxHeight: '100%',
            border: '2px solid #3a3a9e', borderRadius: 8,
            background: '#0a0a2e', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {currentCase && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`${STORAGE_URL}/${currentCase.frame_file}`} alt="Game frame"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
            )}
          </div>
        </div>
      </div>

      {/* ── DOCTOR — absolutely positioned bottom-left ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, zIndex: showDoctorBuzz ? 60 : 15,
        pointerEvents: 'none',
      }}>
        <div className={showDoctorBuzz ? 'doctor-buzz' : 'doctor-think'} />
      </div>

      {/* ── ROBOT — absolutely positioned bottom-right ── */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0, zIndex: 15,
        pointerEvents: 'none',
      }}>
        <div className={showRobotBuzz ? 'robot-buzz' : 'robot-think'} />
      </div>

      {/* ── BOTTOM INPUT BAR — Result input and button.svg ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center"
        style={{ height: '12vh' }}
      >
        {/* SVG is 531×105: left dark input area (x=16–257), right green DONE! button (x=280–530) */}
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <Image
            src="/Result input and button.svg"
            alt=""
            width={531}
            height={105}
            style={{ width: 'clamp(180px, 26vw, 360px)', height: 'auto', display: 'block' }}
          />
          {/* Input — overlaid over the left dark area (0–48% of width) */}
          <input
            className="game-input"
            style={{
              position: 'absolute',
              left: '3%', top: '50%', transform: 'translateY(-50%)',
              width: '44%', height: '55%',
              fontSize: 'clamp(12px, 1.6vw, 22px)',
              background: 'transparent',
              border: 'none', outline: 'none',
              color: '#ffffff',
              fontFamily: "'Press Start 2P', monospace",
              textAlign: 'center',
            }}
            type="number"
            min="0" max="1" step="0.01"
            placeholder="FFR Value"
            value={guess}
            onChange={e => setGuess(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && guess) handleDone() }}
          />
          {/* Invisible click area over the right green DONE! button in the SVG */}
          <div
            role="button"
            onClick={handleDone}
            style={{
              position: 'absolute',
              left: '52%', top: '10%',
              width: '46%', height: '80%',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>

      {/* ── TIME OUT OVERLAY ── */}
      {timeLeft <= 0 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
          <Image src="/TIMEOUT.svg" alt="TIME OUT" width={600} height={200}
            style={{ width: 'clamp(300px, 50vw, 700px)', height: 'auto' }} />
        </div>
      )}

      {/* ── ROUND RESULT POPUP ── */}
      {showRoundResult && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-start"
          style={{ background: 'rgba(0,0,0,0.6)', paddingTop: '14vh' }}>

          {/* ── ROUND SUMMARY CARD ── */}
          <div style={{ position: 'relative', width: 'clamp(320px, 70vw, 900px)' }}>

            {/* Background rectangle */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Rectangle_Round_summary.svg" alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />

            {/* Content overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'row',
              alignItems: 'stretch',
              padding: '6% 4% 8%',
              gap: '2%',
            }}>

              {/* ── DOCTOR column ── */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <img src="/DoctorGame.svg" alt="Doctor"
                  style={{ width: 'clamp(36px, 5vw, 64px)', height: 'auto', borderRadius: 6, border: '2px solid #f8d20b' }} />
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'clamp(22px, 3.5vw, 48px)',
                  color: '#F2DF00',
                  textShadow: '3px 3px 0 #000',
                }}>{currentGuess || '—'}</span>
              </div>

              {/* ── CENTER column: Real FFR ── */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <img src="/FFR Result Round Summary.svg" alt="FFR Result"
                  style={{ width: '90%', height: 'auto' }} />
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <img src="/FFR Result icon round summary.svg" alt=""
                    style={{ width: 'clamp(24px, 3vw, 42px)', height: 'auto' }} />
                  <span style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 'clamp(22px, 3.5vw, 48px)',
                    color: '#ffffff',
                    textShadow: '3px 3px 0 #000',
                  }}>{currentCase?.invasive ?? '—'}</span>
                </div>
              </div>

              {/* ── ROBOT column ── */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <img src="/RobotGame.svg" alt="Robot"
                  style={{ width: 'clamp(36px, 5vw, 64px)', height: 'auto', borderRadius: 6, border: '2px solid #00e5ff' }} />
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'clamp(22px, 3.5vw, 48px)',
                  color: '#00e5ff',
                  textShadow: '3px 3px 0 #000',
                }}>{currentCase?.autocath ?? '—'}</span>
              </div>

            </div>
          </div>

          {/* XP animations — shown 1s after round result */}
          {showXP && (
            <>
              <div style={{
                position: 'absolute', left: '5vw', top: '40%',
                transform: 'translateY(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                animation: 'xpFloat 2s ease-out forwards',
                pointerEvents: 'none',
              }}>
                <Image src="/XP Doctor.svg" alt="XP Doctor" width={148} height={78}
                  style={{ width: 'clamp(80px, 10vw, 148px)', height: 'auto' }} />
              </div>
              <div style={{
                position: 'absolute', right: '5vw', top: '40%',
                transform: 'translateY(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                animation: 'xpFloat 2s ease-out forwards',
                pointerEvents: 'none',
              }}>
                <Image src="/XP Robot.svg" alt="XP Robot" width={148} height={78}
                  style={{ width: 'clamp(80px, 10vw, 148px)', height: 'auto' }} />
              </div>
            </>
          )}
        </div>
      )}

      {/* ── NEXT ROUND OVERLAY ── */}
      {showNextRound && (
        <div className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)', pointerEvents: 'none' }}>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src="/Round x background.png" alt="" width={160} height={36}
              style={{ width: 'clamp(260px, 34vw, 480px)', height: 'auto', display: 'block' }} />
            <span style={{
              position: 'absolute',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(14px, 2vw, 26px)',
              color: '#ffffff',
              WebkitTextStroke: '1px #000',
              textShadow: '2px 2px 0 #000',
              lineHeight: 1,
            }}>ROUND {round + 1}</span>
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
        @keyframes xpFloat {
          0%   { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-60px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
