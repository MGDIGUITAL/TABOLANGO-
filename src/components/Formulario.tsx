'use client'

import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { enviarCotizacion } from '@/app/actions/cotizacion'
import type { CotizacionData } from '@/app/actions/cotizacion'
import styles from './Formulario.module.css'
import ScrollReveal from './ScrollReveal'

const TIPOS_EVENTO = [
  'Cumpleaños',
  'Aniversario',
  'Reunión familiar',
  'Evento corporativo',
  'Otro',
] as const

const WHATSAPP_NUMBER = '56912345678'

function buildWhatsAppUrl(data: CotizacionData): string {
  const message = encodeURIComponent(
    `Hola, quiero cotizar un evento en Quincho Tabolango.\n\n` +
      `📋 *Datos del evento:*\n` +
      `• Nombre: ${data.nombre}\n` +
      `• Teléfono: ${data.telefono}\n` +
      `• Correo: ${data.correo}\n` +
      `• Fecha: ${data.fecha_evento}\n` +
      `• Personas: ${data.cantidad_personas}\n` +
      `• Tipo: ${data.tipo_evento}\n` +
      (data.mensaje ? `• Mensaje: ${data.mensaje}\n` : '')
  )
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}

export default function Formulario() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [ticketId, setTicketId] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    const formData = new FormData(e.currentTarget)
    const data: CotizacionData = {
      nombre: formData.get('nombre') as string,
      telefono: formData.get('telefono') as string,
      correo: formData.get('correo') as string,
      fecha_evento: formData.get('fecha_evento') as string,
      cantidad_personas: Number(formData.get('cantidad_personas')),
      tipo_evento: formData.get('tipo_evento') as string,
      mensaje: (formData.get('mensaje') as string) || '',
    }

    try {
      // 1. Guardar en el sistema SaaS unificado
      const res = await fetch('/api/v1/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.nombre,
          telefono: data.telefono,
          correo: data.correo,
          fechaEvento: data.fecha_evento,
          personas: data.cantidad_personas,
          tipoEvento: data.tipo_evento,
          mensaje: data.mensaje,
          origen: 'formulario_web',
        }),
      })

      const json = await res.json()
      if (json.success) {
        setTicketId(json.data?.id || 'SOL-2026')
        setSubmitStatus('success')
        // Opcional: abre WhatsApp con mensaje pre-armado
        setTimeout(() => {
          window.open(buildWhatsAppUrl(data), '_blank')
        }, 800)
      } else {
        // Fallback a action legacy si fuese necesario
        const result = await enviarCotizacion(data)
        if (result.success) {
          setSubmitStatus('success')
          window.open(buildWhatsAppUrl(data), '_blank')
        } else {
          setSubmitStatus('error')
        }
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={`section ${styles.section}`} id="contacto">
      <div className={`section-container ${styles.container}`}>
        <ScrollReveal>
          <div className={styles.header}>
            <span className="section-label">Reserva</span>
            <h2 className={styles.title}>Comienza tu historia</h2>
            <p className={styles.subtitle}>
              Déjanos tus datos y nos pondremos en contacto para organizar cada detalle.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.form} id="cotizacion-form">
            <div className={styles.formGrid}>
              <div className="form-group">
                <label htmlFor="nombre" className="form-label">Nombre completo</label>
                <input type="text" id="nombre" name="nombre" required className="form-input" />
              </div>

              <div className="form-group">
                <label htmlFor="telefono" className="form-label">Teléfono</label>
                <input type="tel" id="telefono" name="telefono" required className="form-input" />
              </div>

              <div className={`form-group ${styles.fullWidth}`}>
                <label htmlFor="correo" className="form-label">Correo electrónico</label>
                <input type="email" id="correo" name="correo" required className="form-input" />
              </div>

              <div className="form-group">
                <label htmlFor="fecha_evento" className="form-label">Fecha del evento</label>
                <input type="date" id="fecha_evento" name="fecha_evento" required className="form-input" />
              </div>

              <div className="form-group">
                <label htmlFor="cantidad_personas" className="form-label">Personas</label>
                <input type="number" id="cantidad_personas" name="cantidad_personas" required min={1} max={10} className="form-input" />
              </div>

              <div className={`form-group ${styles.fullWidth}`}>
                <label htmlFor="tipo_evento" className="form-label">Tipo de evento</label>
                <select id="tipo_evento" name="tipo_evento" required className="form-input" defaultValue="">
                  <option value="" disabled>Selecciona una opción</option>
                  {TIPOS_EVENTO.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div className={`form-group ${styles.fullWidth}`}>
                <label htmlFor="mensaje" className="form-label">Mensaje adicional</label>
                <textarea id="mensaje" name="mensaje" rows={3} className="form-input" style={{ resize: 'vertical' }} />
              </div>
            </div>

            {submitStatus === 'success' && (
              <div className={styles.success}>
                ✓ ¡Solicitud {ticketId ? `#${ticketId}` : ''} registrada con éxito! Conectando con la administración...
              </div>
            )}
            {submitStatus === 'error' && (
              <div className={styles.error}>Hubo un error. Por favor intenta más tarde.</div>
            )}

            <button type="submit" disabled={isSubmitting} className={`btn btn-primary btn-lg ${styles.submitBtn}`}>
              {isSubmitting ? (
                <><Loader2 size={18} className={styles.spinner} /> Enviando</>
              ) : (
                <>Enviar solicitud <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
