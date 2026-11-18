import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const blocks = db.getBlockedDates()
    return NextResponse.json({ success: true, data: blocks })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener fechas bloqueadas' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { date, reason } = body

    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Se requiere especificar la fecha' },
        { status: 400 }
      )
    }

    const newBlock = db.addBlockedDate({
      date,
      reason: reason || 'Bloqueado',
    })

    return NextResponse.json({ success: true, data: newBlock })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al bloquear fecha' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Se requiere ID del bloqueo' },
        { status: 400 }
      )
    }

    const removed = db.removeBlockedDate(id)
    return NextResponse.json({ success: removed })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al desbloquear fecha' },
      { status: 500 }
    )
  }
}
