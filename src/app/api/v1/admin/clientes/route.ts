import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Client } from '@/types/saas'

export async function GET() {
  try {
    const clients = db.getClients()
    return NextResponse.json({ success: true, data: clients })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener clientes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, rut, phone, email, notes } = body

    if (!name || !rut || !phone) {
      return NextResponse.json(
        { success: false, error: 'Nombre, RUT y teléfono son obligatorios' },
        { status: 400 }
      )
    }

    const client: Client = {
      id: `CLI-${Date.now().toString().slice(-4)}`,
      name,
      rut,
      phone,
      email: email || '',
      totalVisits: 1,
      totalSpent: 0,
      lastBookingDate: new Date().toISOString().split('T')[0],
      notes,
    }

    const saved = db.addOrUpdateClient(client)
    return NextResponse.json({ success: true, data: saved })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al registrar cliente' },
      { status: 500 }
    )
  }
}
