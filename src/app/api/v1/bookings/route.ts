import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { computeBookingQuote } from '@/lib/pricing'
import { Booking } from '@/types/saas'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    let bookings = db.getBookings()

    if (status) {
      bookings = bookings.filter((b) => b.status === status)
    }

    return NextResponse.json({
      success: true,
      data: bookings,
      total: bookings.length,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener reservas' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      clientName,
      clientEmail,
      clientPhone,
      clientRut,
      checkInDate,
      checkOutDate,
      guestsCount,
      eventType,
      includeHotTub,
      extraHours,
      notes,
    } = body

    if (!clientName || !clientEmail || !clientPhone || !checkInDate || !checkOutDate) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios para generar la reserva' },
        { status: 400 }
      )
    }

    // Check availability
    const occupied = db.getOccupiedDates()
    const start = new Date(checkInDate + 'T00:00:00')
    const end = new Date(checkOutDate + 'T00:00:00')
    const cur = new Date(start)

    while (cur < end) {
      const dateStr = cur.toISOString().split('T')[0]
      const isOccupied = occupied.some((o) => o.date === dateStr)
      if (isOccupied) {
        return NextResponse.json(
          {
            success: false,
            error: `La fecha ${dateStr} ya se encuentra reservada o no disponible.`,
          },
          { status: 409 }
        )
      }
      cur.setDate(cur.getDate() + 1)
    }

    // Compute pricing
    const settings = db.getSettings()
    const quote = computeBookingQuote({
      checkInDate,
      checkOutDate,
      guestsCount: Number(guestsCount) || 1,
      includeHotTub: Boolean(includeHotTub),
      extraHours: Number(extraHours) || 0,
      settings,
    })

    if (quote.nightsCount <= 0) {
      return NextResponse.json(
        { success: false, error: 'La fecha de salida debe ser posterior a la de llegada' },
        { status: 400 }
      )
    }

    // Generate unique human-friendly Booking ID e.g. TAB-2026-7842
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const bookingId = `TAB-2026-${randomSuffix}`

    const newBooking: Booking = {
      id: bookingId,
      clientName,
      clientEmail,
      clientPhone,
      clientRut: clientRut || '',
      checkInDate,
      checkOutDate,
      nightsCount: quote.nightsCount,
      guestsCount: Number(guestsCount) || 1,
      extraGuests: quote.extraGuests,
      eventType: eventType || 'Descanso familiar',
      includeHotTub: Boolean(includeHotTub),
      extraHours: quote.extraHours,
      ratePerNight: quote.ratePerNight,
      totalAmount: quote.totalAmount,
      depositRequired: quote.depositRequired,
      depositPaid: false,
      balancePaid: false,
      guaranteeAmount: quote.guaranteeAmount,
      guaranteeStatus: 'pending',
      status: 'pending_deposit',
      vehiclesCount: Number(body.vehiclesCount) || 1,
      vehiclePlates: Array.isArray(body.vehiclePlates)
        ? body.vehiclePlates
        : body.vehiclePlate
        ? [body.vehiclePlate]
        : [],
      notes: notes || '',
      createdAt: new Date().toISOString(),
    }

    const created = db.createBooking(newBooking)

    return NextResponse.json({
      success: true,
      message: 'Reserva generada exitosamente. Se requiere abonar el 50% para confirmarla.',
      data: created,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error interno al procesar la reserva' },
      { status: 500 }
    )
  }
}
