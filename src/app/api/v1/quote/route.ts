import { NextRequest, NextResponse } from 'next/server'
import { computeBookingQuote } from '@/lib/pricing'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { checkInDate, checkOutDate, guestsCount, includeHotTub, extraHours } = body

    if (!checkInDate || !checkOutDate) {
      return NextResponse.json(
        { success: false, error: 'Debes indicar fecha de llegada y salida' },
        { status: 400 }
      )
    }

    const settings = db.getSettings()
    const quote = computeBookingQuote({
      checkInDate,
      checkOutDate,
      guestsCount: Number(guestsCount) || 1,
      includeHotTub: Boolean(includeHotTub),
      extraHours: Number(extraHours) || 0,
      settings,
    })

    return NextResponse.json({
      success: true,
      data: quote,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al calcular la cotización' },
      { status: 500 }
    )
  }
}
