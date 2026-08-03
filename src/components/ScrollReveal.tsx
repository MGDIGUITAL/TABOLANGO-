'use client'

import { useEffect, useRef } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  threshold?: number
  once?: boolean
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 700,
  threshold = 0.15,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    /* Respect prefers-reduced-motion */
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) {
      el.style.opacity = '1'
      el.style.transform = 'none'
      return
    }

    const directionMap: Record<string, string> = {
      up: 'translateY(48px)',
      down: 'translateY(-48px)',
      left: 'translateX(48px)',
      right: 'translateX(-48px)',
      none: 'none',
    }

    el.style.opacity = '0'
    el.style.transform = directionMap[direction] ?? 'translateY(48px)'
    el.style.transition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
    el.style.willChange = 'opacity, transform'

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1'
            el.style.transform = 'none'
            if (once) observer.unobserve(el)
          } else if (!once) {
            el.style.opacity = '0'
            el.style.transform = directionMap[direction] ?? 'translateY(48px)'
          }
        })
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [delay, direction, duration, once, threshold])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
