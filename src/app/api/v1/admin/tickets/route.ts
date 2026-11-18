import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const bookingId = searchParams.get('bookingId')

    if (bookingId) {
      const booking = db.getBookingById(bookingId)
      return NextResponse.json({
        success: true,
        data: booking?.tickets || [],
      })
    }

    const tickets = db.getAllTickets()
    return NextResponse.json({
      success: true,
      data: tickets,
      count: tickets.length,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener tickets' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bookingId, type, operatorName, items, generalNotes, guaranteeRefunded, guaranteeDiscount } = body

    if (!bookingId || !type) {
      return NextResponse.json(
        { success: false, error: 'Se requiere bookingId y tipo de ticket' },
        { status: 400 }
      )
    }

    // Determine status: if any item is 'issue' -> 'con_observaciones', else 'aprobado'
    const hasIssues = items?.some((it: any) => it.status === 'issue')
    const status = hasIssues ? 'con_observaciones' : 'aprobado'

    const ticket = {
      id: `TCK-${Date.now().toString().slice(-6)}`,
      bookingId,
      type,
      title:
        type === 'mantenimiento_previo'
          ? 'Check-in Mantenimiento & Preparación'
          : type === 'recepcion_ingreso'
          ? 'Check-in Recepción de Pasajeros'
          : 'Check-out & Entrega del Quincho',
      operatorName: operatorName || 'Operador Quincho',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      status,
      items: items || [],
      generalNotes: generalNotes || '',
      guaranteeRefunded: Boolean(guaranteeRefunded),
      guaranteeDiscount: Number(guaranteeDiscount) || 0,
    }

    const updatedBooking = db.saveTicket(bookingId, ticket)

    return NextResponse.json({
      success: true,
      data: ticket,
      booking: updatedBooking,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al guardar el ticket de inspección' },
      { status: 500 }
    )
  }
}
