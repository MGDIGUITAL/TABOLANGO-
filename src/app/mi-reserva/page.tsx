'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  CheckCircle2,
  Car,
  Users,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Home,
  QrCode,
  FileCheck,
  Plus,
  Trash2,
  Loader2,
  Calendar,
} from 'lucide-react'
import styles from './mi-reserva.module.css'
import { Booking, GuestInfo } from '@/types/saas'
import { formatCLP } from '@/lib/pricing'
import QRCode from 'qrcode'

function MiReservaContent() {
  const searchParams = useSearchParams()
  const initialCode = searchParams.get('codigo') || ''

  const [bookingCode, setBookingCode] = useState(initialCode)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')

  // Generate QR Code when booking changes
  useEffect(() => {
    if (booking?.id) {
      QRCode.toDataURL(booking.id, {
        width: 240,
        margin: 2,
        color: { dark: '#1B4332', light: '#ffffff' },
      })
        .then(setQrDataUrl)
        .catch((e) => console.error('Error generando QR:', e))
    }
  }, [booking?.id])

  // Check-in form states
  const [vehiclesCount, setVehiclesCount] = useState(1)
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehiclePlate2, setVehiclePlate2] = useState('')
  const [estimatedArrival, setEstimatedArrival] = useState('14:30')
  const [guestList, setGuestList] = useState<GuestInfo[]>([
    { name: '', rutOrDoc: '', age: undefined },
  ])
  const [rulesAccepted, setRulesAccepted] = useState(false)
  const [checkInSubmitting, setCheckInSubmitting] = useState(false)
  const [checkInSuccess, setCheckInSuccess] = useState(false)

  // Fetch booking if initialCode exists
  useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode)
    }
  }, [initialCode])

  async function handleSearch(codeToSearch?: string) {
    const code = (codeToSearch || bookingCode).trim().toUpperCase()
    if (!code) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/v1/bookings/${encodeURIComponent(code)}`)
      const data = await res.json()

      if (data.success && data.data) {
        setBooking(data.data)
        // If check-in already done, preload info
        if (data.data.checkin) {
          const plates = data.data.checkin.vehiclePlates || [data.data.checkin.vehiclePlate].filter(Boolean)
          setVehiclesCount(data.data.checkin.vehiclesCount || plates.length || 1)
          setVehiclePlate(plates[0] || '')
          setVehiclePlate2(plates[1] || '')
          setEstimatedArrival(data.data.checkin.estimatedArrival || '14:30')
          setGuestList(data.data.checkin.guestList || [])
          setRulesAccepted(data.data.checkin.rulesAccepted || false)
          setCheckInSuccess(true)
        } else {
          // Preload client as first guest
          setGuestList([
            {
              name: data.data.clientName,
              rutOrDoc: data.data.clientRut || '',
            },
          ])
          if (data.data.vehiclePlates && data.data.vehiclePlates.length > 0) {
            setVehiclePlate(data.data.vehiclePlates[0] || '')
            setVehiclePlate2(data.data.vehiclePlates[1] || '')
            setVehiclesCount(data.data.vehiclesCount || data.data.vehiclePlates.length || 1)
          }
        }
      } else {
        setError(data.error || 'No se encontró ninguna reserva con este código.')
        setBooking(null)
      }
    } catch {
      setError('Error al consultar el servidor. Intenta nuevamente.')
      setBooking(null)
    } finally {
      setLoading(false)
    }
  }

  function addGuest() {
    if (guestList.length < (booking?.guestsCount || 10)) {
      setGuestList([...guestList, { name: '', rutOrDoc: '' }])
    }
  }

  function removeGuest(index: number) {
    if (guestList.length > 1) {
      setGuestList(guestList.filter((_, i) => i !== index))
    }
  }

  function updateGuest(index: number, field: keyof GuestInfo, value: string | number) {
    const updated = [...guestList]
    updated[index] = { ...updated[index], [field]: value }
    setGuestList(updated)
  }

  async function handleCheckInSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!booking) return
    const plates = [vehiclePlate.trim().toUpperCase(), vehiclePlate2.trim().toUpperCase()].filter(Boolean)
    if (plates.length === 0) {
      alert('Ingresa al menos una patente de vehículo para el lector de portón.')
      return
    }
    if (!rulesAccepted) {
      alert('Debes aceptar las normas del recinto.')
      return
    }

    setCheckInSubmitting(true)
    try {
      const res = await fetch(`/api/v1/bookings/${booking.id}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehiclesCount,
          vehiclePlates: plates,
          vehiclePlate: plates[0],
          estimatedArrival,
          guestList: guestList.filter((g) => g.name.trim() !== ''),
          rulesAccepted: true,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setCheckInSuccess(true)
        setBooking(data.data)
      } else {
        alert(data.error || 'Error al guardar el check-in')
      }
    } catch {
      alert('Error al conectar con el servidor')
    } finally {
      setCheckInSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Navigation */}
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
          <h1 className={styles.title}>Portal de Huéspedes & Check-in</h1>
          <p className={styles.subtitle}>
            Consulta los detalles de tu estadía y registra tu patente para el acceso controlado.
          </p>
        </div>

        {/* Search by Code */}
        <div className={styles.searchCard}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}
            className={styles.searchForm}
          >
            <input
              type="text"
              placeholder="Ej: TAB-2026-4821"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value)}
              className={styles.searchInput}
              required
            />
            <button type="submit" className={styles.searchBtn} disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              Buscar Reserva
            </button>
          </form>

          {error && (
            <div
              style={{
                marginTop: 16,
                padding: '12px 16px',
                background: '#fef2f2',
                color: '#991b1b',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Loaded Booking Details */}
        {booking && (
          <div>
            {/* Status Banner */}
            <div
              className={`${styles.statusBanner} ${
                booking.status === 'confirmed' || booking.status === 'checked_in'
                  ? styles.statusConfirmed
                  : styles.statusPending
              }`}
            >
              <div>
                <strong style={{ fontSize: '1.05rem', display: 'block' }}>
                  Reserva {booking.id}
                </strong>
                <span style={{ fontSize: '0.9rem' }}>
                  Titular: {booking.clientName} ({booking.clientPhone})
                </span>
              </div>
              <div
                className={styles.statusBadge}
                style={{
                  background:
                    booking.status === 'checked_in'
                      ? '#059669'
                      : booking.status === 'confirmed'
                      ? '#16a34a'
                      : '#d97706',
                  color: '#fff',
                }}
              >
                {booking.status === 'checked_in'
                  ? 'Check-in Realizado'
                  : booking.status === 'confirmed'
                  ? 'Confirmada (Abono Recibido)'
                  : 'Pendiente de Abono'}
              </div>
            </div>

            {/* General Info Card */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <Calendar size={20} color="var(--color-primary)" /> Datos de la Estadía
              </h2>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>Llegada (Check-in)</label>
                  <span>{booking.checkInDate} (14:00 hrs)</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Salida (Check-out)</label>
                  <span>{booking.checkOutDate} (12:00 hrs)</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Noches</label>
                  <span>{booking.nightsCount} Noche{booking.nightsCount > 1 ? 's' : ''}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Huéspedes</label>
                  <span>{booking.guestsCount} Personas</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Tinaja de Agua Caliente</label>
                  <span>{booking.includeHotTub ? 'Sí (Incluida)' : 'No contratada'}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Total Estadía</label>
                  <span>{formatCLP(booking.totalAmount)}</span>
                </div>
              </div>

              {/* Payment state summary */}
              <div
                style={{
                  background: 'var(--color-surface)',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Abono 50% requerido:</span>
                  <strong>{formatCLP(booking.depositRequired)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Estado de Abono:</span>
                  <span
                    style={{
                      color: booking.depositPaid ? '#166534' : '#b45309',
                      fontWeight: 700,
                    }}
                  >
                    {booking.depositPaid ? '✓ Pagado' : '⏳ Pendiente de validación'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Saldo a pagar al llegar + Garantía:</span>
                  <strong>
                    {formatCLP(booking.totalAmount - booking.depositRequired)} + $30.000 garantía
                  </strong>
                </div>
              </div>
            </div>

            {/* DIGITAL CHECK-IN SECTION */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <Car size={20} color="var(--color-primary)" />
                Check-in Digital & Acceso Vehicular
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', marginBottom: 20 }}>
                El recinto cuenta con detector de patentes y portería controlada hasta las 23:00 hrs.
                Registra los datos con anticipación para un ingreso expedito.
              </p>

              {checkInSuccess && booking.checkin ? (
                <div className={styles.digitalPass}>
                  <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.1rem' }}>
                    <ShieldCheck size={32} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
                    PASE DE ACCESO VEHICULAR ACREDITADO
                  </div>

                  {/* QR Code de Entrada para Escanear por la App Móvil */}
                  {qrDataUrl && (
                    <div style={{
                      background: '#ffffff',
                      padding: '16px',
                      borderRadius: '16px',
                      display: 'inline-block',
                      margin: '18px auto',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      border: '2px solid #52B788'
                    }}>
                      <img
                        src={qrDataUrl}
                        alt={`QR Acceso ${booking.id}`}
                        style={{ width: '190px', height: '190px', display: 'block', margin: '0 auto' }}
                      />
                      <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem', color: '#1B4332', marginTop: 10, letterSpacing: 1 }}>
                        {booking.id}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
                        Presenta este QR al llegar al portón
                      </div>
                    </div>
                  )}

                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: '8px 0' }}>
                    Patentes autorizadas para ingresar por el portón con lector:
                  </p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', margin: '14px 0' }}>
                    {((booking.checkin.vehiclePlates && booking.checkin.vehiclePlates.length > 0)
                      ? booking.checkin.vehiclePlates
                      : [booking.checkin.vehiclePlate]
                    )
                      .filter(Boolean)
                      .map((p, idx) => (
                        <div key={idx} className={styles.plateBox}>
                          {p}
                        </div>
                      ))}
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'var(--color-text)', marginTop: 8 }}>
                    <strong>Hora estimada de llegada:</strong> {booking.checkin.estimatedArrival} hrs
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: 6 }}>
                    Acreditación: {booking.checkin.guestList?.length || 0} personas registradas.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCheckInSubmit}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="vehCount">¿Cuántos vehículos van a ingresar?</label>
                      <select
                        id="vehCount"
                        value={vehiclesCount}
                        onChange={(e) => setVehiclesCount(Number(e.target.value))}
                        className={styles.input}
                      >
                        <option value={1}>1 Vehículo</option>
                        <option value={2}>2 Vehículos</option>
                        <option value={3}>3 o más Vehículos</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="arrival">Hora estimada de llegada</label>
                      <select
                        id="arrival"
                        value={estimatedArrival}
                        onChange={(e) => setEstimatedArrival(e.target.value)}
                        className={styles.input}
                      >
                        <option value="14:00">14:00 hrs (Horario Oficial de Entrada)</option>
                        <option value="14:30">14:30 hrs</option>
                        <option value="15:00">15:00 hrs</option>
                        <option value="16:00">16:00 hrs</option>
                        <option value="17:00">17:00 hrs</option>
                        <option value="18:00">18:00 hrs</option>
                        <option value="19:00">19:00 hrs</option>
                        <option value="20:00">20:00 hrs</option>
                        <option value="21:00">21:00 hrs (Límite nocturno 23:00 hrs)</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGrid} style={{ marginTop: 10 }}>
                    <div className={styles.formGroup}>
                      <label htmlFor="plate">Patente Vehículo Principal</label>
                      <input
                        type="text"
                        id="plate"
                        placeholder="Ej: AB-CD-12"
                        value={vehiclePlate}
                        onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                        className={styles.input}
                        required
                        style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: 2 }}
                      />
                    </div>

                    {vehiclesCount >= 2 && (
                      <div className={styles.formGroup}>
                        <label htmlFor="plate2">Patente Segundo Vehículo</label>
                        <input
                          type="text"
                          id="plate2"
                          placeholder="Ej: EF-GH-34"
                          value={vehiclePlate2}
                          onChange={(e) => setVehiclePlate2(e.target.value.toUpperCase())}
                          className={styles.input}
                          style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: 2 }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Guest list registration */}
                  <div style={{ margin: '24px 0' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12,
                      }}
                    >
                      <label style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>
                        <Users size={16} style={{ display: 'inline', marginRight: 6 }} />
                        Lista de Pasajeros y Acompañantes
                      </label>
                      <button
                        type="button"
                        onClick={addGuest}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-primary)',
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Plus size={16} /> Agregar Acompañante
                      </button>
                    </div>

                    {guestList.map((guest, idx) => (
                      <div key={idx} className={styles.guestRow}>
                        <input
                          type="text"
                          placeholder={`Nombre huésped ${idx + 1}`}
                          value={guest.name}
                          onChange={(e) => updateGuest(idx, 'name', e.target.value)}
                          className={styles.input}
                          style={{ flex: 2 }}
                          required
                        />
                        <input
                          type="text"
                          placeholder="RUT o Documento"
                          value={guest.rutOrDoc}
                          onChange={(e) => updateGuest(idx, 'rutOrDoc', e.target.value)}
                          className={styles.input}
                          style={{ flex: 1.2 }}
                        />
                        {guestList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeGuest(idx)}
                            style={{
                              background: '#fee2e2',
                              border: 'none',
                              color: '#b91c1c',
                              padding: '0 12px',
                              borderRadius: 'var(--radius-md)',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Rules Acceptance */}
                  <div className={styles.rulesBox}>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 10 }}>
                      Reglamento Oficial de Quincho Tabolango:
                    </div>
                    <div className={styles.ruleItem}>
                      <AlertTriangle size={18} color="#b45309" style={{ flexShrink: 0 }} />
                      <span>
                        <strong>Música y Tranquilidad:</strong> Prohibido el ingreso de equipos de música
                        externos o parlantes de alta potencia. El recinto cuenta con audio a volumen
                        moderado.
                      </span>
                    </div>
                    <div className={styles.ruleItem}>
                      <Clock size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                      <span>
                        <strong>Horarios:</strong> Check-in 14:00 hrs y Check-out 12:00 hrs (mediodía).
                        Portón operativo hasta las 23:00 hrs.
                      </span>
                    </div>
                    <div className={styles.ruleItem}>
                      <FileCheck size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                      <span>
                        <strong>Residuos:</strong> Zona rural sin recolección municipal. Los huéspedes deben
                        llevar sus residuos a los contenedores externos.
                      </span>
                    </div>

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={rulesAccepted}
                        onChange={(e) => setRulesAccepted(e.target.checked)}
                        style={{ width: 18, height: 18 }}
                      />
                      <span>He leído y acepto cumplir las normas del recinto y condiciones de uso</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className={styles.searchBtn}
                    disabled={checkInSubmitting || !rulesAccepted || !vehiclePlate}
                    style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
                  >
                    {checkInSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Registrando Check-in...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} /> Confirmar Check-in & Generar Pase de Acceso
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MiReservaPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 100, textAlign: 'center', color: 'var(--color-primary)' }}>
          Cargando portal de reservas...
        </div>
      }
    >
      <MiReservaContent />
    </Suspense>
  )
}
