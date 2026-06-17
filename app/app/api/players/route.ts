import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, hospital } = await req.json()

  if (!name || !hospital) {
    return NextResponse.json({ error: 'Name and hospital are required' }, { status: 400 })
  }

  // TODO: save to Supabase
  // For now return a mock ID
  const id = `player_${Date.now()}`
  return NextResponse.json({ id, name, hospital })
}
