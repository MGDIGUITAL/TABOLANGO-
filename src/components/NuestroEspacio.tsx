'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'
import styles from './NuestroEspacio.module.css'
import ScrollReveal from './ScrollReveal'

const ESPACIO_SLIDES = [
  {
    src: '/espacios/area-comun/LIVING Y COMERDOR.png',
    alt: 'Living y comedor del quincho Tabolango 7',
  },
  {
    src: '/espacios/areas-verdes/1.png',
    alt: 'Parque y áreas verdes de Tabolango 7',
  },
  {
    src: '/espacios/cocina/1.png',
    alt: 'Cocina equipada para eventos',
  },
  {
    src: '/espacios/areas-verdes/2.png',
    alt: 'Jardines al aire libre y descanso',
  },
  {
    src: '/espacios/bano/1.png',
    alt: 'Instalaciones sanitarias de primer nivel',
  },
  {
    src: '/espacios/areas-verdes/3.png',
    alt: 'Paisajismo y naturaleza en Limache',
  },
] as const

const FEATURES = [
  'Capacidad máxima de 10 personas para asegurar privacidad',
  'Check-in 14:00 hrs — Check-out 12:00 hrs',
  'Tinaja caliente premium con reserva (5 hrs continuas)',
  'Entorno rural y desconexión absoluta en Limache',
] as const

export default function NuestroEspacio() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ESPACIO_SLIDES.length)
    }, 3800)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className={`section ${styles.section}`} id="nosotros">
      <div className={`section-container ${styles.container}`}>
        <div className={styles.imageCol}>
          <ScrollReveal direction="right" duration={1000}>
            <div className={styles.imageWrapper}>
              {ESPACIO_SLIDES.map((slide, index) => (
                <div
                  key={slide.src}
                  className={`${styles.slide} ${
                    index === currentIndex ? styles.slideActive : ''
                  }`}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={styles.image}
                    priority={index === 0}
                  />
                </div>
              ))}

              <div className={styles.indicators}>
                {ESPACIO_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`${styles.dot} ${
                      index === currentIndex ? styles.dotActive : ''
                    }`}
                    aria-label={`Ver foto ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className={styles.textCol}>
          <ScrollReveal direction="left" delay={200}>
            <span className="section-label">Nuestro Espacio</span>
            <h2 className="section-title">
              El equilibrio perfecto entre diseño y naturaleza
            </h2>
            <p className="section-subtitle">
              Quincho Tabolango fue concebido para quienes buscan exclusividad. Cada detalle arquitectónico se integra con el paisaje, creando el ambiente ideal para celebraciones privadas y descanso absoluto.
            </p>

            <ul className={styles.features}>
              {FEATURES.map((feature) => (
                <li key={feature} className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <Check size={16} strokeWidth={2.5} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
