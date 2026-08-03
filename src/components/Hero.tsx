'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { MessageCircle, MapPin } from 'lucide-react'
import styles from './Hero.module.css'
import ScrollReveal from './ScrollReveal'

const HERO_IMAGES = [
  '/hero/1.png',
  '/hero/2.png',
  '/hero/3.png',
  '/hero/4.png',
  '/hero/5.png',
]

const WHATSAPP_URL =
  'https://wa.me/56912345678?text=Hola,%20quiero%20cotizar%20un%20evento%20en%20Quincho%20Limache'

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
              alt={`Vista panorámica de Tabolango 7 - Imagen ${index + 1}`}
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
        <ScrollReveal duration={1000} delay={100}>
          <div className={styles.badge}>
            <MapPin size={14} />
            TABOLANGO, LIMACHE
          </div>
        </ScrollReveal>

        <ScrollReveal duration={1000} delay={200}>
          <h1 className={styles.heading}>
            El espacio ideal para <br className={styles.break} />
            <span className={styles.headingAccent}>compartir en familia</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal duration={1000} delay={400}>
          <p className={styles.subheading}>
            Un entorno tranquilo y privado en Limache, concebido para disfrutar momentos memorables con piscina, tinaja y áreas verdes en total serenidad.
          </p>
        </ScrollReveal>

        <ScrollReveal duration={1000} delay={600}>
          <div className={styles.actions}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent btn-lg"
              id="hero-cta-whatsapp"
            >
              <MessageCircle size={18} />
              Reservar ahora
            </a>
            <a href="#instalaciones" className="btn btn-outline btn-lg" id="hero-cta-instalaciones">
              Explorar instalaciones
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
            aria-label={`Ver imagen ${index + 1}`}
            onClick={() => setCurrentImageIndex(index)}
            className={`${styles.indicatorDot} ${
              index === currentImageIndex ? styles.indicatorDotActive : ''
            }`}
          />
        ))}
      </div>
    </section>
  )
}
