'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, UserCheck, Menu, X, ShieldCheck, User } from 'lucide-react'
import styles from './Nav.module.css'

const NAV_LINKS = [
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Instalaciones', href: '/#instalaciones' },
  { label: 'Galería', href: '/#galeria' },
  { label: 'Clientes', href: '/#clientes' },
  { label: 'Precios', href: '/#precios' },
] as const

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} id="inicio">
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink} aria-label="Quincho Tabolango Inicio">
          <Image
            src="/logo.png"
            alt="Quincho Tabolango Logo"
            width={160}
            height={160}
            priority
            className={styles.logoImg}
          />
          <div className={styles.logoTextGroup}>
            <span className={styles.logoBrand}>Quincho</span>
            <span className={styles.logoNumber}>Tabolango</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/mi-reserva"
              className={styles.link}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}
            >
              <UserCheck size={15} /> Mi Reserva
            </Link>
          </li>
        </ul>

        {/* Right Action Group */}
        <div className={styles.rightGroup}>
          <Link
            href="/reservar"
            className={`btn btn-md btn-primary ${styles.ctaBtn}`}
            id="nav-cta-reservar"
            style={{
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #ECF39E 0%, #90A955 100%)',
              color: '#1B2918',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(144, 169, 85, 0.3)',
            }}
          >
            <Calendar size={16} />
            <span>Reservar Online</span>
          </Link>

          {/* Icono de Usuario para Ingreso al Sistema SaaS */}
          <Link
            href="/admin"
            className={styles.userAdminBtn}
            title="Ingreso al Sistema SaaS (Administración)"
            aria-label="Ingreso al Sistema SaaS"
            id="nav-user-admin"
          >
            <User size={18} />
            <span className={styles.userStatusDot} />
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className={styles.mobileToggleBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X size={24} color="#FFFFFF" /> : <Menu size={24} color="#FFFFFF" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className={styles.mobileDrawer}>
          <ul className={styles.mobileLinks}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={styles.mobileLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/mi-reserva"
                className={styles.mobileLink}
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#ECF39E', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <UserCheck size={18} /> Mi Reserva & Check-in Digital
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className={styles.mobileLink}
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#ECF39E', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}
              >
                <User size={18} /> Ingreso al Sistema SaaS (Admin)
              </Link>
            </li>
            <li>
              <Link
                href="/reservar"
                className={styles.mobileCtaBtn}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #ECF39E 0%, #90A955 100%)',
                  color: '#1B2918',
                  fontWeight: 800,
                }}
              >
                <Calendar size={18} />
                Reservar Estadía Online
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
