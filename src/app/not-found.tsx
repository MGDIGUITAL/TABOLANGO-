import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', color: '#fff', backgroundColor: '#0d2218', minHeight: '100vh' }}>
      <h2>Página no encontrada</h2>
      <p style={{ margin: '20px 0' }}>La página que buscas no existe o ha sido movida.</p>
      <Link href="/" style={{ color: '#88C057', textDecoration: 'underline' }}>
        Volver al inicio
      </Link>
    </div>
  )
}
