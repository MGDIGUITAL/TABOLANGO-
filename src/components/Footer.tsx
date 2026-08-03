import Image from 'next/image'
import { Camera, Globe } from 'lucide-react'
import styles from './Footer.module.css'

const NAV_LINKS = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Instalaciones', href: '#instalaciones' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Precios', href: '#precios' },
  { label: 'Contacto', href: '#contacto' },
] as const

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <a href="#inicio" className={styles.logoLink} aria-label="Quincho Limache Inicio">
              <Image
                src="/logo-transparent.png"
                alt="Quincho Limache Logo"
                width={150}
                height={200}
                className={styles.logoImg}
              />
              <div className={styles.logoTextGroup}>
                <span>Quincho</span>
                <span className={styles.logoAccent}>Limache</span>
              </div>
            </a>
            <p className={styles.tagline}>
              El refugio definitivo en Limache para celebrar, conectar y descansar en completa privacidad.
            </p>
          </div>

          <div className={styles.navGroup}>
            <nav className={styles.nav}>
              <ul className={styles.navList}>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={styles.navLink}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className={styles.socials}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <Camera size={18} /> Instagram
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <Globe size={18} /> Facebook
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2026 Quincho Limache. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

