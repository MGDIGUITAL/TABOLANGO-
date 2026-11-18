import { NextResponse } from 'next/server'

// Max content length per message to prevent token abuse
const MAX_MESSAGE_LENGTH = 2000

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY

    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }

    const body = await request.json()
    const { messages } = body

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return NextResponse.json({ error: 'Invalid messages array structure' }, { status: 400 })
    }

    for (const msg of messages) {
      if (!msg || typeof msg !== 'object' || typeof msg.role !== 'string' || typeof msg.content !== 'string') {
        return NextResponse.json({ error: 'Invalid message object format' }, { status: 400 })
      }
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        msg.content = msg.content.slice(0, MAX_MESSAGE_LENGTH)
      }
    }

    // Fallback if no API key configured
    if (!apiKey) {
      return NextResponse.json({ useFallback: true }, { status: 200 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: `Eres Constanza, la anfitriona virtual de Quincho Tabolango (Kilómetro 9, Tabolango, Limache, Chile). Tu personalidad es muy educada, amable, atenta, profesional y transparente. Conoces perfectamente los valores y el reglamento del recinto.

UBICACION:
- Kilómetro 9, Tabolango, Limache, Región de Valparaíso, Chile.
- Entorno rural con estacionamiento privado dentro del recinto y control de acceso vehicular.

TARIFAS Y HORARIOS OFICIALES DE QUINCHO TABOLANGO:
- Arriendo Jornada Diurna (09:00 a 19:00 hrs): $120.000 (Capacidad base: hasta 50 personas).
- Arriendo Jornada Nocturna (20:00 a 02:00 hrs): $160.000.
- Hora Adicional (Diurna o Nocturna): $15.000 / hr.
- Persona Adicional (sobre 50 personas): $5.000 p/p.
- Uso de Tinaja de Agua Caliente: $35.000 (sesión de 3 hrs) o $50.000 (5 hrs continuas).
- Garantía de Limpieza / Seguridad (reembolsable): $30.000 (se devuelve si se entrega limpio y sin daños).
- Saco de Leña: $10.000.
- Check-in (Ingreso): 14:00 hrs | Check-out (Salida): 12:00 hrs (Mediodía).
- Ingreso anticipado o salida tarde: sujetos a disponibilidad, coordinar con anticipación.

REGLAS Y CONDICIONES DEL RECINTO (MUY IMPORTANTE):
1. RESERVAS: Deben realizarse con antelación y requieren un pago inicial para confirmar. Cancelaciones con menos de 7 días de anticipación no serán reembolsadas.
2. EQUIPO DE MÚSICA: Está ESTRICTAMENTE PROHIBIDO el ingreso y uso de equipos de música externos, parlantes portátiles, sistemas de sonido y amplificadores. Solo se permite el uso del sistema de sonido interno pre-instalado a volumen moderado.
3. MANEJO DE RESIDUOS: Los usuarios son responsables de recolectar y depositar todos los residuos generados en los contenedores designados. El quincho debe dejarse limpio y ordenado, libre de basura.
4. DEPÓSITO DE SEGURIDAD: Se requiere un depósito reembolsable ($30.000) antes del uso de las instalaciones. El depósito será retenido si se detectan daños a la propiedad o incumplimiento de las normas de limpieza.

TONO Y OBJETIVO:
- Responde siempre de forma muy educada, clara y servicial.
- Ante dudas de normas de música o basura, acláralas de forma amable explicando que es para cuidar la tranquilidad del entorno.
- Redirige a cotizar o agendar fecha por WhatsApp: https://wa.me/56912345678
- Mantén respuestas breves, ejecutivas y amables (2 a 4 líneas).`,
        messages,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ useFallback: true }, { status: 200 })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text ?? 'Lo siento, no pude procesar tu consulta. ¿Deseas consultar por WhatsApp?'

    return NextResponse.json({ reply: text }, { status: 200 })
  } catch (err) {
    console.error('Error in /api/constanza:', err)
    return NextResponse.json({ useFallback: true }, { status: 200 })
  }
}
