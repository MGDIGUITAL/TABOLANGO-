'use server'

import { createAdminClient } from '@supabase/server/core'

export interface CotizacionData {
  nombre: string
  telefono: string
  correo: string
  fecha_evento: string
  cantidad_personas: number
  tipo_evento: string
  mensaje: string
}

export async function enviarCotizacion(data: CotizacionData) {
  const supabaseAdmin = createAdminClient({
    env: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      secretKeys: {
        default: process.env.SUPABASE_SECRET_KEY ?? '',
      },
    },
  })

  const row = {
    ...data,
    created_at: new Date().toISOString(),
  }

  // eslint-disable-next-line -- untyped supabase client returns `never` for unknown tables
  const { error } = await (supabaseAdmin
    .from('cotizaciones') as unknown as { insert: (rows: Record<string, unknown>[]) => Promise<{ error: { message: string } | null }> })
    .insert([row])

  if (error) {
    return { success: false as const, error: error.message }
  }

  return { success: true as const }
}
