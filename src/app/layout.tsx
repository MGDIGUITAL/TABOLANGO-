import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.quinchotabolango.cl'),
  title: 'Quincho Tabolango | Arriendo privado con piscina y tinaja en Limache',
  description:
    'Arrienda Quincho Tabolango: quincho privado con piscina, tinaja de agua caliente con leña, parrilla y amplias áreas verdes en Km 9, Tabolango, Limache. Sistema de reserva directa y check-in digital.',
  keywords: [
    'Quincho Tabolango',
    'quincho tabolango limache',
    'arriendo quincho Tabolango',
    'arriendo quincho Limache',
    'quincho privado Limache',
    'piscina privada Tabolango',
    'piscina privada Limache',
    'tinaja Tabolango',
    'tinaja de agua caliente Limache',
    'eventos familiares Limache',
    'cumpleaños Limache',
    'quinchotabolango.cl',
    'reserva quincho chile',
  ],
  alternates: {
    canonical: 'https://www.quinchotabolango.cl',
  },
  openGraph: {
    title: 'Quincho Tabolango – Arriendo exclusivo con piscina y tinaja en Limache',
    description:
      'Tu espacio privado en Km 9, Tabolango, Limache. Piscina, tinaja de agua caliente, parrilla, áreas verdes y reserva online con check-in digital.',
    type: 'website',
    locale: 'es_CL',
    url: 'https://www.quinchotabolango.cl',
    siteName: 'Quincho Tabolango',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quincho Tabolango – Arriendo privado con piscina en Limache',
    description:
      'Quincho privado con piscina, tinaja y parrilla en Km 9, Tabolango, Limache. Reserva online y check-in digital directo.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: 'any', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/icon.png',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': ['LodgingBusiness', 'LocalBusiness'],
      name: 'Quincho Tabolango',
      image: 'https://www.quinchotabolango.cl/hero/1.png',
      description:
        'Quincho privado de descanso con piscina, tinaja de agua caliente a leña, parrilla y áreas verdes en Km 9, Tabolango, Limache. Ideal para familias hasta 10 personas.',
      url: 'https://www.quinchotabolango.cl',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Kilómetro 9, Tabolango',
        addressLocality: 'Limache',
        addressRegion: 'Región de Valparaíso',
        addressCountry: 'CL',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -33.0012,
        longitude: -71.2915,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '09:00',
          closes: '23:00',
        },
      ],
      priceRange: '$$',
      telephone: '+56912345678',
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Piscina Privada', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Tinaja de Agua Caliente', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Parrilla y Quincho Techado', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Áreas Verdes', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Estacionamiento con detector de patentes', value: true },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuáles son los horarios de Check-in y Check-out en Quincho Tabolango?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El horario oficial de Check-in es desde las 14:00 hrs y el Check-out es hasta las 12:00 hrs (mediodía). El portón con detector de patentes opera hasta las 23:00 hrs.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta arriendo del Quincho Tabolango?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La tarifa base para 2 o más noches es de $90.000 por noche para hasta 8 personas. Para 1 sola noche de fin de semana es de $110.000. Se abona el 50% para reservar.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cómo funciona la tinaja de agua caliente?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La tinaja tiene capacidad para 8 personas y brinda 5 horas continuas de uso con leña y preparación previa por un valor adicional de $50.000.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Se permite el uso de equipos de música externos?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No, está estrictamente prohibido el ingreso de equipos de música externos o parlantes portátiles de alta potencia para garantizar la tranquilidad y entorno natural de Tabolango.',
          },
        },
      ],
    },
  ]

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
