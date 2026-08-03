import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import NuestroEspacio from '@/components/NuestroEspacio'
import Instalaciones from '@/components/Instalaciones'
import Galeria from '@/components/Galeria'
import Clientes from '@/components/Clientes'
import Precios from '@/components/Precios'
import Formulario from '@/components/Formulario'
import Ubicacion from '@/components/Ubicacion'
import Footer from '@/components/Footer'
import SalesAgent from '@/components/SalesAgent'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <NuestroEspacio />
        <Instalaciones />
        <Galeria />
        <Clientes />
        <Precios />
        <Formulario />
        <Ubicacion />
      </main>
      <Footer />
      <SalesAgent />
    </>
  )
}
