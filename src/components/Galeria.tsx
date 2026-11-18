import Image from 'next/image'
import styles from './Galeria.module.css'
import ScrollReveal from './ScrollReveal'

const GALLERY_IMAGES = [
  '/espacios/nuevo-hero/1.png',
  '/espacios/area-comun/LIVING Y COMERDOR.png',
  '/espacios/areas-verdes/1.png',
  '/espacios/areas-verdes/2.png',
  '/espacios/areas-verdes/3.png',
  '/espacios/cocina/1.png',
  '/espacios/bano/1.png',
  '/espacios/nuevo-hero/3.png',
  '/espacios/nuevo-hero/4.png',
  '/espacios/nuevo-hero/5.png',
] as const

export default function Galeria() {
  return (
    <section className={`section ${styles.section}`} id="galeria">
      <div className="section-container">
        <ScrollReveal>
          <div className={styles.header}>
            <span className="section-label">Galería Visual</span>
            <h2 className={styles.title}>Nuestra atmósfera</h2>
          </div>
        </ScrollReveal>

        <div className={styles.grid}>
          {GALLERY_IMAGES.map((srcPath, index) => (
            <ScrollReveal
              key={srcPath}
              delay={(index % 3) * 100}
              className={`${styles.item} ${index % 4 === 0 ? styles.itemTall : ''}`}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={srcPath}
                  alt={`Quincho Tabolango 7 – Espacio ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={styles.image}
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
