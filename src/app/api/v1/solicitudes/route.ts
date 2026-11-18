import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const solicitudes = db.getSolicitudes()
    return NextResponse.json({
      success: true,
      data: solicitudes,
      total: solicitudes.length,
      nuevas: solicitudes.filter(s => s.estado === 'nueva').length,
    })
  } catch (error) {
    console.error('Error fetching solicitudes:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener las solicitudes' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.nombre || !body.telefono || !body.correo) {
      return NextResponse.json(
        { success: false, error: 'Nombre, teléfono y correo electrónico son obligatorios.' },
        { status: 400 }
      )
    }

    const nuevaSolicitud = db.createSolicitud({
      nombre: body.nombre,
      telefono: body.telefono,
      correo: body.correo,
      fechaEvento: body.fechaEvento || body.fecha_evento || new Date().toISOString().split('T')[0],
      personas: Number(body.personas || body.cantidad_personas) || 10,
      tipoEvento: body.tipoEvento || body.tipo_evento || 'Cumpleaños',
      mensaje: body.mensaje || '',
      origen: body.origen || 'formulario_web',
    })

    return NextResponse.json({
      success: true,
      message: '¡Solicitud registrada con éxito en el sistema!',
      data: nuevaSolicitud,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creando solicitud de formulario:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno al registrar la solicitud' },
      { status: 500 }
    )
  }
}
