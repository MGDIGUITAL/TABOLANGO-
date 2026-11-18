import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const GEMINI_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash']

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Mensaje requerido' },
        { status: 400 }
      )
    }

    const bookings = db.getBookings()
    const transactions = db.getCashTransactions()
    const clients = db.getClients()

    // Build real business context
    const bookingsSummary = bookings
      .slice(0, 10)
      .map(
        (b) =>
          `- ${b.id}: ${b.clientName} (${b.checkInDate} al ${b.checkOutDate}), ${b.guestsCount} pers, Tinaja: ${b.includeHotTub ? 'SÍ' : 'NO'}, Estado: ${b.status}, Patente: ${b.vehiclePlate || 'Pendiente'}`
      )
      .join('\n')

    let totalIncome = 0
    let totalExpense = 0
    let guaranteeCustody = 0
    for (const tx of transactions) {
      if (tx.type === 'ingreso') totalIncome += tx.amount
      else if (tx.type === 'gasto') totalExpense += Math.abs(tx.amount)
      else if (tx.type === 'garantia_recibida') guaranteeCustody += tx.amount
      else if (tx.type === 'garantia_devuelta') guaranteeCustody -= Math.abs(tx.amount)
    }

    const systemPrompt = `Eres "Copiloto Tabolango", el asistente de inteligencia artificial administrativo oficial de Quincho Tabolango (Limache, Región de Valparaíso, Chile).
Tu función es asistir al administrador del recinto con consultas sobre ocupación, finanzas, inventario, mantenciones, clima del valle y recomendaciones de gestión de eventos.

INFORMACIÓN EN VIVO DEL NEGOCIO:
- Ubicación: Km 9, Tabolango, Limache, Región de Valparaíso, Chile.
- Instalaciones: Quincho rústico techado, piscina con reja perimetral, tinaja de agua caliente con leña de eucalipto, camas elásticas, áreas verdes, zona de asados y estacionamiento interior para hasta 12 vehículos.
- Capacidad estándar: 8 a 10 personas (con opción de hasta 10 huéspedes).
- Horarios oficiales: Check-in 14:00 hrs, Check-out 12:00 hrs. Portón cerrado a las 23:00 hrs.
- Garantía obligatoria por llaves y cuidado del recinto: $30.000 (reembolsable tras inspección de salida).
- Zonas de inspección de check-in (7 zonas): Piezas/Dormitorios, Baños & Agua Caliente, Cocina & Vajilla, Comedor & Mobiliario, Piscina & Rejas, Tinaja & Leña lista, Camas Elásticas & Mallas.

ESTADO FINANCIERO ACTUAL:
- Balance Disponible en Caja: $${(totalIncome - totalExpense).toLocaleString('es-CL')}
- Total Ingresos Registrados: +$${totalIncome.toLocaleString('es-CL')}
- Total Gastos Insumos: -$${totalExpense.toLocaleString('es-CL')}
- Garantías en Custodia: $${guaranteeCustody.toLocaleString('es-CL')}
- Clientes Registrados: ${clients.length}

RESERVAS EN SISTEMA:
${bookingsSummary}

DIRECTRICES:
- Responde siempre en español, de forma muy profesional, clara, directa y estructurada.
- Usa formato markdown (viñetas, negritas) para que sea cómodo de leer en el panel.
- Si te preguntan quién llega hoy o el fin de semana, cita los nombres de los clientes, fechas, tinaja y patentes de vehículos registrados.
- Mantén un tono cordial, proactivo y enfocado en la excelencia de servicio turístico rural de Limache.`

    let lastError = null

    for (const model of GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: [
              ...(Array.isArray(history)
                ? history.map((h: any) => ({
                    role: h.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: h.content }],
                  }))
                : []),
              {
                role: 'user',
                parts: [{ text: message }],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 1024,
            },
          }),
        })

        if (res.ok) {
          const data = await res.json()
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (reply) {
            return NextResponse.json({ success: true, reply, modelUsed: model })
          }
        } else {
          const errData = await res.text()
          lastError = `${res.status}: ${errData}`
        }
      } catch (err: any) {
        lastError = err.message
      }
    }

    return NextResponse.json(
      { success: false, error: 'No se pudo conectar con Gemini AI', details: lastError },
      { status: 502 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error interno en el servidor de IA' },
      { status: 500 }
    )
  }
}
