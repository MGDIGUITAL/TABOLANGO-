import fs from 'fs'
import path from 'path'
import { Booking, BlockedDate, CheckInData, QuinchoSettings, CashTransaction, Client, VisitaRecord, SolicitudFormulario } from '@/types/saas'
import { DEFAULT_SETTINGS } from './pricing'

interface DatabaseSchema {
  bookings: Booking[]
  blockedDates: BlockedDate[]
  settings: QuinchoSettings
  cashTransactions?: CashTransaction[]
  clients?: Client[]
  visitas?: VisitaRecord[]
  solicitudes?: SolicitudFormulario[]
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'tabolango_db.json')

// Initial seed data with realistic sample reservations for Quincho Tabolango
const INITIAL_SEED: DatabaseSchema = {
  settings: DEFAULT_SETTINGS,
  blockedDates: [
    {
      id: 'block-1',
      date: '2026-11-20',
      reason: 'Mantención',
      createdAt: '2026-11-01T10:00:00Z',
    },
    {
      id: 'block-2',
      date: '2026-12-25',
      reason: 'Festivo',
      createdAt: '2026-11-01T10:00:00Z',
    },
    {
      id: 'block-3',
      date: '2026-12-31',
      reason: 'Festivo',
      createdAt: '2026-11-01T10:00:00Z',
    },
    {
      id: 'block-4',
      date: '2026-01-01',
      reason: 'Festivo',
      createdAt: '2026-11-01T10:00:00Z',
    },
  ],
  cashTransactions: [
    {
      id: 'TX-101',
      date: '2026-11-17 14:15',
      type: 'ingreso',
      category: 'saldo_llegada',
      description: 'Saldo llegada Constanza Valenzuela (Reserva TAB-2026-081)',
      amount: 90500,
      bookingId: 'TAB-2026-081',
      receiptNumber: 'BOL-0941',
      operator: 'Administrador',
    },
    {
      id: 'TX-102',
      date: '2026-11-17 14:16',
      type: 'garantia_recibida',
      category: 'garantia',
      description: 'Garantía de llaves y recinto Constanza Valenzuela',
      amount: 30000,
      bookingId: 'TAB-2026-081',
      receiptNumber: 'GAR-081',
      operator: 'Administrador',
    },
    {
      id: 'TX-103',
      date: '2026-11-16 11:30',
      type: 'ingreso',
      category: 'abono',
      description: 'Abono 50% Ignacio Fuentes (Reserva TAB-2026-082)',
      amount: 80000,
      bookingId: 'TAB-2026-082',
      receiptNumber: 'TRANS-4412',
      operator: 'Administrador',
    },
    {
      id: 'TX-104',
      date: '2026-11-16 14:00',
      type: 'garantia_recibida',
      category: 'garantia',
      description: 'Garantía en custodia Ignacio Fuentes',
      amount: 30000,
      bookingId: 'TAB-2026-082',
      receiptNumber: 'GAR-082',
      operator: 'Administrador',
    },
    {
      id: 'TX-105',
      date: '2026-11-15 16:40',
      type: 'gasto',
      category: 'insumo_limpieza',
      description: 'Compra de 2 bolsas de leña seca de eucalipto + cloro pastillas',
      amount: -18000,
      receiptNumber: 'FAC-8812',
      operator: 'Pedro Salinas (Mantención)',
    },
    {
      id: 'TX-106',
      date: '2026-11-14 18:20',
      type: 'ingreso',
      category: 'abono',
      description: 'Abono 50% reserva Diciembre Valeria Muñoz',
      amount: 70500,
      bookingId: 'TAB-2026-085',
      receiptNumber: 'TRANS-9901',
      operator: 'Administrador',
    },
  ],
  clients: [
    {
      id: 'CLI-01',
      name: 'Constanza Valenzuela',
      rut: '18.423.901-5',
      phone: '+56987654321',
      email: 'constanza.v@gmail.com',
      totalVisits: 3,
      totalSpent: 320000,
      lastBookingDate: '2026-11-21',
      notes: 'Cliente frecuente, excelente cuidado de las instalaciones.',
    },
    {
      id: 'CLI-02',
      name: 'Ignacio Fuentes',
      rut: '16.321.456-K',
      phone: '+56991234567',
      email: 'ifuentes@empresa.cl',
      totalVisits: 2,
      totalSpent: 280000,
      lastBookingDate: '2026-11-20',
      notes: 'Suele pedir leña adicional para la tinaja.',
    },
    {
      id: 'CLI-03',
      name: 'Marcelo Castro',
      rut: '15.654.321-8',
      phone: '+56983344556',
      email: 'marcelo.castro@gmail.com',
      totalVisits: 1,
      totalSpent: 195000,
      lastBookingDate: '2026-11-15',
    },
    {
      id: 'CLI-04',
      name: 'Valeria Muñoz',
      rut: '17.890.123-4',
      phone: '+56976543210',
      email: 'valeria.m@outlook.com',
      totalVisits: 1,
      totalSpent: 141000,
      lastBookingDate: '2026-12-12',
    },
    {
      id: 'CLI-05',
      name: 'Rodrigo Pérez',
      rut: '14.567.890-2',
      phone: '+56998877665',
      email: 'rodrigo.perez@live.cl',
      totalVisits: 2,
      totalSpent: 340000,
      lastBookingDate: '2027-01-16',
    },
    {
      id: 'CLI-06',
      name: 'Alejandro Morales',
      rut: '15.482.901-3',
      phone: '+56987654321',
      email: 'alejandro.morales@gmail.com',
      totalVisits: 2,
      totalSpent: 235000,
      lastBookingDate: '2026-11-21',
    },
  ],
  visitas: [
    {
      id: 'VIS-2026-001',
      bookingId: 'TAB-2026-081',
      visitorName: 'Constanza Valenzuela (Titular)',
      visitorRut: '18.423.901-5',
      visitorPhone: '+56987654321',
      peopleCount: 10,
      vehiclePlate: 'KZ-8821',
      parkingZone: 'Sector A - Sombras Quincho',
      entryTime: '2026-11-17 14:15',
      status: 'en_recinto',
      type: 'huesped_reserva',
      notes: 'Ingreso confirmado con 3 vehículos. Tinaja activada.',
    },
    {
      id: 'VIS-2026-002',
      bookingId: 'TAB-2026-081',
      visitorName: 'Familia Valenzuela (Auto 2)',
      peopleCount: 4,
      vehiclePlate: 'PBYR-94',
      parkingZone: 'Sector A',
      entryTime: '2026-11-17 15:30',
      status: 'en_recinto',
      type: 'huesped_reserva',
    },
    {
      id: 'VIS-2026-003',
      bookingId: 'TAB-2026-082',
      visitorName: 'Ignacio Fuentes',
      visitorRut: '16.321.456-K',
      visitorPhone: '+56991234567',
      peopleCount: 8,
      vehiclePlate: 'PBYR-94',
      parkingZone: 'Sector B - Estacionamiento Principal',
      entryTime: '2026-11-16 14:10',
      exitTime: '2026-11-17 12:00',
      status: 'finalizada',
      type: 'huesped_reserva',
    },
    {
      id: 'VIS-2026-004',
      visitorName: 'Distribuidora de Leña Seca Don Ramón',
      visitorPhone: '+56933445566',
      peopleCount: 2,
      vehiclePlate: 'FD-9901',
      parkingZone: 'Zona Carga Leñera',
      entryTime: '2026-11-17 11:20',
      exitTime: '2026-11-17 11:55',
      status: 'proveedor',
      type: 'proveedor_servicio',
      notes: 'Entrega de 4 sacos de leña de eucalipto para caldera.',
    },
    {
      id: 'VIS-2026-005',
      bookingId: 'TAB-2026-084',
      visitorName: 'Marcelo Castro',
      visitorRut: '15.654.321-8',
      peopleCount: 9,
      vehiclePlate: 'DF-3344',
      parkingZone: 'Sector A',
      entryTime: '2026-11-15 14:00',
      exitTime: '2026-11-16 12:15',
      status: 'finalizada',
      type: 'huesped_reserva',
    },
  ],
  bookings: [
    {
      id: 'TAB-2026-081',
      clientName: 'Constanza Valenzuela',
      clientEmail: 'constanza.v@gmail.com',
      clientPhone: '+56987654321',
      clientRut: '18.423.901-5',
      checkInDate: '2026-11-21',
      checkOutDate: '2026-11-22',
      nightsCount: 1,
      guestsCount: 10,
      extraGuests: 2,
      eventType: 'Cumpleaños familiar',
      includeHotTub: true,
      extraHours: 0,
      ratePerNight: 110000,
      totalAmount: 181000,
      depositRequired: 90500,
      depositPaid: true,
      depositPaidAt: '2026-11-10T12:00:00Z',
      balancePaid: false,
      guaranteeAmount: 30000,
      guaranteeStatus: 'pending',
      status: 'confirmed',
      vehiclePlate: 'KZ-8821',
      vehiclesCount: 3,
      vehiclePlates: ['KZ-8821', 'PBYR-94', 'LJ-9912'],
      notes: 'Solicitó tinaja encendida para las 18:30 hrs.',
      createdAt: '2026-11-10T11:45:00Z',
      checkin: {
        bookingId: 'TAB-2026-081',
        vehiclesCount: 3,
        vehiclePlate: 'KZ-8821',
        vehiclePlates: ['KZ-8821', 'PBYR-94', 'LJ-9912'],
        estimatedArrival: '14:30',
        guestList: [
          { name: 'Constanza Valenzuela', rutOrDoc: '18.423.901-5', age: 34 },
          { name: 'Martín Valenzuela', rutOrDoc: '19.320.111-2', age: 29 },
        ],
        rulesAccepted: true,
        rulesAcceptedAt: '2026-11-14T19:00:00Z',
      },
      tickets: [
        {
          id: 'TCK-2026-081',
          bookingId: 'TAB-2026-081',
          type: 'mantenimiento_previo',
          title: 'Ticket #TCK-2026-081 - Previo a Llegada',
          operatorName: 'Pedro Salinas',
          createdAt: '2026-11-17T11:00:00Z',
          status: 'aprobado',
          items: [
            { id: 'piezas', label: 'Piezas / Dormitorios', category: 'habitaciones', status: 'ok' },
            { id: 'banos', label: 'Baños & Agua Caliente', category: 'instalaciones', status: 'ok' },
            { id: 'cocina', label: 'Cocina & Vajilla', category: 'instalaciones', status: 'ok' },
            { id: 'comedor', label: 'Comedor & Mobiliario', category: 'instalaciones', status: 'ok' },
            { id: 'piscina', label: 'Piscina & Rejas', category: 'exteriores', status: 'ok' },
            { id: 'tinaja', label: 'Tinaja & Leña lista', category: 'exteriores', status: 'ok' },
            { id: 'camas_elasticas', label: 'Camas Elásticas & Mallas', category: 'exteriores', status: 'ok' },
          ],
        },
      ],
    },
    {
      id: 'TAB-2026-082',
      clientName: 'Ignacio Fuentes',
      clientEmail: 'ifuentes@empresa.cl',
      clientPhone: '+56991234567',
      clientRut: '16.321.456-K',
      checkInDate: '2026-11-20',
      checkOutDate: '2026-11-21',
      nightsCount: 1,
      guestsCount: 8,
      extraGuests: 0,
      eventType: 'Jornada descanso',
      includeHotTub: false,
      extraHours: 0,
      ratePerNight: 110000,
      totalAmount: 110000,
      depositRequired: 55000,
      depositPaid: true,
      depositPaidAt: '2026-11-12T10:00:00Z',
      balancePaid: true,
      balancePaidAt: '2026-11-20T14:15:00Z',
      guaranteeAmount: 30000,
      guaranteeStatus: 'received',
      status: 'checked_in',
      vehiclePlate: 'PBYR-94',
      vehiclesCount: 2,
      vehiclePlates: ['PBYR-94', 'HGBB-11'],
      notes: 'Check-in realizado en portón a las 14:15 hrs.',
      createdAt: '2026-11-12T09:30:00Z',
    },
    {
      id: 'TAB-2026-084',
      clientName: 'Marcelo Castro',
      clientEmail: 'marcelo.castro@gmail.com',
      clientPhone: '+56983344556',
      clientRut: '15.654.321-8',
      checkInDate: '2026-11-15',
      checkOutDate: '2026-11-16',
      nightsCount: 1,
      guestsCount: 9,
      extraGuests: 1,
      eventType: 'Asado amigos',
      includeHotTub: true,
      extraHours: 0,
      ratePerNight: 110000,
      totalAmount: 168000,
      depositRequired: 84000,
      depositPaid: true,
      depositPaidAt: '2026-11-05T14:00:00Z',
      balancePaid: true,
      guaranteeAmount: 30000,
      guaranteeStatus: 'refunded',
      status: 'completed',
      vehiclePlate: 'DF-3344',
      vehiclesCount: 2,
      vehiclePlates: ['DF-3344', 'KJ-1199'],
      createdAt: '2026-11-05T12:00:00Z',
    },
    {
      id: 'TAB-2026-085',
      clientName: 'Valeria Muñoz',
      clientEmail: 'valeria.m@outlook.com',
      clientPhone: '+56976543210',
      clientRut: '17.890.123-4',
      checkInDate: '2026-12-12',
      checkOutDate: '2026-12-13',
      nightsCount: 1,
      guestsCount: 8,
      extraGuests: 0,
      eventType: 'Cumpleaños',
      includeHotTub: true,
      extraHours: 0,
      ratePerNight: 110000,
      totalAmount: 160000,
      depositRequired: 80000,
      depositPaid: true,
      depositPaidAt: '2026-11-14T18:20:00Z',
      balancePaid: false,
      guaranteeAmount: 30000,
      guaranteeStatus: 'pending',
      status: 'confirmed',
      vehiclePlate: 'RT-5521',
      vehiclesCount: 1,
      vehiclePlates: ['RT-5521'],
      createdAt: '2026-11-14T17:50:00Z',
    },
    {
      id: 'TAB-2026-086',
      clientName: 'Rodrigo Pérez',
      clientEmail: 'rodrigo.perez@live.cl',
      clientPhone: '+56998877665',
      clientRut: '14.567.890-2',
      checkInDate: '2027-01-16',
      checkOutDate: '2027-01-17',
      nightsCount: 1,
      guestsCount: 10,
      extraGuests: 2,
      eventType: 'Paseo verano familiar',
      includeHotTub: true,
      extraHours: 1,
      ratePerNight: 110000,
      totalAmount: 181000,
      depositRequired: 90500,
      depositPaid: true,
      depositPaidAt: '2026-11-15T10:00:00Z',
      balancePaid: false,
      guaranteeAmount: 30000,
      guaranteeStatus: 'pending',
      status: 'confirmed',
      vehiclePlate: 'LK-9012',
      vehiclesCount: 2,
      vehiclePlates: ['LK-9012', 'GG-7744'],
      createdAt: '2026-11-15T09:40:00Z',
    },
    {
      id: 'TAB-2026-4821',
      clientName: 'Alejandro Morales',
      clientEmail: 'alejandro.morales@gmail.com',
      clientPhone: '+56987654321',
      clientRut: '15.482.901-3',
      checkInDate: '2026-11-07',
      checkOutDate: '2026-11-09',
      nightsCount: 2,
      guestsCount: 8,
      extraGuests: 0,
      eventType: 'Reunión familiar',
      includeHotTub: true,
      extraHours: 1,
      ratePerNight: 90000,
      totalAmount: 235000,
      depositRequired: 117500,
      depositPaid: true,
      depositPaidAt: '2026-11-10T14:20:00Z',
      balancePaid: false,
      guaranteeAmount: 30000,
      guaranteeStatus: 'pending',
      status: 'confirmed',
      notes: 'Solicitó tinaja encendida para las 19:00 hrs.',
      createdAt: '2026-11-10T14:15:00Z',
      checkin: {
        bookingId: 'TAB-2026-4821',
        vehiclePlate: 'LL-PW-89',
        estimatedArrival: '14:30',
        guestList: [
          { name: 'Alejandro Morales', rutOrDoc: '15.482.901-3', age: 42 },
          { name: 'Camila Soto', rutOrDoc: '16.120.304-K', age: 39 },
          { name: 'Matías Morales', rutOrDoc: '23.490.112-4', age: 14 },
          { name: 'Sofía Morales', rutOrDoc: '25.301.992-1', age: 9 },
        ],
        rulesAccepted: true,
        rulesAcceptedAt: '2026-11-15T18:30:00Z',
      },
    },
    {
      id: 'TAB-2026-5912',
      clientName: 'Valentina Henríquez',
      clientEmail: 'v.henriquez@empresa.cl',
      clientPhone: '+56991238475',
      clientRut: '17.893.201-9',
      checkInDate: '2026-11-28',
      checkOutDate: '2026-11-29',
      nightsCount: 1,
      guestsCount: 9,
      extraGuests: 1,
      eventType: 'Cumpleaños',
      includeHotTub: true,
      extraHours: 0,
      ratePerNight: 110000,
      totalAmount: 168000,
      depositRequired: 84000,
      depositPaid: true,
      depositPaidAt: '2026-11-12T11:00:00Z',
      balancePaid: false,
      guaranteeAmount: 30000,
      guaranteeStatus: 'pending',
      status: 'confirmed',
      notes: 'Llegarán 2 vehículos (coordinar estacionamiento).',
      createdAt: '2026-11-12T10:45:00Z',
    },
    {
      id: 'TAB-2026-6204',
      clientName: 'Ignacio Valdés',
      clientEmail: 'ignacio.valdes@live.cl',
      clientPhone: '+56973342110',
      checkInDate: '2026-12-05',
      checkOutDate: '2026-12-07',
      nightsCount: 2,
      guestsCount: 8,
      extraGuests: 0,
      eventType: 'Aniversario',
      includeHotTub: false,
      extraHours: 0,
      ratePerNight: 90000,
      totalAmount: 180000,
      depositRequired: 90000,
      depositPaid: false,
      balancePaid: false,
      guaranteeAmount: 30000,
      guaranteeStatus: 'pending',
      status: 'pending_deposit',
      createdAt: '2026-11-16T19:00:00Z',
    },
  ],
}

