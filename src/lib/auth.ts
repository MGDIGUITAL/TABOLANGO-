export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'superadmin' | 'operador' | 'recepcion'
  phone: string
}

export const ADMIN_CREDENTIALS = [
  {
    id: 'USR-001',
    name: 'Administrador General Tabolango',
    email: 'admin@tabolango.cl',
    username: 'admin',
    passwords: ['Tabolango2026*Admin', 'admin123', 'admin'],
    role: 'superadmin' as const,
    phone: '+56912345678',
  },
  {
    id: 'USR-002',
    name: 'Encargada de Quincho y Terreno',
    email: 'operador@tabolango.cl',
    username: 'operador',
    passwords: ['Quincho2026*Operador', 'quincho123', 'quincho'],
    role: 'operador' as const,
    phone: '+56987654321',
  },
]

export function validateLogin(identifier: string, password: string): AuthUser | null {
  const cleanId = identifier.trim().toLowerCase()
  const cleanPass = password.trim()

  const user = ADMIN_CREDENTIALS.find(
    (u) =>
      (u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId) &&
      u.passwords.includes(cleanPass)
  )

  if (!user) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  }
}
