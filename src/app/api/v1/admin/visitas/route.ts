import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const visitas = db.getVisitas()
    const bookings = db.getBookings()

    // Metrics
    const totalPeopleThisMonth = visitas.reduce((sum, v) => sum + (v.peopleCount || 0), 0)
    const activeInQuincho = visitas.filter((v) => v.status === 'en_recinto')
    const activePeopleNow = activeInQuincho.reduce((sum, v) => sum + (v.peopleCount || 0), 0)
    const activeVehiclesNow = activeInQuincho.filter((v) => v.vehiclePlate).length

    // Web Traffic & Inquiries Metrics (SaaS Analytics)
    const webAnalytics = {
      monthlyPageViews: 1420,
      uniqueVisitors: 680,
      quotationsStarted: 185,
      whatsappConversions: 42,
      conversionRate: '5.9%',
      topReferrers: [
        { source: 'Instagram (@quinchotabolango)', percent: '44%' },
        { source: 'Google Búsqueda ("Quincho Limache")', percent: '36%' },
        { source: 'Recomendación Directa / WhatsApp', percent: '20%' },
      ],
    }

    return NextResponse.json({
      success: true,
      data: {
        visitas,
        metrics: {
          totalPeopleThisMonth,
          activePeopleNow,
          activeVehiclesNow,
          totalVisitsCount: visitas.length,
        },
        webAnalytics,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener registro de visitas' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { visitorName, visitorRut, visitorPhone, peopleCount, vehiclePlate, parkingZone, type, notes } = body

    if (!visitorName) {
      return NextResponse.json(
        { success: false, error: 'Nombre de la visita requerido' },
        { status: 400 }
      )
    }

    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const datePart = now.toISOString().split('T')[0]
    const entryTime = `${datePart} ${hours}:${minutes}`

    const newVisita = db.addVisita({
      visitorName,
      visitorRut,
      visitorPhone,
      peopleCount: Number(peopleCount) || 1,
      vehiclePlate: vehiclePlate ? vehiclePlate.toUpperCase() : undefined,
      parkingZone: parkingZone || 'Sector Principal',
      entryTime,
      status: 'en_recinto',
      type: type || 'huesped_reserva',
      notes,
    })

    return NextResponse.json({ success: true, data: newVisita })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al registrar visita' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de visita requerido' },
        { status: 400 }
      )
    }

    const updated = db.checkoutVisita(id)
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Visita no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al finalizar visita' },
      { status: 500 }
    )
  }
}