function ensureDbFile(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED, null, 2), 'utf-8')
      return INITIAL_SEED
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8')
    const parsed = JSON.parse(content) as DatabaseSchema
    let modified = false
    if (!parsed.cashTransactions || parsed.cashTransactions.length === 0) {
      parsed.cashTransactions = INITIAL_SEED.cashTransactions || []
      modified = true
    }
    if (!parsed.clients || parsed.clients.length === 0) {
      parsed.clients = INITIAL_SEED.clients || []
      modified = true
    }
    if (!parsed.visitas || parsed.visitas.length === 0) {
      parsed.visitas = INITIAL_SEED.visitas || []
      modified = true
    }
    if (INITIAL_SEED.bookings) {
      for (const seedB of INITIAL_SEED.bookings) {
        if (!parsed.bookings.some((b) => b.id === seedB.id)) {
          parsed.bookings.unshift(seedB)
          modified = true
        }
      }
    }
    if (modified) {
      writeDbFile(parsed)
    }
    return parsed
  } catch (error) {
    console.error('Error reading DB file, using fallback seed:', error)
    return INITIAL_SEED
  }
}

function writeDbFile(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing DB file:', error)
  }
}

/**
 * DATABASE ACCESS OBJECT (DAO)
 */
export const db = {
  // BOOKINGS
  getBookings(): Booking[] {
    const data = ensureDbFile()
    return data.bookings.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  getBookingById(id: string): Booking | null {
    const data = ensureDbFile()
    const cleanId = id.trim().toUpperCase()
    return data.bookings.find((b) => b.id.toUpperCase() === cleanId) || null
  },

  createBooking(booking: Booking): Booking {
    const data = ensureDbFile()
    data.bookings.unshift(booking)
    writeDbFile(data)
    return booking
  },

  updateBooking(id: string, updates: Partial<Booking>): Booking | null {
    const data = ensureDbFile()
    const cleanId = id.trim().toUpperCase()
    const index = data.bookings.findIndex((b) => b.id.toUpperCase() === cleanId)
    if (index === -1) return null

    data.bookings[index] = {
      ...data.bookings[index],
      ...updates,
    }
    writeDbFile(data)
    return data.bookings[index]
  },

  saveCheckIn(bookingId: string, checkinData: CheckInData): Booking | null {
    const data = ensureDbFile()
    const cleanId = bookingId.trim().toUpperCase()
    const index = data.bookings.findIndex((b) => b.id.toUpperCase() === cleanId)
    if (index === -1) return null

    data.bookings[index].checkin = checkinData
    if (checkinData.vehiclesCount) {
      data.bookings[index].vehiclesCount = checkinData.vehiclesCount
    }
    if (checkinData.vehiclePlates) {
      data.bookings[index].vehiclePlates = checkinData.vehiclePlates
    }
    if (data.bookings[index].status === 'confirmed') {
      data.bookings[index].status = 'checked_in'
    }
    writeDbFile(data)
    return data.bookings[index]
  },

  // TICKETS DE INSPECCIÓN Y CHECK-IN
  saveTicket(bookingId: string, ticket: any): Booking | null {
    const data = ensureDbFile()
    const cleanId = bookingId.trim().toUpperCase()
    const index = data.bookings.findIndex((b) => b.id.toUpperCase() === cleanId)
    if (index === -1) return null

    if (!data.bookings[index].tickets) {
      data.bookings[index].tickets = []
    }
    const tIndex = data.bookings[index].tickets!.findIndex((t) => t.id === ticket.id)
    if (tIndex >= 0) {
      data.bookings[index].tickets![tIndex] = ticket
    } else {
      data.bookings[index].tickets!.push(ticket)
    }

    // If it's entrega_salida and approved, refund guarantee
    if (ticket.type === 'entrega_salida' && ticket.status === 'aprobado') {
      data.bookings[index].guaranteeStatus = 'refunded'
      data.bookings[index].status = 'completed'
    }

    writeDbFile(data)
    return data.bookings[index]
  },

  getAllTickets(): any[] {
    const data = ensureDbFile()
    const tickets: any[] = []
    for (const b of data.bookings) {
      if (b.tickets && Array.isArray(b.tickets)) {
        for (const t of b.tickets) {
          tickets.push({
            ...t,
            clientName: b.clientName,
            clientPhone: b.clientPhone,
            checkInDate: b.checkInDate,
            checkOutDate: b.checkOutDate,
          })
        }
      }
    }
    return tickets
  },

  // BLOCKED DATES & AVAILABILITY
  getBlockedDates(): BlockedDate[] {
    const data = ensureDbFile()
    return data.blockedDates
  },

  addBlockedDate(block: Omit<BlockedDate, 'id' | 'createdAt'>): BlockedDate {
    const data = ensureDbFile()
    const newBlock: BlockedDate = {
      ...block,
      id: `block-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    data.blockedDates.push(newBlock)
    writeDbFile(data)
    return newBlock
  },

  removeBlockedDate(id: string): boolean {
    const data = ensureDbFile()
    const initialLen = data.blockedDates.length
    data.blockedDates = data.blockedDates.filter((b) => b.id !== id)
    if (data.blockedDates.length !== initialLen) {
      writeDbFile(data)
      return true
    }
    return false
  },

  /**
   * Returns list of dates that are unavailable (YYYY-MM-DD format)
   * A date is unavailable if:
   * 1. It is explicitly blocked
   * 2. It is booked with status confirmed or checked_in
   */
  getOccupiedDates(): Array<{ date: string; reason: string; bookingId?: string }> {
    const data = ensureDbFile()
    const occupied: Array<{ date: string; reason: string; bookingId?: string }> = []

    // Explicit blocks
    for (const b of data.blockedDates) {
      occupied.push({ date: b.date, reason: b.reason, bookingId: b.bookingId })
    }

    // Active bookings
    for (const b of data.bookings) {
      if (b.status === 'confirmed' || b.status === 'checked_in') {
        const start = new Date(b.checkInDate + 'T00:00:00')
        const end = new Date(b.checkOutDate + 'T00:00:00')
        const cur = new Date(start)

        while (cur < end) {
          const dateStr = cur.toISOString().split('T')[0]
          occupied.push({
            date: dateStr,
            reason: `Reserva ${b.id}`,
            bookingId: b.id,
          })
          cur.setDate(cur.getDate() + 1)
        }
      }
    }

    return occupied
  },

  // SETTINGS
  getSettings(): QuinchoSettings {
    const data = ensureDbFile()
    return data.settings || DEFAULT_SETTINGS
  },

  updateSettings(settings: Partial<QuinchoSettings>): QuinchoSettings {
    const data = ensureDbFile()
    data.settings = { ...data.settings, ...settings }
    writeDbFile(data)
    return data.settings
  },

  // CASH TRANSACTIONS & FINANCES
  getCashTransactions(): CashTransaction[] {
    const data = ensureDbFile()
    return (data.cashTransactions || []).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  },

  addCashTransaction(tx: Omit<CashTransaction, 'id'>): CashTransaction {
    const data = ensureDbFile()
    if (!data.cashTransactions) data.cashTransactions = []
    const newTx: CashTransaction = {
      ...tx,
      id: `TX-${Date.now().toString().slice(-4)}`,
    }
    data.cashTransactions.unshift(newTx)
    writeDbFile(data)
    return newTx
  },

  // CLIENTS DIRECTORY
  getClients(): Client[] {
    const data = ensureDbFile()
    return data.clients || []
  },

  addOrUpdateClient(client: Client): Client {
    const data = ensureDbFile()
    if (!data.clients) data.clients = []
    const idx = data.clients.findIndex((c) => c.rut === client.rut || c.id === client.id)
    if (idx >= 0) {
      data.clients[idx] = client
    } else {
      data.clients.push(client)
    }
    writeDbFile(data)
    return client
  },

  // VISITAS & AFLUENCIA DE HUÉSPEDES
  getVisitas(): VisitaRecord[] {
    const data = ensureDbFile()
    return (data.visitas || []).sort(
      (a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime()
    )
  },

  addVisita(v: Omit<VisitaRecord, 'id'>): VisitaRecord {
    const data = ensureDbFile()
    if (!data.visitas) data.visitas = []
    const newVisita: VisitaRecord = {
      ...v,
      id: `VIS-2026-${Date.now().toString().slice(-4)}`,
    }
    data.visitas.unshift(newVisita)
    writeDbFile(data)
    return newVisita
  },

  checkoutVisita(id: string): VisitaRecord | null {
    const data = ensureDbFile()
    if (!data.visitas) return null
    const idx = data.visitas.findIndex((v) => v.id === id)
    if (idx === -1) return null

    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    data.visitas[idx].status = 'finalizada'
    data.visitas[idx].exitTime = `${now.toISOString().split('T')[0]} ${hours}:${minutes}`
    writeDbFile(data)
    return data.visitas[idx]
  },

  // SOLICITUDES DE FORMULARIO WEB / LEADS
  getSolicitudes(): SolicitudFormulario[] {
    const data = ensureDbFile()
    return (data.solicitudes || []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  createSolicitud(payload: {
    nombre: string
    telefono: string
    correo: string
    fechaEvento: string
    personas: number
    tipoEvento: string
    mensaje?: string
    origen?: 'formulario_web' | 'whatsapp' | 'manual'
  }): SolicitudFormulario {
    const data = ensureDbFile()
    if (!data.solicitudes) data.solicitudes = []

    const count = data.solicitudes.length + 1
    const id = `SOL-2026-${String(count).padStart(3, '0')}`

    const newSolicitud: SolicitudFormulario = {
      id,
      nombre: payload.nombre.trim(),
      telefono: payload.telefono.trim(),
      correo: payload.correo.trim().toLowerCase(),
      fechaEvento: payload.fechaEvento,
      personas: Number(payload.personas) || 10,
      tipoEvento: payload.tipoEvento || 'Cumpleaños',
      mensaje: payload.mensaje?.trim() || '',
      estado: 'nueva',
      origen: payload.origen || 'formulario_web',
      createdAt: new Date().toISOString(),
      presupuestoEstimado: (Number(payload.personas) || 10) > 50 ? 120000 + ((Number(payload.personas) || 10) - 50) * 5000 : 120000,
    }

    data.solicitudes.unshift(newSolicitud)

    // Si el cliente no existe en el directorio de clientes, lo creamos como lead potencial
    if (!data.clients) data.clients = []
    const existingClient = data.clients.find(c => c.email === newSolicitud.correo || c.phone === newSolicitud.telefono)
    if (!existingClient) {
      data.clients.push({
        id: `CLI-${Date.now().toString().slice(-4)}`,
        name: newSolicitud.nombre,
        rut: 'Pendiente',
        phone: newSolicitud.telefono,
        email: newSolicitud.correo,
        totalVisits: 0,
        totalSpent: 0,
        lastBookingDate: newSolicitud.fechaEvento,
        notes: `Origen: Solicitud ${id} (${newSolicitud.tipoEvento})`,
      })
    }

    writeDbFile(data)
    return newSolicitud
  },

  updateSolicitud(id: string, updates: Partial<SolicitudFormulario>): SolicitudFormulario | null {
    const data = ensureDbFile()
    if (!data.solicitudes) return null
    const idx = data.solicitudes.findIndex(s => s.id === id)
    if (idx === -1) return null

    if (updates.estado && updates.estado !== data.solicitudes[idx].estado && updates.estado === 'contactado') {
      updates.contactadoAt = new Date().toISOString()
    }

    data.solicitudes[idx] = {
      ...data.solicitudes[idx],
      ...updates,
    }

    writeDbFile(data)
    return data.solicitudes[idx]
  },

  deleteSolicitud(id: string): boolean {
    const data = ensureDbFile()
    if (!data.solicitudes) return false
    const initialLen = data.solicitudes.length
    data.solicitudes = data.solicitudes.filter(s => s.id !== id)
    if (data.solicitudes.length !== initialLen) {
      writeDbFile(data)
      return true
    }
    return false
  },
}
