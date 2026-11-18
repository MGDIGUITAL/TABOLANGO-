import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]
    const bookings = db.getBookings()

    // Find bookings that are arriving today or currently staying
    const todaysBookings = bookings.filter((b) => {
      const isArrivingToday = b.checkInDate === today
      const isStayingToday = b.checkInDate <= today && b.checkOutDate >= today
      return (isArrivingToday || isStayingToday) && b.status !== 'cancelled'
    })

    const authorizedPlates = todaysBookings
      .filter((b) => b.checkin?.vehiclePlate)
      .map((b) => ({
        plate: b.checkin?.vehiclePlate,
        clientName: b.clientName,
        bookingId: b.id,
        checkInDate: b.checkInDate,
        checkOutDate: b.checkOutDate,
        estimatedArrival: b.checkin?.estimatedArrival,
        guestsCount: b.guestsCount,
        status: b.status,
      }))

    return NextResponse.json({
      success: true,
      date: today,
      count: todaysBookings.length,
      bookings: todaysBookings,
      authorizedPlates,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al consultar ingresos de hoy' },
      { status: 500 }
    )
  }
}
