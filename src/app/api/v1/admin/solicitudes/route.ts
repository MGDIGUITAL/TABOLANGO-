import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SolicitudEstado } from '@/types/saas'

export async function GET() {
  try {
    const solicitudes = db.getSolicitudes()
    const nuevas = solicitudes.filter(s => s.estado === 'nueva').length
    const contactadas = solicitudes.filter(s => s.estado === 'contactado').length
    const cotizadas = solicitudes.filter(s => s.estado === 'cotizado').length
    const convertidas = solicitudes.filter(s => s.estado === 'convertida').length

    return NextResponse.json({
      success: true,
      data: solicitudes,
      stats: {
        total: solicitudes.length,
        nuevas,
        contactadas,
        cotizadas,
        convertidas,
        conversionRate: solicitudes.length > 0 ? Math.round((convertidas / solicitudes.length) * 100) : 0,
      },
    })
  } catch (error) {
    console.error('Error in GET /api/v1/admin/solicitudes:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener solicitudes' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, estado, notasInternas, presupuestoEstimado } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de solicitud requerido' },
        { status: 400 }
      )
    }

    const updated = db.updateSolicitud(id, {
      ...(estado && { estado: estado as SolicitudEstado }),
      ...(notasInternas !== undefined && { notasInternas }),
      ...(presupuestoEstimado !== undefined && { presupuestoEstimado: Number(presupuestoEstimado) }),
    })

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Solicitud no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Solicitud actualizada correctamente',
      data: updated,
    })
  } catch (error) {
    console.error('Error in PATCH /api/v1/admin/solicitudes:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar solicitud' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de solicitud requerido' },
        { status: 400 }
      )
    }

    const deleted = db.deleteSolicitud(id)
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Solicitud no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Solicitud eliminada correctamente',
    })
  } catch (error) {
    console.error('Error in DELETE /api/v1/admin/solicitudes:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar solicitud' },
      { status: 500 }
    )
  }
}
