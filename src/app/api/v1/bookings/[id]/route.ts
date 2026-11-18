import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const booking = db.getBookingById(id)

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: booking,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al consultar la reserva' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates = await req.json()

    // Validate that the booking exists
    const existing = db.getBookingById(id)
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    // Handle special payment timestamps
    if (updates.depositPaid === true && !existing.depositPaid) {
      updates.depositPaidAt = new Date().toISOString()
      if (existing.status === 'pending_deposit') {
        updates.status = 'confirmed'
      }
    }
    if (updates.balancePaid === true && !existing.balancePaid) {
      updates.balancePaidAt = new Date().toISOString()
    }

    const updated = db.updateBooking(id, updates)

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la reserva' },
      { status: 500 }
    )
  }
}
