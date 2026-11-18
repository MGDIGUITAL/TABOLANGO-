'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Users,
  Flame,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Car,
  Home,
  Info,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import styles from './reservar.module.css'
import { computeBookingQuote, formatCLP } from '@/lib/pricing'
import { Booking } from '@/types/saas'
import QRCode from 'qrcode'

const EVENT_TYPES = [
  'Descanso familiar',
  'Cumpleaños familiar',
  'Aniversario',
  'Reunión de amigos tranquila',
  'Jornada corporativa de día',
  'Otro',
]

const WHATSAPP_NUMBER = '56912345678'

export default function ReservarPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [occupiedDates, setOccupiedDates] = useState<string[]>([])

  // Form State
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [guestsCount, setGuestsCount] = useState(8)
  const [includeHotTub, setIncludeHotTub] = useState(false)
  const [extraHours, setExtraHours] = useState(0)
  const [eventType, setEventType] = useState('Descanso familiar')

  // Client Data
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientRut, setClientRut] = useState('')
  const [vehiclesCount, setVehiclesCount] = useState(1)
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehiclePlate2, setVehiclePlate2] = useState('')
  const [notes, setNotes] = useState('')

  // Result
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')

  useEffect(() => {
    if (confirmedBooking?.id) {
      QRCode.toDataURL(confirmedBooking.id, {
        width: 220,
        margin: 2,
        color: { dark: '#1B4332', light: '#ffffff' },
      })
        .then(setQrDataUrl)
        .catch((e) => console.error('Error QR:', e))
    }
  }, [confirmedBooking?.id])

  // Load occupied dates on mount
  useEffect(() => {
    async function loadAvailability() {
      try {
        const res = await fetch('/api/v1/availability')
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          setOccupiedDates(data.data.map((d: { date: string }) => d.date))
        }
      } catch (err) {
        console.error('Error cargando disponibilidad:', err)
      }
    }
    loadAvailability()
  }, [])

  // Dynamic Quote calculation
  const quote = useMemo(() => {
    if (!checkInDate || !checkOutDate) return null
    return computeBookingQuote({
      checkInDate,
      checkOutDate,
      guestsCount,
      includeHotTub,
      extraHours,
    })
  }, [checkInDate, checkOutDate, guestsCount, includeHotTub, extraHours])

  // Check if selected range conflicts with occupied dates
  const hasDateConflict = useMemo(() => {
    if (!checkInDate || !checkOutDate) return false
    const start = new Date(checkInDate + 'T00:00:00')
    const end = new Date(checkOutDate + 'T00:00:00')
    const cur = new Date(start)

    while (cur < end) {
      const dStr = cur.toISOString().split('T')[0]
      if (occupiedDates.includes(dStr)) return true
      cur.setDate(cur.getDate() + 1)
    }
    return false
  }, [checkInDate, checkOutDate, occupiedDates])

  // Min date today
  const todayStr = new Date().toISOString().split('T')[0]

  async function handleCreateBooking() {
    if (!quote || quote.nightsCount <= 0) return
    setLoading(true)
    setErrorMessage('')

    try {
      const res = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientEmail,
          clientPhone,
          clientRut,
          checkInDate,
          checkOutDate,
          guestsCount,
          eventType,
          includeHotTub,
          extraHours,
          vehiclesCount,
          vehiclePlates: [vehiclePlate.trim().toUpperCase(), vehiclePlate2.trim().toUpperCase()].filter(Boolean),
          notes,
        }),
      })

      const data = await res.json()
      if (data.success && data.data) {
        setConfirmedBooking(data.data)
        setStep(4)
      } else {
        setErrorMessage(data.error || 'Ocurrió un error al crear la reserva')
      }
    } catch (err) {
      setErrorMessage('Error de conexión con el servidor. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Pre-filled WhatsApp link for direct booking
  const directWhatsAppUrl = useMemo(() => {
    const plates = [vehiclePlate, vehiclePlate2].filter(Boolean).join(', ')
    const msg = encodeURIComponent(
      `Hola Quincho Tabolango, me gustaría cotizar y coordinar mi reserva directamente:\n\n` +
        `👤 *Titular:* ${clientName || 'Cliente interesado'}\n` +
        `📅 *Llegada:* ${checkInDate || 'A coordinar'} | *Salida:* ${checkOutDate || 'A coordinar'} (${quote?.nightsCount || 0} noches)\n` +
        `👥 *Pasajeros:* ${guestsCount}\n` +
        `🚗 *Vehículos:* ${vehiclesCount} ${plates ? `(Patente: ${plates})` : ''}\n` +
        `♨️ *Tinaja con leña:* ${includeHotTub ? 'Sí (Incluida)' : 'No'}\n` +
        (quote ? `💰 *Total estadía:* ${formatCLP(quote.totalAmount)}\n` : '') +
        (quote ? `💳 *Abono 50%:* ${formatCLP(quote.depositRequired)}\n\n` : '\n') +
        `¿Tienen disponibilidad para estas fechas?`
    )
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`
  }, [clientName, checkInDate, checkOutDate, quote, guestsCount, vehiclesCount, vehiclePlate, vehiclePlate2, includeHotTub])

  // Build WhatsApp message for confirmation & deposit receipt
  const whatsappUrl = useMemo(() => {
    if (!confirmedBooking) return ''
    const msg = encodeURIComponent(
      `Hola Quincho Tabolango, acabo de agendar una reserva en la plataforma web.\n\n` +
        `🆔 *Código de Reserva:* ${confirmedBooking.id}\n` +
        `👤 *Titular:* ${confirmedBooking.clientName}\n` +
        `📅 *Fechas:* ${confirmedBooking.checkInDate} al ${confirmedBooking.checkOutDate} (${confirmedBooking.nightsCount} noches)\n` +
        `👥 *Personas:* ${confirmedBooking.guestsCount}\n` +
        `♨️ *Tinaja:* ${confirmedBooking.includeHotTub ? 'Sí (Incluida)' : 'No'}\n` +
        `💰 *Total estadía:* ${formatCLP(confirmedBooking.totalAmount)}\n` +
        `💳 *Abono 50% a transferir:* ${formatCLP(confirmedBooking.depositRequired)}\n\n` +
        `Adjunto comprobante de transferencia para confirmación.`
    )
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`
  }, [confirmedBooking])

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Navigation Bar / Return */}
        <div style={{ marginBottom: 20 }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            <Home size={18} /> Volver a Quincho Tabolango
          </Link>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <ShieldCheck size={16} /> Sistema Oficial de Reservas Directas
          </div>
          <h1 className={styles.title}>Reserva tu Estadía Privada</h1>
          <p className={styles.subtitle}>
            Disfruta de nuestro quincho exclusivo con piscina, tinaja y áreas verdes en Km 9,
            Tabolango, Limache.
          </p>
        </div>

        {/* Stepper (Only on steps 1, 2, 3) */}
        {step < 4 && (
          <div className={styles.stepper}>
            <div
              className={`${styles.stepItem} ${step === 1 ? styles.stepActive : ''} ${step > 1 ? styles.stepDone : ''}`}
            >
              <div className={styles.stepCircle}>{step > 1 ? '✓' : '1'}</div>
              <span className={styles.stepLabel}>Fechas & Personas</span>
            </div>
            <div
              className={`${styles.stepItem} ${step === 2 ? styles.stepActive : ''} ${step > 2 ? styles.stepDone : ''}`}
            >
              <div className={styles.stepCircle}>{step > 2 ? '✓' : '2'}</div>
              <span className={styles.stepLabel}>Experiencias</span>
            </div>
            <div
              className={`${styles.stepItem} ${step === 3 ? styles.stepActive : ''} ${step > 3 ? styles.stepDone : ''}`}
            >
              <div className={styles.stepCircle}>{step > 3 ? '✓' : '3'}</div>
              <span className={styles.stepLabel}>Titular & Resumen</span>
            </div>
          </div>
        )}

        {/* STEP 1: DATES & GUESTS */}
        {step === 1 && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Paso 1: Fechas de Estadía y Pasajeros</h2>
              <p className={styles.cardDesc}>
                Tarifa base de $90.000/noche (mínimo 2 noches) o $110.000 para 1 sola noche de fin de semana.
              </p>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label htmlFor="checkIn">
                  <Calendar size={16} style={{ display: 'inline', marginRight: 6 }} />
                  Fecha de Llegada (Check-in desde 14:00)
                </label>
                <input
                  type="date"
                  id="checkIn"
                  min={todayStr}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="checkOut">
                  <Calendar size={16} style={{ display: 'inline', marginRight: 6 }} />
                  Fecha de Salida (Check-out hasta 12:00)
                </label>
                <input
                  type="date"
                  id="checkOut"
                  min={checkInDate || todayStr}
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            {hasDateConflict && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #f87171',
                  color: '#991b1b',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <AlertTriangle size={20} />
                <span>
                  Una o más fechas dentro de tu rango seleccionado ya se encuentran ocupadas o en
                  mantención. Por favor escoge otras fechas.
                </span>
              </div>
            )}

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label htmlFor="guests">
                  <Users size={16} style={{ display: 'inline', marginRight: 6 }} />
                  Cantidad Total de Personas
                </label>
                <select
                  id="guests"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className={styles.select}
                >
                  {[...Array(10)].map((_, i) => {
                    const count = i + 1
                    return (
                      <option key={count} value={count}>
                        {count} persona{count > 1 ? 's' : ''} {count <= 8 ? '(Incluidas en tarifa base)' : `(+${count - 8} adicional $8.000)`}
                      </option>
                    )
                  })}
                </select>
                <span className={styles.helpText}>
                  Tarifa base cubre hasta 8 personas (incluye niños desde los 5 años). Máximo 10 personas.
                </span>
              </div>

              <div className={styles.field}>
                <label htmlFor="eventType">Motivo o Tipo de Estadía</label>
                <select
                  id="eventType"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className={styles.select}
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <span className={styles.helpText}>
                  Recinto exclusivo para descanso familiar. Prohibidos parlantes externos de alto volumen.
                </span>
              </div>
            </div>

            {/* Live Pricing Preview */}
            {quote && quote.nightsCount > 0 && !hasDateConflict && (
              <div className={styles.quoteBox}>
                <div className={styles.quoteTitle}>
                  <span>Detalle Preliminar ({quote.nightsCount} noche{quote.nightsCount > 1 ? 's' : ''})</span>
                  <span>{formatCLP(quote.ratePerNight)}/noche</span>
                </div>
                <div className={styles.quoteRow}>
                  <span>Subtotal estadía:</span>
                  <span>{formatCLP(quote.subtotalNights)}</span>
                </div>
                {quote.extraGuests > 0 && (
                  <div className={styles.quoteRow}>
                    <span>{quote.extraGuests} Persona(s) adicional(es):</span>
                    <span>+{formatCLP(quote.extraGuestsTotal)}</span>
                  </div>
                )}
                <div className={styles.quoteDivider} />
                <div className={styles.quoteTotalRow}>
                  <span>Total Estimado:</span>
                  <span>{formatCLP(quote.totalAmount)}</span>
                </div>
                <div className={styles.quoteDepositRow}>
                  <span>Abono del 50% para reservar:</span>
                  <span className={styles.depositHighlight}>
                    {formatCLP(quote.depositRequired)}
                  </span>
                </div>
              </div>
            )}

            <div className={styles.btnRow}>
              <div />
              <button
                type="button"
                className={styles.btnPrimary}
                disabled={!checkInDate || !checkOutDate || hasDateConflict || !quote || quote.nightsCount <= 0}
                onClick={() => setStep(2)}
              >
                Continuar a Experiencias <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: EXTRAS & EXPERIENCES */}
        {step === 2 && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Paso 2: Personaliza tu Experiencia</h2>
              <p className={styles.cardDesc}>
                Agrega servicios para que tu llegada a Quincho Tabolango sea inolvidable.
              </p>
            </div>

            {/* Hot Tub Option */}
            <div
              className={`${styles.extraOption} ${includeHotTub ? styles.extraSelected : ''}`}
              onClick={() => setIncludeHotTub(!includeHotTub)}
            >
              <div className={styles.extraInfo}>
                <div className={styles.extraIcon}>
                  <Flame size={24} />
                </div>
                <div className={styles.extraText}>
                  <h4>Tinaja de Agua Caliente con Leña</h4>
                  <p>
                    Capacidad 8 personas, 5 horas continuas de uso con leña y preparación previa.
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={styles.extraPrice}>+$50.000</span>
                <div style={{ fontSize: '0.8rem', color: includeHotTub ? 'var(--color-primary)' : '#888', fontWeight: 600 }}>
                  {includeHotTub ? '✓ Agregado' : '+ Agregar'}
                </div>
              </div>
            </div>

            {/* Extra Hours Option */}
            <div style={{ marginTop: 24, marginBottom: 24 }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>
                <Clock size={16} style={{ display: 'inline', marginRight: 6 }} />
                Horas adicionales de ingreso anticipado o salida tardía ($5.000 c/u)
              </label>
              <select
                value={extraHours}
                onChange={(e) => setExtraHours(Number(e.target.value))}
                className={styles.select}
              >
                <option value={0}>Sin horas adicionales (Horario regular: Entrada 14:00 - Salida 12:00)</option>
                <option value={1}>+1 Hora extra (+ $5.000)</option>
                <option value={2}>+2 Horas extras (+ $10.000)</option>
                <option value={3}>+3 Horas extras (+ $15.000)</option>
              </select>
              <span className={styles.helpText}>
                Sujeto a disponibilidad con otros pasajeros. Se confirma previo a la llegada.
              </span>
            </div>

            {/* Live Pricing Preview */}
            {quote && (
              <div className={styles.quoteBox}>
                <div className={styles.quoteRow}>
                  <span>Estadía ({quote.nightsCount} noches):</span>
                  <span>{formatCLP(quote.subtotalNights)}</span>
                </div>
                {includeHotTub && (
                  <div className={styles.quoteRow}>
                    <span>Tinaja de agua caliente:</span>
                    <span>+{formatCLP(quote.hotTubRate)}</span>
                  </div>
                )}
                {extraHours > 0 && (
                  <div className={styles.quoteRow}>
                    <span>{extraHours} Hora(s) adicional(es):</span>
                    <span>+{formatCLP(quote.extraHoursTotal)}</span>
                  </div>
                )}
                <div className={styles.quoteDivider} />
                <div className={styles.quoteTotalRow}>
                  <span>Total Estadía:</span>
                  <span>{formatCLP(quote.totalAmount)}</span>
                </div>
                <div className={styles.quoteDepositRow}>
                  <span>Abono requerido (50%):</span>
                  <span className={styles.depositHighlight}>{formatCLP(quote.depositRequired)}</span>
                </div>
              </div>
            )}

            <div className={styles.btnRow}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setStep(1)}
              >
                <ArrowLeft size={18} /> Volver a Fechas
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => setStep(3)}
              >
                Continuar al Resumen <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CLIENT DETAILS & SUMMARY */}
        {step === 3 && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Paso 3: Datos del Titular de la Reserva</h2>
              <p className={styles.cardDesc}>
                Ingresa los datos de contacto para emitir tu voucher y registrar el ingreso en portería.
              </p>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label htmlFor="name">Nombre y Apellidos</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Ej: Claudia Morales"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="phone">Teléfono Móvil (WhatsApp)</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="+56 9 1234 5678"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  placeholder="ejemplo@correo.cl"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="rut">RUT o Documento de Identidad</label>
                <input
                  type="text"
                  id="rut"
                  placeholder="12.345.678-9"
                  value={clientRut}
                  onChange={(e) => setClientRut(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            {/* Vehicle count & plates for security gate */}
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label htmlFor="vehCount">
                  <Car size={16} style={{ display: 'inline', marginRight: 6 }} />
                  ¿Cuántos vehículos van a ingresar?
                </label>
                <select
                  id="vehCount"
                  value={vehiclesCount}
                  onChange={(e) => setVehiclesCount(Number(e.target.value))}
                  className={styles.select}
                >
                  <option value={1}>1 Vehículo</option>
                  <option value={2}>2 Vehículos</option>
                  <option value={3}>3 o más Vehículos (Coordinar espacio)</option>
                </select>
                <span className={styles.helpText}>Para la apertura de portón con detector de patentes.</span>
              </div>

              <div className={styles.field}>
                <label htmlFor="vPlate">Patente Vehículo Principal</label>
                <input
                  type="text"
                  id="vPlate"
                  placeholder="Ej: AB-CD-12"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                  className={styles.input}
                  style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                />
              </div>
            </div>

            {vehiclesCount >= 2 && (
              <div className={styles.field} style={{ marginBottom: 20 }}>
                <label htmlFor="vPlate2">Patente Segundo Vehículo (Opcional)</label>
                <input
                  type="text"
                  id="vPlate2"
                  placeholder="Ej: EF-GH-34"
                  value={vehiclePlate2}
                  onChange={(e) => setVehiclePlate2(e.target.value.toUpperCase())}
                  className={styles.input}
                  style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                />
              </div>
            )}

            <div className={styles.field} style={{ marginBottom: 20 }}>
              <label htmlFor="notes">Notas o Peticiones Especiales (Opcional)</label>
              <textarea
                id="notes"
                placeholder="Indícanos si vendrás con niños pequeños, hora aproximada o requerimientos particulares..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={styles.textarea}
              />
            </div>

            {/* Terms reminder */}
            <div
              style={{
                background: 'rgba(79, 119, 45, 0.06)',
                border: '1px solid rgba(79, 119, 45, 0.2)',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                color: 'var(--color-text-secondary)',
                marginBottom: 20,
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 6 }}>
                📋 Condiciones Importantes del Quincho:
              </div>
              <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.6 }}>
                <li>Se reserva con el <strong>50% de abono</strong> mediante transferencia.</li>
                <li>El <strong>50% restante</strong> se paga al momento de la llegada antes de instalarse.</li>
                <li>Se solicita garantía de <strong>$30.000</strong> por aseo o daños (reembolsable al salir).</li>
                <li><strong>Prohibido</strong> el uso de equipos de música externos o parlantes potentes.</li>
              </ul>
            </div>

            {/* Final Quote Breakdown */}
            {quote && (
              <div className={styles.quoteBox}>
                <div className={styles.quoteTitle}>
                  <span>Resumen Final de Pago</span>
                  <span>{quote.nightsCount} Noche(s)</span>
                </div>
                <div className={styles.quoteRow}>
                  <span>Llegada: {checkInDate} (14:00 hrs)</span>
                  <span>Salida: {checkOutDate} (12:00 hrs)</span>
                </div>
                <div className={styles.quoteRow}>
                  <span>Valor estadía base ({guestsCount} pers):</span>
                  <span>{formatCLP(quote.subtotalNights + quote.extraGuestsTotal)}</span>
                </div>
                {includeHotTub && (
                  <div className={styles.quoteRow}>
                    <span>Tinaja de agua caliente:</span>
                    <span>+{formatCLP(quote.hotTubRate)}</span>
                  </div>
                )}
                {extraHours > 0 && (
                  <div className={styles.quoteRow}>
                    <span>Horas adicionales ({extraHours}):</span>
                    <span>+{formatCLP(quote.extraHoursTotal)}</span>
                  </div>
                )}
                <div className={styles.quoteDivider} />
                <div className={styles.quoteTotalRow}>
                  <span>Total Estadía:</span>
                  <span>{formatCLP(quote.totalAmount)}</span>
                </div>
                <div className={styles.quoteDepositRow}>
                  <span>Abono Requerido Hoy (50%):</span>
                  <span className={styles.depositHighlight}>{formatCLP(quote.depositRequired)}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 8 }}>
                  * El saldo de {formatCLP(quote.balanceOnArrival)} más garantía reembolsable de $30.000 se abona al llegar.
                </div>
              </div>
            )}

            {errorMessage && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #f87171',
                  color: '#991b1b',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 16,
                }}
              >
                {errorMessage}
              </div>
            )}

            <div className={styles.btnRow} style={{ flexWrap: 'wrap', gap: 12 }}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setStep(2)}
              >
                <ArrowLeft size={18} /> Modificar Experiencias
              </button>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnSecondary}
                  style={{
                    textDecoration: 'none',
                    color: '#166534',
                    borderColor: '#22c55e',
                    background: 'rgba(34, 197, 94, 0.08)',
                    fontWeight: 700,
                  }}
                >
                  <MessageCircle size={18} color="#16a34a" /> Reservar por WhatsApp
                </a>

                <button
                  type="button"
                  className={styles.btnPrimary}
                  disabled={loading || !clientName || !clientPhone || !clientEmail}
                  onClick={handleCreateBooking}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Procesando...
                    </>
                  ) : (
                    <>
                      Confirmar en Plataforma <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMATION & VOUCHER */}
        {step === 4 && confirmedBooking && (
          <div className={styles.card}>
            <div className={styles.voucher}>
              <div
                style={{
                  width: 70,
                  height: 70,
                  background: 'rgba(79, 119, 45, 0.12)',
                  color: 'var(--color-primary)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckCircle2 size={40} />
              </div>
              <h2 className={styles.cardTitle}>¡Tu Reserva ha sido Generada con Éxito!</h2>
              <p className={styles.cardDesc}>
                Guarda tu código único de reserva para gestionar tu estadía y realizar el check-in digital.
              </p>

              <div className={styles.voucherCode}>{confirmedBooking.id}</div>

              {qrDataUrl && (
                <div style={{
                  background: '#ffffff',
                  padding: '16px',
                  borderRadius: '16px',
                  display: 'inline-block',
                  margin: '12px auto 20px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: '2px solid #52B788'
                }}>
                  <img
                    src={qrDataUrl}
                    alt={`QR Reserva ${confirmedBooking.id}`}
                    style={{ width: '180px', height: '180px', display: 'block', margin: '0 auto' }}
                  />
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 8 }}>
                    Presenta este código al ingresar por el portón
                  </div>
                </div>
              )}

              <div className={styles.voucherDetails}>
                <div className={styles.voucherRow}>
                  <strong>Titular:</strong>
                  <span>{confirmedBooking.clientName}</span>
                </div>
                <div className={styles.voucherRow}>
                  <strong>Fechas:</strong>
                  <span>
                    {confirmedBooking.checkInDate} al {confirmedBooking.checkOutDate} ({confirmedBooking.nightsCount} noches)
                  </span>
                </div>
                <div className={styles.voucherRow}>
                  <strong>Huéspedes:</strong>
                  <span>{confirmedBooking.guestsCount} personas</span>
                </div>
                <div className={styles.voucherRow}>
                  <strong>Tinaja de Agua Caliente:</strong>
                  <span>{confirmedBooking.includeHotTub ? 'Sí (Incluida)' : 'No solicitada'}</span>
                </div>
                <div className={styles.voucherRow}>
                  <strong>Total Estadía:</strong>
                  <span>{formatCLP(confirmedBooking.totalAmount)}</span>
                </div>
                <div className={styles.voucherRow} style={{ color: '#c9510c', fontWeight: 700 }}>
                  <strong>Abono 50% para Confirmar:</strong>
                  <span>{formatCLP(confirmedBooking.depositRequired)}</span>
                </div>
                <div className={styles.voucherRow}>
                  <strong>Saldo al Llegar:</strong>
                  <span>{formatCLP(confirmedBooking.totalAmount - confirmedBooking.depositRequired)} (+ $30.000 garantía)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnPrimary}
                  style={{ textDecoration: 'none', background: '#25D366' }}
                >
                  <MessageCircle size={20} /> Enviar Comprobante de Abono por WhatsApp
                </a>

                <Link
                  href={`/mi-reserva?codigo=${confirmedBooking.id}`}
                  className={styles.btnSecondary}
                  style={{ textDecoration: 'none' }}
                >
                  <Car size={18} /> Ir al Portal de Mi Reserva & Check-in Digital
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
