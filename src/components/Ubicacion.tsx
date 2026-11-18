import { ArrowUpRight, MapPin } from 'lucide-react'
import styles from './Ubicacion.module.css'
import ScrollReveal from './ScrollReveal'

export default function Ubicacion() {
  return (
    <section className={`section ${styles.section}`} id="ubicacion">
      <div className="section-container">
        <ScrollReveal>
          <div className={styles.header}>
            <span className="section-label">Cómo llegar</span>
            <div className={styles.headerInner}>
              <h2 className={styles.title}>Kilómetro 9, Tabolango</h2>
              <a
                href="https://maps.google.com/?q=-32.9313329,-71.3718295"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                Abrir en Google Maps <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

          {/* Dirección exacta */}
          <div className={styles.addressRow}>
            <MapPin size={16} className={styles.addressIcon} />
            <span className={styles.addressText}>
              Km 9, Tabolango · Limache, Región de Valparaíso, Chile
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className={styles.mapWrapper}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d259.399039422687!2d-71.37182950470589!3d-32.93133292670705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9689d10056b021c5%3A0xa0d97867e236d1e0!2sKilometro%209!5e1!3m2!1ses-419!2scl!4v1794963418984!5m2!1ses-419!2scl"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Ubicación exacta de Quincho Tabolango – Km 9, Tabolango, Limache"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
