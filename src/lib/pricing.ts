import { PriceCalculation, QuinchoSettings } from '@/types/saas'

export const DEFAULT_SETTINGS: QuinchoSettings = {
  name: 'Quincho Tabolango',
  address: 'Km 9, Tabolango, Limache, Región de Valparaíso',
  phone: '56912345678',
  email: 'contacto@quinchotabolango.cl',
  baseRateMin2Nights: 90000,
  baseRateSingleWeekendNight: 110000,
  baseGuestsIncluded: 8,
  maxGuests: 10,
  extraGuestPrice: 8000,
  hotTubPrice: 50000,
  extraHourPrice: 5000,
  guaranteePrice: 30000,
  depositPercentage: 50,
  checkInTime: '14:00',
  checkOutTime: '12:00',
}

/**
 * Calculates number of nights between two dates in YYYY-MM-DD
 */
export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const d1 = new Date(checkIn + 'T00:00:00')
  const d2 = new Date(checkOut + 'T00:00:00')
  const diffTime = d2.getTime() - d1.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

/**
 * Checks if a date falls on a weekend (Friday=5 or Saturday=6 night)
 */
export function isWeekendNight(dateString: string): boolean {
  const d = new Date(dateString + 'T00:00:00')
  const day = d.getDay()
  return day === 5 || day === 6 // Friday or Saturday
}

/**
 * Computes price breakdown based on official rates
 */
export function computeBookingQuote(params: {
  checkInDate: string
  checkOutDate: string
  guestsCount: number
  includeHotTub: boolean
  extraHours?: number
  settings?: QuinchoSettings
}): PriceCalculation {
  const settings = params.settings || DEFAULT_SETTINGS
  const nights = calculateNights(params.checkInDate, params.checkOutDate)
  const guests = Math.max(1, params.guestsCount || 1)
  const extraHours = Math.max(0, params.extraHours || 0)

  // Determine rate per night
  let ratePerNight = settings.baseRateMin2Nights
  if (nights === 1) {
    // If only 1 night, standard weekend price applies
    ratePerNight = settings.baseRateSingleWeekendNight
  } else if (nights >= 2) {
    ratePerNight = settings.baseRateMin2Nights
  }

  const subtotalNights = nights * ratePerNight

  // Extra guests (included up to 8)
  const extraGuests = Math.max(0, guests - settings.baseGuestsIncluded)
  // Extra guests charge is per night or per stay? In rural quinchos typically per stay or per night.
  // In the rules: "Persona adicional (desde 5 años, máx 2 adicionales conversables): $8.000"
  const extraGuestsTotal = extraGuests * settings.extraGuestPrice

  // Hot tub
  const hotTubRate = params.includeHotTub ? settings.hotTubPrice : 0

  // Extra hours
  const extraHoursTotal = extraHours * settings.extraHourPrice

  const totalAmount = subtotalNights + extraGuestsTotal + hotTubRate + extraHoursTotal
  const depositRequired = Math.round((totalAmount * settings.depositPercentage) / 100)
  const balanceOnArrival = totalAmount - depositRequired

  return {
    nightsCount: nights,
    ratePerNight,
    subtotalNights,
    extraGuests,
    extraGuestsRate: settings.extraGuestPrice,
    extraGuestsTotal,
    includeHotTub: params.includeHotTub,
    hotTubRate,
    extraHours,
    extraHoursRate: settings.extraHourPrice,
    extraHoursTotal,
    totalAmount,
    depositRequired,
    balanceOnArrival,
    guaranteeAmount: settings.guaranteePrice,
  }
}

/**
 * Format CLP currency
 */
export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount)
}
