'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import BackgroundPattern from './components/BackgroundPattern'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [hospital, setHospital] = useState('')
  const [loading, setLoading] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
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
    <div className="bg-m-pattern w-screen h-screen relative flex flex-col items-center overflow-hidden select-none">
      <Image src="/m_background.svg" alt="" fill style={{ objectFit: 'cover', zIndex: 0 }} priority />

      {/* Title */}
      <div className="relative z-10 mt-6 flex-shrink-0 flex justify-center">
        <Image src="/ManVsMachine.svg" alt="MAN vs MACHINE" width={581} height={112}
          style={{ width: 'clamp(280px, 42vw, 620px)', height: 'auto' }} priority />
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

        {/* Login Card + START button + Tutorial button */}
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

          {/* START button — uses Start button.svg */}
          <div
            role="button"
            tabIndex={0}
            onClick={canStart ? handleStart : undefined}
            onKeyDown={e => e.key === 'Enter' && canStart && handleStart()}
            style={{
              cursor: canStart ? 'pointer' : 'default',
              position: 'relative', zIndex: 20,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Start button.svg"
              alt={loading ? 'LOADING...' : 'START'}
              style={{ width: 'clamp(120px, 13vw, 180px)', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Tutorial button — smaller than START */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowTutorial(true)}
            onKeyDown={e => e.key === 'Enter' && setShowTutorial(true)}
            style={{ cursor: 'pointer', position: 'relative', zIndex: 20 }}
          >
            <Image
              src="/Tutorial button.png"
              alt="Tutorial"
              width={220}
              height={56}
              style={{ width: 'clamp(90px, 10vw, 140px)', height: 'auto' }}
            />
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

      {/* Tutorial Modal */}
      {showTutorial && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={() => setShowTutorial(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0a0a3e',
              border: '4px solid #3a3aae',
              borderRadius: 16,
              padding: '40px 36px 36px',
              maxWidth: 520,
              width: '90vw',
              position: 'relative',
              boxShadow: '0 8px 48px rgba(0,0,0,0.7)',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowTutorial(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 16,
                background: '#00cc44',
                border: '3px solid #005c1e',
                borderRadius: 8,
                color: '#fff',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 16,
                width: 36,
                height: 36,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              ×
            </button>

            <p style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(9px, 1.0vw, 12px)',
              color: '#F2DF00',
              lineHeight: 2.2,
              margin: 0,
              textAlign: 'center',
            }}>
              Welcome to Man vs Machine!{'\n'}
              Compete against AutocathFFR AI.{'\n'}
              An angiogram video and frame will be shown.{'\n'}
              Enter your FFR value and press DONE!{'\n'}
              Beat the AI in 90 seconds!
            </p>
            <hr style={{ border: '1px solid #3a3aae', margin: '20px 0' }} />
            <p style={{
              fontFamily: 'sans-serif',
              fontSize: 'clamp(11px, 1.1vw, 14px)',
              color: '#aab4ff',
              lineHeight: 2,
              margin: 0,
              textAlign: 'center',
            }}>
              Man vs Machineへようこそ！<br />
              AutocathFFR AIと競い合います。<br />
              冠動脈造影動画とフレームが表示されます。<br />
              FFR値を入力してDONE!を押して送信。<br />
              90秒でAIを倒してみよう！
            </p>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
