import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const transactions = db.getCashTransactions()
    const bookings = db.getBookings()

    let totalIncome = 0
    let totalExpense = 0
    let guaranteeCustody = 0

    for (const tx of transactions) {
      if (tx.type === 'ingreso') {
        totalIncome += tx.amount
      } else if (tx.type === 'gasto') {
        totalExpense += Math.abs(tx.amount)
      } else if (tx.type === 'garantia_recibida') {
        guaranteeCustody += tx.amount
      } else if (tx.type === 'garantia_devuelta') {
        guaranteeCustody -= Math.abs(tx.amount)
      }
    }

    const availableBalance = totalIncome - totalExpense

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        summary: {
          availableBalance,
          totalIncome,
          totalExpense,
          guaranteeCustody,
        },
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener movimientos de caja' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, category, description, amount, bookingId, receiptNumber, operator } = body

    if (!description || !amount || !type) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    const newTx = db.addCashTransaction({
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type,
      category: category || 'otro',
      description,
      amount: Number(amount),
      bookingId,
      receiptNumber: receiptNumber || `MAN-${Date.now().toString().slice(-4)}`,
      operator: operator || 'Administrador',
    })

    return NextResponse.json({ success: true, data: newTx })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al registrar movimiento en caja' },
      { status: 500 }
    )
  }
}
