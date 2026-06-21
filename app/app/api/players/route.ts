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
