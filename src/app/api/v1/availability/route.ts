import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const occupied = db.getOccupiedDates()
    return NextResponse.json({
      success: true,
      data: occupied,
      count: occupied.length,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al consultar disponibilidad' },
      { status: 500 }
    )
  }
}
