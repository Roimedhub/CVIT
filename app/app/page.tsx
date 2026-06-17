'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import BackgroundPattern from './components/BackgroundPattern'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [hospital, setHospital] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleStart = async () => {
    if (!name.trim() || !hospital.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), hospital: hospital.trim() }),
      })
      const data = await res.json()
      if (data.id) {
        sessionStorage.setItem('playerId', data.id)
        sessionStorage.setItem('playerName', name.trim())
        sessionStorage.setItem('playerHospital', hospital.trim())
        router.push('/game')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const canStart = name.trim() && hospital.trim() && !loading

  return (
    <>
    <style>{`
      #start-btn {
        background-color: #00FF99 !important;
        background-image: none !important;
        color: #001a0d !important;
        border: 4px solid #005c2e !important;
        box-shadow: 0 5px 0 #005c2e !important;
        border-radius: 10px !important;
        padding: 14px 60px !important;
        font-family: 'Press Start 2P', monospace !important;
        font-size: clamp(12px, 1.4vw, 18px) !important;
        cursor: pointer !important;
        display: inline-block !important;
        user-select: none !important;
        position: relative !important;
        z-index: 20 !important;
      }
      #start-btn:hover { background-color: #33FFAA !important; }
      #start-btn:active { transform: translateY(4px); box-shadow: 0 1px 0 #005c2e !important; }
      #start-btn.disabled { background-color: #00FF99 !important; cursor: default !important; }
    `}</style>
    <div className="bg-m-pattern w-screen h-screen relative flex flex-col items-center overflow-hidden select-none">
      <BackgroundPattern />

      {/* Title */}
      <div className="relative z-10 mt-6 flex-shrink-0">
        <h1
          className="font-pixel title-gradient tracking-wide"
          style={{ WebkitTextStroke: '2px #7a0000', fontSize: 'clamp(28px, 4.5vw, 64px)' }}
        >
          MAN vs MACHINE
        </h1>
      </div>

      {/* Main content — centered vertically in space above floor */}
      <div
        className="flex-1 flex items-center justify-center w-full relative z-10 px-4"
        style={{ paddingBottom: '18vh' }}
      >
        {/* Doctor */}
        <div className="flex-1 flex items-center justify-center" style={{ maxWidth: 340 }}>
          <Image
            src="/doctor.png"
            alt="Doctor"
            width={300}
            height={450}
            className="object-contain drop-shadow-2xl"
            style={{ imageRendering: 'pixelated', maxHeight: '55vh', transform: 'scaleX(-1)' }}
            priority
          />
        </div>

        {/* Login Card + START button */}
        <div className="flex-shrink-0 flex flex-col items-center gap-4" style={{ width: 'clamp(300px, 28vw, 420px)' }}>
          <div
            className="w-full flex flex-col rounded-2xl p-5"
            style={{
              background: '#5858cc',
              border: '4px solid #7878e0',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <div
              className="rounded-xl p-5 flex flex-col gap-5"
              style={{ background: '#F8D20B', border: '3px solid #D4A800' }}
            >
              <div className="flex flex-col gap-2">
                <label className="font-pixel text-xs text-gray-800">Name</label>
                <input
                  className="game-input rounded px-3 py-3 w-full"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleStart()}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-pixel text-xs text-gray-800">Hospital</label>
                <input
                  className="game-input rounded px-3 py-3 w-full"
                  type="text"
                  value={hospital}
                  onChange={e => setHospital(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleStart()}
                />
              </div>
            </div>
          </div>

          {/* START button */}
          <div
            id="start-btn"
            role="button"
            tabIndex={0}
            onClick={canStart ? handleStart : undefined}
            onKeyDown={e => e.key === 'Enter' && canStart && handleStart()}
            className={!canStart ? 'disabled' : ''}
          >
            {loading ? 'LOADING...' : 'START'}
          </div>
        </div>

        {/* Robot — animated sprite */}
        <div className="flex-1 flex items-center justify-center" style={{ maxWidth: 340 }}>
          <div style={{ overflow: 'hidden', width: 220, height: 400, clipPath: 'inset(0 0 0 6px)' }}>
            <div className="robot-sprite drop-shadow-2xl" />
          </div>
        </div>
      </div>

      {/* Floor — taller so feet land on it, logo centered inside */}
      <div
        className="floor-gradient absolute bottom-0 left-0 right-0 z-0 flex items-center justify-center"
        style={{ height: '18vh' }}
      >
        <Image
          src="/medhub-logo.png"
          alt="MedHub.AI"
          width={220}
          height={60}
          className="object-contain"
        />
      </div>
    </div>
    </>
  )
}
