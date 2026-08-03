import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quincho Limache | Arriendo privado en Limache',
  description:
    'Arrienda nuestro quincho privado en Limache con piscina, tinaja, parrilla y áreas verdes. Ideal para cumpleaños, aniversarios y eventos familiares. Capacidad hasta 10 personas.',
  keywords: [
    'quincho arriendo Limache',
    'piscina privada Limache',
    'tinaja Limache',
    'eventos Limache',
    'Quincho Limache',
    'arriendo quincho Valparaíso',
  ],
  openGraph: {
    title: 'Quincho Limache – Arriendo privado',
    description:
      'Tu espacio perfecto en el corazón de Limache. Quincho privado con piscina, tinaja y parrilla.',
    type: 'website',
    locale: 'es_CL',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
