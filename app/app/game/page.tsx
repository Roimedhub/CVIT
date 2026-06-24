'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function GamePage() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState('Doctor name')
  const [playerHospital, setPlayerHospital] = useState('Organization')
  const [playerId, setPlayerId] = useState('')
  const [guess, setGuess] = useState('')
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [countdown, setCountdown] = useState<number | 'GO!' | null>(3)
  const [roundBanner, setRoundBanner] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [timeLeft, setTimeLeft] = useState(90)
  const [timerActive, setTimerActive] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [showRoundResult, setShowRoundResult] = useState(false)
  const [showXP, setShowXP] = useState(false)
  const [showNextRound, setShowNextRound] = useState(false)
  const [currentGuess, setCurrentGuess] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

  // After Game Score shows for 7 seconds, navigate to leaderboard
  useEffect(() => {
    if (!showScore) return
    const t = setTimeout(() => router.push('/leaderboard'), 7000)
    return () => clearTimeout(t)
  }, [showScore, router])

  useEffect(() => {
    const name = sessionStorage.getItem('playerName')
    const hospital = sessionStorage.getItem('playerHospital')
    const id = sessionStorage.getItem('playerId')
    if (name) setPlayerName(name)
    if (hospital) setPlayerHospital(hospital)
    if (id) setPlayerId(id)
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

  const handleDone = () => {
    if (!guess) return
    setCurrentGuess(guess)
    setGuess('')
    setShowRoundResult(true)

    setTimeout(() => {
      setShowXP(true)
    }, 1000)

    setTimeout(() => {
      setShowXP(false)
      setShowRoundResult(false)
      setShowNextRound(true)
    }, 3000)

    setTimeout(() => {
      setShowNextRound(false)
      setRound(r => r + 1)
    }, 4500)
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

        {/* Center — timer + round badge */}
        <div className="flex flex-col items-center gap-1">
          {/* Timer */}
          <div style={{ position: 'relative' }}>
            <Image src="/Timer.svg" alt="timer" width={326} height={88}
              style={{ width: 'clamp(100px, 14vw, 200px)', height: 'auto', opacity: 0 }} />
            <span style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(20px, 2.8vw, 42px)',
              color: timeLeft <= 10 ? '#ff4444' : '#F2DF00',
              WebkitTextStroke: '2px #000',
              textShadow: '3px 3px 0 #000',
              lineHeight: 1,
            }}>{formatTime(timeLeft)}</span>
          </div>

          {/* ROUND badge using Round x background.png */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              src="/Round x background.png"
              alt=""
              width={160}
              height={36}
              style={{ width: 'clamp(100px, 12vw, 180px)', height: 'auto', display: 'block' }}
            />
            <span style={{
              position: 'absolute',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(9px, 1.2vw, 15px)',
              color: '#ffffff',
              WebkitTextStroke: '1px #000',
              textShadow: '2px 2px 0 #000',
              lineHeight: 1,
              pointerEvents: 'none',
            }}>ROUND {round}</span>
          </div>
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
              <span style={{ fontSize: 10, color: '#f8d20b' }}>0</span>
            </div>
          </div>
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
          {/* Angiogram video */}
          <div
            onClick={togglePlay}
            onWheel={handleScroll}
            style={{
              flex: 1, minWidth: 0,
              aspectRatio: '1/1',
              maxHeight: '100%',
              border: '2px solid #3a3a9e', borderRadius: 8,
              background: '#000', overflow: 'hidden',
              cursor: 'pointer', position: 'relative',
            }}
          >
            <video
              ref={videoRef}
              key={round}
              autoPlay loop muted playsInline
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            >
              <source src="/round1_h264.mp4" type="video/mp4" />
            </video>
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
            <Image src="/TestFrame.png" alt="Game frame" width={512} height={512}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
          </div>
        </div>
      </div>

      {/* ── DOCTOR — absolutely positioned bottom-left ── */}
      <div style={{
        position: 'absolute', bottom: '10vh', left: 0, zIndex: 15,
        width: '17vw', display: 'flex', flexDirection: 'column', alignItems: 'center',
        pointerEvents: 'none',
      }}>
        <Image src="/Doctor round.svg" alt="Doctor" width={300} height={420}
          style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
      </div>
      <div style={{
        position: 'absolute', bottom: '1vh', left: '2vw', zIndex: 15,
        width: '12vw', display: 'flex', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <Image src="/Doctor buzzer.svg" alt="Doctor Buzzer" width={120} height={80}
          style={{ width: '80%', height: 'auto', objectFit: 'contain' }} />
      </div>

      {/* ── ROBOT — absolutely positioned bottom-right ── */}
      <div style={{
        position: 'absolute', bottom: '10vh', right: 0, zIndex: 15,
        width: '17vw', display: 'flex', flexDirection: 'column', alignItems: 'center',
        pointerEvents: 'none',
      }}>
        <Image src="/Robot round.svg" alt="Robot" width={300} height={420}
          style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
      </div>
      <div style={{
        position: 'absolute', bottom: '1vh', right: '2vw', zIndex: 15,
        width: '12vw', display: 'flex', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <Image src="/Robot buzzer.svg" alt="Robot Buzzer" width={120} height={80}
          style={{ width: '80%', height: 'auto', objectFit: 'contain' }} />
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
            style={{ width: 'clamp(280px, 42vw, 531px)', height: 'auto', display: 'block' }}
          />
          {/* Input — overlaid over the left dark area (0–48% of width) */}
          <input
            className="game-input"
            style={{
              position: 'absolute',
              left: '3%', top: '50%', transform: 'translateY(-50%)',
              width: '44%', height: '55%',
              fontSize: 'clamp(10px, 1.3vw, 16px)',
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
          {/* DONE! click area — overlaid over the right green button (52–98% of width) */}
          <div
            role="button"
            onClick={handleDone}
            style={{
              position: 'absolute',
              left: '52%', top: '15%',
              width: '46%', height: '70%',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(10px, 1.3vw, 16px)',
              color: '#ffffff',
              userSelect: 'none',
            }}
          >
            DONE!
          </div>
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
            <Image src="/RectangleGameScore.png" alt="" width={700} height={400}
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 16 }} />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center',
              padding: '5% 8% 7%',
              gap: '6%',
            }}>
              <Image src="/GameScore.svg" alt="GAME SCORE" width={400} height={80}
                style={{ width: '70%', height: 'auto', flexShrink: 0 }} />
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
                  <span style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 'clamp(10px, 1.4vw, 16px)',
                    color: '#FEEF2C',
                    WebkitTextStroke: '1.5px #000',
                    textShadow: '2px 2px 0 #000',
                  }}>{playerName}</span>
                  <span style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 'clamp(8px, 1.1vw, 13px)',
                    color: '#FEEF2C',
                    WebkitTextStroke: '1px #000',
                    textShadow: '2px 2px 0 #000',
                  }}>{playerHospital}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(18px, 2.5vw, 32px)', color: '#fff' }}>60</span>
                    <span style={{ fontSize: 'clamp(18px, 2.5vw, 32px)' }}>⭐</span>
                  </div>
                </div>
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

      {/* ── ROUND RESULT POPUP ── */}
      {showRoundResult && (
        <div className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div style={{ position: 'relative', width: 'clamp(300px, 55vw, 810px)' }}>
            <Image src="/Round Result.svg" alt="Round Result" width={810} height={338}
              style={{ width: '100%', height: 'auto', display: 'block' }} />
            {/* Three columns overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'row',
              alignItems: 'center', justifyContent: 'space-around',
              padding: '8% 5%',
            }}>
              {/* Doctor column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Image src="/DoctorGame.svg" alt="Doctor" width={48} height={48}
                  style={{ width: 48, height: 48, borderRadius: 6, border: '2px solid #f8d20b' }} />
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'clamp(8px, 1vw, 12px)',
                  color: '#fff',
                }}>{playerName}</span>
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'clamp(18px, 3vw, 40px)',
                  color: '#F2DF00',
                  textShadow: '3px 3px 0 #000',
                }}>{currentGuess || '—'}</span>
              </div>

              {/* Center column: real FFR */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'clamp(8px, 1vw, 12px)',
                  color: '#fff',
                }}>FFR result</span>
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'clamp(18px, 3vw, 40px)',
                  color: '#ffffff',
                  textShadow: '3px 3px 0 #000',
                }}>0.85</span>
              </div>

              {/* Robot column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Image src="/RobotGame.svg" alt="Robot" width={48} height={48}
                  style={{ width: 48, height: 48, borderRadius: 6, border: '2px solid #00e5ff' }} />
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'clamp(8px, 1vw, 12px)',
                  color: '#fff',
                }}>AutocathFFR</span>
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'clamp(18px, 3vw, 40px)',
                  color: '#F2DF00',
                  textShadow: '3px 3px 0 #000',
                }}>0.86</span>
              </div>
            </div>
          </div>

          {/* XP animations — shown 1s after round result */}
          {showXP && (
            <>
              {/* Left XP */}
              <div style={{
                position: 'absolute',
                left: '12vw',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                animation: 'xpFloat 2s ease-out forwards',
              }}>
                <Image src="/XP Doctor.svg" alt="XP Doctor" width={148} height={78}
                  style={{ width: 'clamp(80px, 10vw, 148px)', height: 'auto' }} />
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'clamp(16px, 2vw, 28px)',
                  color: '#F2DF00',
                  textShadow: '3px 3px 0 #000',
                  marginTop: -8,
                }}>+16</span>
              </div>

              {/* Right XP */}
              <div style={{
                position: 'absolute',
                right: '12vw',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                animation: 'xpFloat 2s ease-out forwards',
              }}>
                <Image src="/XP Robot.svg" alt="XP Robot" width={148} height={78}
                  style={{ width: 'clamp(80px, 10vw, 148px)', height: 'auto' }} />
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'clamp(16px, 2vw, 28px)',
                  color: '#F2DF00',
                  textShadow: '3px 3px 0 #000',
                  marginTop: -8,
                }}>+16</span>
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
            <Image src="/Next Round.svg" alt="Next Round" width={392} height={100}
              style={{ width: 'clamp(240px, 30vw, 392px)', height: 'auto', display: 'block' }} />
            <span style={{
              position: 'absolute',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(10px, 1.4vw, 18px)',
              color: '#ffffff',
              WebkitTextStroke: '1px #000',
              textShadow: '2px 2px 0 #000',
              lineHeight: 1,
              pointerEvents: 'none',
            }}>NEXT ROUND {round + 1}</span>
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
        @keyframes xpFloat {
          0%   { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-60px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
