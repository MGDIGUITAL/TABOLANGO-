'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Clock, ShieldAlert, CheckCircle2, ChevronDown, Sparkles, Calendar, ArrowRight } from 'lucide-react'
import styles from './Precios.module.css'
import ScrollReveal from './ScrollReveal'

const PRICING_ITEMS = [
  {
    title: 'Reserva Mínimo 2 Noches',
    price: '$90.000',
    unit: 'por noche',
    detail: 'Hasta 8 personas (incluye niños desde los 5 años).',
  },
  {
    title: 'Reserva 1 Noche (Fin de Semana)',
    price: '$110.000',
    unit: 'por noche',
    detail: 'Hasta 8 personas (incluye niños desde los 5 años).',
  },
] as const

const EXTRA_ITEMS = [
  { label: 'Tinaja de agua caliente (5 hrs de uso continuo, cap. 8 pers.)', value: '$50.000' },
  { label: 'Persona adicional (desde 5 años, máx 2 adicionales conversables)', value: '$8.000' },
  { label: 'Hora adicional de ingreso o salida', value: '$5.000' },
  { label: 'Garantía por limpieza o destrozo (reembolsable al revisar)', value: '$30.000' },
] as const

export default function Precios() {
  const [showRules, setShowRules] = useState(false)

  return (
    <section className={`section ${styles.section}`} id="precios">
      <div className="section-container">
        <ScrollReveal>
          <div className={styles.header}>
            <span className="section-label">Tarifas Oficiales</span>
            <h2 className="section-title">Valores Temporada 2026</h2>
            <p className="section-subtitle">
              En días festivos o fines de semana largos se mantiene el valor publicado. Reserva directa con 50% de abono.
            </p>
          </div>
        </ScrollReveal>

        {/* Pricing Cards Grid */}
        <div className={styles.grid}>
          {PRICING_ITEMS.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 150}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{item.price}</span>
                  <span className={styles.unit}>{item.unit}</span>
                </div>
                <p className={styles.cardDetail}>{item.detail}</p>
                <div style={{ marginTop: 20 }}>
                  <Link
                    href="/reservar"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'var(--color-primary)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      padding: '10px 20px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Calendar size={15} /> Reservar esta opción <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Extra Services List */}
        <ScrollReveal delay={300}>
          <div className={styles.extrasWrapper}>
            <div className={styles.extrasList}>
              {EXTRA_ITEMS.map(({ label, value }) => (
                <div key={label} className={styles.extraItem}>
                  <Plus size={14} className={styles.extraIcon} />
                  <span className={styles.extraLabel}>{label}</span>
                  <div className={styles.extraDots} />
                  <span className={styles.extraValue}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Expandable Terms & Conditions Section */}
        <ScrollReveal delay={400}>
          <div className={styles.rulesContainer}>
            <button
              type="button"
              className={styles.rulesToggleBtn}
              onClick={() => setShowRules(!showRules)}
            >
              <div className={styles.rulesToggleTitle}>
                <ShieldAlert size={20} color="#ECF39E" />
                <span>Condiciones de Arrendamiento y Horarios del Recinto</span>
              </div>
              <ChevronDown
                size={20}
                className={`${styles.chevronIcon} ${showRules ? styles.chevronOpen : ''}`}
              />
            </button>

            {showRules && (
              <div className={styles.rulesContent}>
                {/* Horarios Box */}
                <div className={styles.ruleBox}>
                  <h4 className={styles.ruleBoxTitle}>
                    <Clock size={18} color="#ECF39E" /> Horarios de Ingreso y Salida
                  </h4>
                  <ul className={styles.ruleList}>
                    <li>
                      <strong>Check-in:</strong> 14:00 hrs.
                    </li>
                    <li>
                      <strong>Check-out:</strong> 12:00 hrs (Mediodía).
                    </li>
                    <li>
                      <strong>Horas adicionales:</strong> $5.000/hr. Avisar con mínimo 3 hrs de anticipación (sujeto a disponibilidad sin tope con otros pasajeros). <em>No se aceptan pagos de horas adicionales descontadas de la garantía.</em>
                    </li>
                    <li>
                      <strong>Límite de ingreso nocturno:</strong> Acceso controlado con cámara y detector de patentes hasta las 23:00 hrs de Lunes a Domingo.
                    </li>
                  </ul>
                </div>

                {/* Normas del Recinto Box */}
                <div className={styles.ruleBox}>
                  <h4 className={styles.ruleBoxTitle}>
                    <CheckCircle2 size={18} color="#ECF39E" /> Condiciones de Uso del Recinto
                  </h4>
                  <ul className={styles.ruleList}>
                    <li>
                      <strong>Reserva:</strong> 50% de abono inicial para reservar y el 50% restante al momento de la llegada antes de instalarse. Sin devolución de reserva por ausencias de fuerza mayor o cancelaciones con menos de 7 días.
                    </li>
                    <li className={styles.highlightRule}>
                      <strong>Equipos de música:</strong> PROHIBIDO el ingreso de equipos de música externos o parlantes portátiles. El lugar cuenta con equipo apto a volumen moderado. El incumplimiento procederá al desalojo.
                    </li>
                    <li>
                      <strong>Garantía:</strong> Se deja garantía de $30.000 en efectivo o transferencia por concepto de limpieza o daños (se devuelve tras la inspección 5 min antes de la salida).
                    </li>
                    <li>
                      <strong>Manejo de residuos:</strong> Al ser zona rural sin retiro de aseo domiciliario, los visitantes deben llevar la basura de vuelta a sus hogares o depositarla en contenedores habilitados.
                    </li>
                    <li>
                      <strong>Tinaja de agua caliente:</strong> Solicitar y reservar junto con el hospedaje, informando día y horario de inicio para su preparación previa con leña.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
