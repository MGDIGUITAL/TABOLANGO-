import { ArrowUpRight } from 'lucide-react'
import styles from './Ubicacion.module.css'
import ScrollReveal from './ScrollReveal'

export default function Ubicacion() {
  return (
    <section className={`section ${styles.section}`} id="ubicacion">
      <div className="section-container">
        <ScrollReveal>
          <div className={styles.header}>
            <span className="section-label">Ubicación</span>
            <div className={styles.headerInner}>
              <h2 className={styles.title}>Valle de Limache</h2>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                Abrir en Google Maps <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className={styles.mapWrapper}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26634.42894685!2d-71.29!3d-33.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9689dd6e1c8b4aeb%3A0x2c8d3f77f23a4e9!2sLimache%2C%20Valpara%C3%ADso%2C%20Chile!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Quincho Tabolango 7 en Limache"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
