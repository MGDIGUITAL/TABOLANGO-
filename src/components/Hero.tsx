'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MessageCircle, Sparkles, Flame, CheckCircle2, ShieldCheck } from 'lucide-react'
import styles from './Hero.module.css'
import ScrollReveal from './ScrollReveal'

const HERO_IMAGES = [
  '/hero/1.png',
  '/hero/3.png',
  '/hero/4.png',
  '/hero/5.png',
]

const WHATSAPP_URL =
  'https://wa.me/56912345678?text=Hola,%20quiero%20consultar%20por%20Quincho%20Tabolango'

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length)
    }, 4500)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.imageWrapper}>
        {HERO_IMAGES.map((src, index) => (
          <div
            key={src}
            className={`${styles.imageSlide} ${
              index === currentImageIndex ? styles.imageSlideActive : ''
            }`}
          >
            <Image
              src={src}
              alt={`Quincho Tabolango - Vista del recinto privado con piscina y tinaja en Limache ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              className={styles.image}
            />
          </div>
        ))}
        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <ScrollReveal duration={1000} delay={200}>
          <h1 className={styles.heading}>
            El espacio exclusivo para <br className={styles.break} />
            <span className={styles.headingAccent}>compartir y descansar</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal duration={1000} delay={400}>
          <p className={styles.subheading}>
            Un entorno natural privado en el valle de Limache. Piscina, tinaja de agua caliente con leña,
            parrilla y amplias áreas verdes concebidas para el descanso familiar y reuniones memorables.
          </p>
        </ScrollReveal>

        {/* Quick Highlights Pill */}
        <ScrollReveal duration={1000} delay={500}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              justifyContent: 'center',
              margin: '18px 0 28px',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.3)', padding: '6px 14px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.15)' }}>
              <CheckCircle2 size={14} color="#ECF39E" /> Hasta 10 Personas
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.3)', padding: '6px 14px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.15)' }}>
              <Flame size={14} color="#ECF39E" /> Tinaja de Agua Caliente
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.3)', padding: '6px 14px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.15)' }}>
              <ShieldCheck size={14} color="#ECF39E" /> Check-in Digital & Portón Seguro
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal duration={1000} delay={600}>
          <div className={styles.actions}>
            <Link
              href="/reservar"
              className="btn btn-accent btn-lg"
              id="hero-cta-reservar"
              style={{
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #ECF39E 0%, #90A955 100%)',
                color: '#1B2918',
                fontWeight: 800,
                boxShadow: '0 8px 24px rgba(236, 243, 158, 0.35)',
              }}
            >
              <Calendar size={18} />
              Reservar Online Ahora
            </Link>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
              id="hero-cta-whatsapp"
              style={{ textDecoration: 'none' }}
            >
              <MessageCircle size={18} />
              Consultar por WhatsApp
            </a>
          </div>
        </ScrollReveal>
      </div>

      <div className={styles.scrollIndicator}>
        <div className={styles.scrollLine} />
      </div>

      <div className={styles.slideIndicators}>
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.indicator} ${
              index === currentImageIndex ? styles.indicatorActive : ''
            }`}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`Ir a foto ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
