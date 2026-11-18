export type BookingStatus = 
  | 'pending_deposit' 
  | 'confirmed' 
  | 'checked_in' 
  | 'completed' 
  | 'cancelled'

export type GuaranteeStatus = 'pending' | 'received' | 'refunded'

export interface GuestInfo {
  name: string
  rutOrDoc: string
  age?: number
}

export type InspectionStatus = 'ok' | 'issue' | 'pending' // ok = verde ✓, issue = rojo ✗

export interface InspectionItem {
  id: string
  label: string
  category: 'habitaciones' | 'instalaciones' | 'exteriores' | 'servicios'
  status: InspectionStatus
  notes?: string
}

export interface InspectionTicket {
  id: string
  bookingId: string
  type: 'mantenimiento_previo' | 'recepcion_ingreso' | 'entrega_salida'
  title: string
  operatorName: string
  createdAt: string
  completedAt?: string
  status: 'pendiente' | 'en_progreso' | 'aprobado' | 'con_observaciones'
  items: InspectionItem[]
  generalNotes?: string
  guaranteeAmount?: number
  guaranteeRefunded?: boolean
  guaranteeDiscount?: number
}

export interface CheckInData {
  bookingId: string
  vehiclesCount?: number
  vehiclePlates?: string[] // List of authorized plates for the gate
  vehiclePlate?: string   // Primary vehicle plate
  estimatedArrival: string
  guestList: GuestInfo[]
  rulesAccepted: boolean
  rulesAcceptedAt: string
  checkedInAt?: string
  notes?: string
  tickets?: InspectionTicket[]
}

export interface Booking {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientRut?: string
  vehiclePlate?: string
  checkInDate: string // YYYY-MM-DD
  checkOutDate: string // YYYY-MM-DD
  nightsCount: number
  guestsCount: number
  extraGuests: number
  eventType: string
  includeHotTub: boolean
  extraHours: number
  ratePerNight: number
  totalAmount: number
  depositRequired: number // 50%
  depositPaid: boolean
  depositPaidAt?: string
  balancePaid: boolean
  balancePaidAt?: string
  guaranteeAmount: number // $30.000
  guaranteeStatus: GuaranteeStatus
  status: BookingStatus
  vehiclesCount?: number
  vehiclePlates?: string[]
  notes?: string
  createdAt: string
  checkin?: CheckInData
  tickets?: InspectionTicket[]
}

export interface BlockedDate {
  id: string
  date: string // YYYY-MM-DD
  reason: 'Reserva' | 'Mantención' | 'Uso Personal' | 'Festivo'
  bookingId?: string
  createdAt: string
}

export interface PriceCalculation {
  nightsCount: number
  ratePerNight: number
  subtotalNights: number
  extraGuests: number
  extraGuestsRate: number
  extraGuestsTotal: number
  includeHotTub: boolean
  hotTubRate: number
  extraHours: number
  extraHoursRate: number
  extraHoursTotal: number
  totalAmount: number
  depositRequired: number // 50%
  balanceOnArrival: number // 50%
  guaranteeAmount: number // $30.000
}

export interface QuinchoSettings {
  name: string
  address: string
  phone: string
  email: string
  baseRateMin2Nights: number
  baseRateSingleWeekendNight: number
  baseGuestsIncluded: number
  maxGuests: number
  extraGuestPrice: number
  hotTubPrice: number
  extraHourPrice: number
  guaranteePrice: number
  depositPercentage: number
  checkInTime: string
  checkOutTime: string
}

export interface CashTransaction {
  id: string
  date: string
  type: 'ingreso' | 'gasto' | 'garantia_recibida' | 'garantia_devuelta'
  category: 'abono' | 'saldo_llegada' | 'garantia' | 'insumo_limpieza' | 'leña' | 'gas' | 'otro'
  description: string
  amount: number
  bookingId?: string
  receiptNumber?: string
  operator: string
}

export interface Client {
  id: string
  name: string
  rut: string
  phone: string
  email: string
  totalVisits: number
  totalSpent: number
  lastBookingDate: string
  notes?: string
}

export interface VisitaRecord {
  id: string
  bookingId?: string
  visitorName: string
  visitorRut?: string
  visitorPhone?: string
  peopleCount: number
  vehiclePlate?: string
  parkingZone?: string
  entryTime: string
  exitTime?: string
  status: 'en_recinto' | 'finalizada' | 'proveedor' | 'visita_dia'
  type: 'huesped_reserva' | 'visita_adicional' | 'proveedor_servicio'
  notes?: string
}

export type SolicitudEstado = 'nueva' | 'contactado' | 'cotizado' | 'convertida' | 'descartada'

export interface SolicitudFormulario {
  id: string
  nombre: string
  telefono: string
  correo: string
  fechaEvento: string
  personas: number
  tipoEvento: string
  mensaje?: string
  estado: SolicitudEstado
  origen: 'formulario_web' | 'whatsapp' | 'manual'
  createdAt: string
  contactadoAt?: string
  notasInternas?: string
  presupuestoEstimado?: number
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'superadmin' | 'operador' | 'recepcion'
  phone?: string
  rut?: string
}
