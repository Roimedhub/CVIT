import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(req: NextRequest) {
  const { name, hospital } = await req.json()

  if (!name || !hospital) {
    return NextResponse.json({ error: 'Name and hospital are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('cvit_players')
    .insert({ name, hospital })
    .select('id, name, hospital')
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: 'Failed to save player' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE() {
  const { error } = await supabase
    .from('cvit_players')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // delete all rows

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: 'Failed to reset leaderboard' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const { id, xp } = await req.json()

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('cvit_players')
    .update({ xp })
    .eq('id', id)

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: 'Failed to update XP' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
