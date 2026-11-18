import { NextResponse } from 'next/server'
import { validateLogin } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Usuario/correo y contraseña son obligatorios' },
        { status: 400 }
      )
    }

    const user = validateLogin(email, password)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas. Revisa tu usuario y contraseña.' },
        { status: 401 }
      )
    }

    // Generate a simple token for local/SaaS session verification
    const token = `tabolango_token_${Buffer.from(JSON.stringify({ id: user.id, exp: Date.now() + 86400000 })).toString('base64')}`

    return NextResponse.json({
      success: true,
      message: `¡Bienvenido/a, ${user.name}!`,
      token,
      user,
    })
  } catch (error) {
    console.error('Error in auth login:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno en la autenticación' },
      { status: 500 }
    )
  }
}
