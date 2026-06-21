import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(req: NextRequest) {
  const { player_id, score, rounds_played } = await req.json()

  if (!player_id) {
    return NextResponse.json({ error: 'player_id is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('cvit_scores')
    .insert({ player_id, score, rounds_played })
    .select('id')
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 })
  }

  return NextResponse.json(data)
}
