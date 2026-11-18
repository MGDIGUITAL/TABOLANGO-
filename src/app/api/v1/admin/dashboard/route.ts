import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const bookings = db.getBookings()
    const blockedDates = db.getBlockedDates()
    const settings = db.getSettings()

    const totalBookings = bookings.length
    const confirmedBookings = bookings.filter(
      (b) => b.status === 'confirmed' || b.status === 'checked_in'
    ).length
    const pendingDeposits = bookings.filter((b) => b.status === 'pending_deposit').length

    // Revenue calculations
    const totalCollected = bookings.reduce((acc, b) => {
      let sum = 0
      if (b.depositPaid) sum += b.depositRequired
      if (b.balancePaid) sum += b.totalAmount - b.depositRequired
      return acc + sum
    }, 0)

    const projectedRevenue = bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((acc, b) => acc + b.totalAmount, 0)

    const pendingBalanceToCollect = bookings
      .filter((b) => b.status === 'confirmed' && !b.balancePaid)
      .reduce((acc, b) => acc + (b.totalAmount - b.depositRequired), 0)

    // Today's date in Chile time YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0]
    const arrivalsToday = bookings.filter(
      (b) => b.checkInDate === today && (b.status === 'confirmed' || b.status === 'checked_in')
    )
    const departuresToday = bookings.filter((b) => b.checkOutDate === today)

    // Upcoming next 7 days
    const next7Days = new Date()
    next7Days.setDate(next7Days.getDate() + 7)
    const next7DaysStr = next7Days.toISOString().split('T')[0]

    const upcomingBookings = bookings
      .filter(
        (b) =>
          b.checkInDate >= today &&
          b.checkInDate <= next7DaysStr &&
          b.status !== 'cancelled'
      )
      .sort((a, b) => a.checkInDate.localeCompare(b.checkInDate))

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalBookings,
          confirmedBookings,
          pendingDeposits,
          totalCollected,
          projectedRevenue,
          pendingBalanceToCollect,
          arrivalsTodayCount: arrivalsToday.length,
          departuresTodayCount: departuresToday.length,
          blockedDatesCount: blockedDates.length,
        },
        arrivalsToday,
        upcomingBookings,
        settings,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al generar métricas del panel' },
      { status: 500 }
    )
  }
}
