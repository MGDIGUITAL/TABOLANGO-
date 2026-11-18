import Image from 'next/image'
import Link from 'next/link'
import { Camera, Globe, ShieldCheck, Calendar, UserCheck, MapPin, Phone, Mail } from 'lucide-react'
import styles from './Footer.module.css'

const NAV_LINKS = [
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Instalaciones', href: '/#instalaciones' },
  { label: 'Galería', href: '/#galeria' },
  { label: 'Precios', href: '/#precios' },
  { label: 'Ubicación', href: '/#ubicacion' },
] as const

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logoLink} aria-label="Quincho Tabolango Inicio">
              <Image
                src="/logo-transparent.png"
                alt="Quincho Tabolango Logo"
                width={150}
                height={200}
                className={styles.logoImg}
              />
              <div className={styles.logoTextGroup}>
                <span>Quincho</span>
                <span className={styles.logoAccent}>Tabolango</span>
              </div>
            </Link>
            <p className={styles.tagline}>
              El refugio privado en Tabolango, Limache. Piscina, tinaja de agua caliente con leña, parrilla y áreas verdes concebidas para el descanso familiar.
            </p>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span><MapPin size={14} style={{ display: 'inline', marginRight: 6 }} /> Km 9, Tabolango, Limache, Región de Valparaíso</span>
              <span><Phone size={14} style={{ display: 'inline', marginRight: 6 }} /> +56 9 1234 5678 (WhatsApp Oficial)</span>
            </div>
          </div>

          <div className={styles.navGroup}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#ECF39E', display: 'block', marginBottom: 12 }}>
                Explorar
              </span>
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
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#ECF39E', display: 'block', marginBottom: 12 }}>
                Plataforma SaaS
              </span>
              <ul className={styles.navList} style={{ listStyle: 'none', padding: 0 }}>
                <li>
                  <Link href="/reservar" className={styles.navLink} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} /> Reservar Online
                  </Link>
                </li>
                <li>
                  <Link href="/mi-reserva" className={styles.navLink} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <UserCheck size={14} /> Mi Reserva & Check-in
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className={styles.navLink} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.6)' }}>
                    <ShieldCheck size={14} /> Portal Dueño / Admin
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2026 Quincho Tabolango. Todos los derechos reservados. Sistema SaaS y Plataforma de Reservas.
          </p>
        </div>
      </div>
    </footer>
  )
}
