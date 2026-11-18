'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, Star, Users, Smile, Sparkles, X } from 'lucide-react'
import styles from './Clientes.module.css'
import ScrollReveal from './ScrollReveal'

const CLIENT_PHOTOS = [
  {
    id: 1,
    src: '/clientes/1.png',
    title: 'Almuerzo Familiar al Aire Libre',
    tag: 'Familia & Asado',
    quote: 'Un día maravilloso disfrutando en familia con el mejor asado y tranquilidad total.',
  },
  {
    id: 2,
    src: '/clientes/2.png',
    title: 'Tarde de Piscina & Sol',
    tag: 'Piscina Privada',
    quote: 'Los niños lo pasaron increíble en la piscina mientras descansábamos en las reposeras.',
  },
  {
    id: 3,
    src: '/clientes/3.png',
    title: 'Celebración en el Quincho',
    tag: 'Evento Especial',
    quote: 'Excelente espacio, súper cómodo para toda la familia. 100% recomendado.',
  },
  {
    id: 4,
    src: '/clientes/4.png',
    title: 'Relax en Tinaja de Agua Caliente',
    tag: 'Tinaja & Relax',
    quote: 'La tinaja en la tarde noche fue el punto culminante de nuestra estadía.',
  },
  {
    id: 5,
    src: '/clientes/5.png',
    title: 'Reunión Familiar de Fin de Semana',
    tag: 'Fin de Semana',
    quote: 'El quincho cuenta con todo lo necesario para no preocuparse de nada.',
  },
  {
    id: 6,
    src: '/clientes/6.png',
    title: 'Momentos de Descanso y Naturaleza',
    tag: 'Naturaleza & Privacidad',
    quote: 'Privacidad absoluta y un entorno verde espectacular en Tabolango.',
  },
] as const

export default function Clientes() {
  const [activePhoto, setActivePhoto] = useState<(typeof CLIENT_PHOTOS)[number] | null>(null)

  return (
    <section className={`section ${styles.section}`} id="clientes">
      <div className="section-container">
        <ScrollReveal>
          <div className={styles.header}>
            <span className="section-label">Comunidad & Vivencias</span>
            <h2 className="section-title">Experiencias de Nuestros Clientes</h2>
            <p className="section-subtitle">
              Momentos auténticos capturados por las familias y grupos que eligen Quincho Tabolango para desconectarse y celebrar.
            </p>
          </div>
        </ScrollReveal>

        {/* Rating Trust Badge */}
        <ScrollReveal delay={150}>
          <div className={styles.trustBanner}>
            <div className={styles.starsRow}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className={styles.starIcon} fill="#ECF39E" />
              ))}
            </div>
            <span className={styles.trustText}>
              <strong>+150 familias satisfechas</strong> disfrutando de tranquilidad y naturaleza en Tabolango.
            </span>
          </div>
        </ScrollReveal>

        {/* Client Photo Grid */}
        <div className={styles.grid}>
          {CLIENT_PHOTOS.map((client, index) => (
            <ScrollReveal key={client.id} delay={index * 120}>
              <div
                className={styles.card}
                onClick={() => setActivePhoto(client)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActivePhoto(client)}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={client.src}
                    alt={client.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={styles.image}
                  />
                  <div className={styles.badge}>{client.tag}</div>
                  <div className={styles.overlay}>
                    <Sparkles size={20} className={styles.overlayIcon} />
                    <span className={styles.overlayText}>Ver imagen completa</span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{client.title}</h3>
                  <p className={styles.cardQuote}>“{client.quote}”</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className={styles.lightboxOverlay} onClick={() => setActivePhoto(null)}>
          <div className={styles.lightboxModal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.lightboxCloseBtn}
              onClick={() => setActivePhoto(null)}
              aria-label="Cerrar modal"
            >
              <X size={24} color="#FFFFFF" />
            </button>
            <div className={styles.lightboxImageContainer}>
              <Image
                src={activePhoto.src}
                alt={activePhoto.title}
                fill
                className={styles.lightboxImage}
              />
            </div>
            <div className={styles.lightboxFooter}>
              <span className={styles.lightboxTag}>{activePhoto.tag}</span>
              <h4 className={styles.lightboxTitle}>{activePhoto.title}</h4>
              <p className={styles.lightboxQuote}>“{activePhoto.quote}”</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
