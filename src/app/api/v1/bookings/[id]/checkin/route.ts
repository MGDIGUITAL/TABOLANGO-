import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { CheckInData } from '@/types/saas'

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
      data: booking.checkin || null,
      bookingStatus: booking.status,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al consultar el check-in' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { vehiclePlate, vehiclePlates, vehiclesCount, estimatedArrival, guestList, rulesAccepted, notes } = body

    const booking = db.getBookingById(id)
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    // Normalize plates array
    let plates: string[] = []
    if (Array.isArray(vehiclePlates) && vehiclePlates.length > 0) {
      plates = vehiclePlates.map((p: string) => p.trim().toUpperCase()).filter(Boolean)
    } else if (vehiclePlate) {
      plates = [vehiclePlate.trim().toUpperCase()]
    }

    if (plates.length === 0 || !estimatedArrival) {
      return NextResponse.json(
        {
          success: false,
          error: 'Debe ingresar al menos una patente de vehículo y la hora estimada de llegada.',
        },
        { status: 400 }
      )
    }

    if (!rulesAccepted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Debe aceptar las normas del recinto para completar el check-in.',
        },
        { status: 400 }
      )
    }

    const checkinData: CheckInData = {
      bookingId: booking.id,
      vehiclesCount: Number(vehiclesCount) || plates.length || 1,
      vehiclePlates: plates,
      estimatedArrival,
      guestList: Array.isArray(guestList) ? guestList : [],
      rulesAccepted: true,
      rulesAcceptedAt: new Date().toISOString(),
      checkedInAt: new Date().toISOString(),
      notes: notes || '',
    }

    const updatedBooking = db.saveCheckIn(booking.id, checkinData)

    return NextResponse.json({
      success: true,
      message: 'Check-in digital registrado con éxito. Su acceso vehicular ha sido acreditado.',
      data: updatedBooking,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al registrar el check-in' },
      { status: 500 }
    )
  }
}
