import Image from 'next/image'
import { Plus } from 'lucide-react'
import styles from './Instalaciones.module.css'
import ScrollReveal from './ScrollReveal'

const FACILITIES = [
  {
    title: 'Áreas Verdes & Jardines',
    image: '/espacios/areas-verdes/1.png',
    desc: 'Amplios jardines y césped natural rodeados de vegetación autóctona.',
  },
  {
    title: 'Cocina Equipada',
    image: '/espacios/cocina/1.png',
    desc: 'Espacio culinario amplio con equipamiento completo para tu evento.',
  },
  {
    title: 'Living & Comedor',
    image: '/espacios/area-comun/LIVING Y COMERDOR.png',
    desc: 'Área común acogedora con iluminación cálida y vista a la naturaleza.',
  },
  {
    title: 'Baños Privados',
    image: '/espacios/bano/1.png',
    desc: 'Instalaciones sanitarias modernas y completamente impecables.',
  },
  {
    title: 'Entorno & Terrazas',
    image: '/images/entorno-terrazas.png',
    desc: 'Espacios al aire libre diseñados para el descanso y la desconexión.',
  },
] as const

export default function Instalaciones() {
  return (
    <section className={`section ${styles.section}`} id="instalaciones">
      <div className="section-container">
        <ScrollReveal>
          <div className={styles.header}>
            <span className="section-label">Instalaciones</span>
            <h2 className="section-title">Diseño intencional</h2>
            <p className="section-subtitle">
              Cada instalación fue pensada para ofrecer una experiencia superior, mezclando materiales nobles con comodidad moderna.
            </p>
          </div>
        </ScrollReveal>

        <div className={styles.grid}>
          {FACILITIES.map(({ title, image, desc }, index) => (
            <ScrollReveal
              key={title}
              delay={index * 100}
              className={index === 0 ? styles.featured : ''}
            >
              <article className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={styles.image}
                  />
                  <div className={styles.imageOverlay} />
                  <div className={styles.content}>
                    <div className={styles.contentTop}>
                      <h3 className={styles.cardTitle}>{title}</h3>
                      <div className={styles.iconCircle}>
                        <Plus size={16} />
                      </div>
                    </div>
                    <p className={styles.cardDesc}>{desc}</p>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
