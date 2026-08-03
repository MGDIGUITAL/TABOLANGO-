'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { MessageCircle, Menu, X } from 'lucide-react'
import styles from './Nav.module.css'

const WHATSAPP_URL =
  'https://wa.me/56912345678?text=Hola,%20quiero%20cotizar%20un%20evento%20en%20Quincho%20Limache'

const NAV_LINKS = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Instalaciones', href: '#instalaciones' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Clientes', href: '#clientes' },
  { label: 'Precios', href: '#precios' },
] as const

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} id="inicio">
      <div className={styles.container}>
        <a href="#inicio" className={styles.logoLink} aria-label="Quincho Limache Inicio">
          <Image
            src="/logo.png"
            alt="Quincho Limache Logo"
            width={160}
            height={160}
            priority
            className={styles.logoImg}
          />
          <div className={styles.logoTextGroup}>
            <span className={styles.logoBrand}>Quincho</span>
            <span className={styles.logoNumber}>Limache</span>
          </div>
        </a>

        {/* Desktop Links */}
        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Action Group */}
        <div className={styles.rightGroup}>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-md btn-primary ${styles.ctaBtn}`}
            id="nav-cta-cotizar"
          >
            <MessageCircle size={16} />
            <span>Cotizar</span>
          </a>

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
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileCtaBtn}
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageCircle size={18} />
                Cotizar por WhatsApp
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
