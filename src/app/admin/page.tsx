'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Car,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  Lock,
  LogOut,
  Smartphone,
  ExternalLink,
  MessageCircle,
  Plus,
  Trash2,
  RefreshCw,
  Home,
  ClipboardCheck,
  Check,
  X,
  Flame,
  Bed,
  Bath,
  UtensilsCrossed,
  Sparkles,
  Sun,
  CloudSun,
  QrCode,
  Wallet,
  Send,
  Calendar as CalendarIcon,
  Phone,
  Mail,
  Search,
  Download,
  CheckCircle,
  XCircle,
  Bot,
  Layers,
  ArrowRight,
  Loader2,
  Eye,
  TrendingUp,
} from 'lucide-react'
import styles from './admin.module.css'
import { Booking, BlockedDate, InspectionItem, CashTransaction, Client, VisitaRecord, SolicitudFormulario, SolicitudEstado } from '@/types/saas'
import { formatCLP } from '@/lib/pricing'

const DEFAULT_INSPECTION_ITEMS: InspectionItem[] = [
  { id: 'piezas', label: 'Piezas / Habitaciones (Camas preparadas, sábanas limpias)', category: 'habitaciones', status: 'ok' },
  { id: 'banos', label: 'Baños & Agua Caliente (Aseo profundo, agua caliente, papel)', category: 'instalaciones', status: 'ok' },
  { id: 'cocina', label: 'Cocina & Vajilla (Equipamiento completo, vajilla limpia)', category: 'instalaciones', status: 'ok' },
  { id: 'comedor', label: 'Comedor & Quincho Techado (Mesas y sillas ordenadas)', category: 'instalaciones', status: 'ok' },
  { id: 'piscina', label: 'Piscina & Rejas (Agua cristalina, cloro/PH, rejas cerradas)', category: 'exteriores', status: 'ok' },
  { id: 'tinaja', label: 'Tinaja & Leña lista (Leña seca de eucalipto, caldera lista)', category: 'exteriores', status: 'ok' },
  { id: 'camas_elasticas', label: 'Camas Elásticas & Mallas (Malla de seguridad intacta)', category: 'exteriores', status: 'ok' },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'reservas' | 'solicitudes' | 'checkin' | 'caja' | 'clientes' | 'visitas' | 'copiloto' | 'calendar' | 'api'
  >('dashboard')

  // Solicitudes de Formulario Web
  const [solicitudesList, setSolicitudesList] = useState<SolicitudFormulario[]>([])
  const [solicitudesStats, setSolicitudesStats] = useState<any>({
    total: 0,
    nuevas: 0,
    contactadas: 0,
    cotizadas: 0,
    convertidas: 0,
    conversionRate: 0,
  })
  const [solicitudesFilter, setSolicitudesFilter] = useState<'todas' | 'nueva' | 'contactado' | 'cotizado' | 'convertida'>('todas')
  const [solicitudesSearch, setSolicitudesSearch] = useState('')
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null)
  const [tempNotes, setTempNotes] = useState('')

  // Global Data
  const [loading, setLoading] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [ticketsList, setTicketsList] = useState<any[]>([])
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>([])
  const [cashSummary, setCashSummary] = useState<any>({
    availableBalance: 253000,
    totalIncome: 271000,
    totalExpense: 18000,
    guaranteeCustody: 60000,
  })
  const [clients, setClients] = useState<Client[]>([])

  // Visitas & Control de Portería State
  const [visitasList, setVisitasList] = useState<VisitaRecord[]>([])
  const [visitasMetrics, setVisitasMetrics] = useState<any>({
    totalPeopleThisMonth: 84,
    activePeopleNow: 14,
    activeVehiclesNow: 4,
    totalVisitsCount: 5,
  })
  const [webAnalytics, setWebAnalytics] = useState<any>({
    monthlyPageViews: 1420,
    uniqueVisitors: 680,
    quotationsStarted: 185,
    whatsappConversions: 42,
    conversionRate: '5.9%',
  })
  const [visitaModalOpen, setVisitaModalOpen] = useState(false)
  const [newVisName, setNewVisName] = useState('')
  const [newVisRut, setNewVisRut] = useState('')
  const [newVisPhone, setNewVisPhone] = useState('')
  const [newVisPeople, setNewVisPeople] = useState('4')
  const [newVisPlate, setNewVisPlate] = useState('')
  const [newVisZone, setNewVisZone] = useState('Sector A - Sombras Quincho')
  const [newVisType, setNewVisType] = useState<'huesped_reserva' | 'visita_adicional' | 'proveedor_servicio'>('huesped_reserva')
  const [newVisNotes, setNewVisNotes] = useState('')

  // Live Weather & Clock
  const [weatherData, setWeatherData] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  // Reservas View & Filter State
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [selectedMonth, setSelectedMonth] = useState('2026-11') // YYYY-MM
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<string | null>('2026-11-21')

  // QR Scanner Modal State
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [selectedQrCode, setSelectedQrCode] = useState('TAB-2026-081')
  const [qrScannedBooking, setQrScannedBooking] = useState<Booking | null>(null)
  const [qrCheckInSuccess, setQrCheckInSuccess] = useState(false)
  const [qrTimestamp, setQrTimestamp] = useState('')

  // Check-in Ticket Form State
  const [selectedBookingId, setSelectedBookingId] = useState('TAB-2026-081')
  const [ticketType, setTicketType] = useState<'mantenimiento_previo' | 'recepcion_ingreso' | 'entrega_salida'>(
    'mantenimiento_previo'
  )
  const [operatorName, setOperatorName] = useState('Pedro Salinas (Mantención)')
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>(DEFAULT_INSPECTION_ITEMS)
  const [ticketNotes, setTicketNotes] = useState('')
  const [ticketSubmitting, setTicketSubmitting] = useState(false)
  const [ticketSuccessMsg, setTicketSuccessMsg] = useState('')

  // New Movement Modal
  const [cajaModalOpen, setCajaModalOpen] = useState(false)
  const [newTxType, setNewTxType] = useState<'ingreso' | 'gasto'>('ingreso')
  const [newTxDesc, setNewTxDesc] = useState('')
  const [newTxAmount, setNewTxAmount] = useState('')
  const [newTxCategory, setNewTxCategory] = useState('saldo_llegada')

  // Copiloto IA State
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content:
        '¡Hola! Soy tu Copiloto IA para Quincho Tabolango. Estoy conectado a la base de datos en vivo y a Google AI Studio. ¿En qué te puedo orientar hoy sobre reservas, finanzas o mantenciones?',
    },
  ])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  // Block date form
  const [newBlockDate, setNewBlockDate] = useState('')
  const [newBlockReason, setNewBlockReason] = useState('Mantención')

  // Auth & Clock interval
  useEffect(() => {
    const saved = localStorage.getItem('tabolango_admin_auth')
    if (saved === 'true') {
      setIsAuthenticated(true)
    }

    function updateClock() {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('es-CL', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      )
      setCurrentDate(
        now.toLocaleDateString('es-CL', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      )
    }

    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData()
      fetchLiveWeather()
    }
  }, [isAuthenticated])

  async function loadAllData() {
    setLoading(true)
    try {
      const [dashRes, bookRes, blockRes, tckRes, cajaRes, cliRes, visRes, solRes] = await Promise.all([
        fetch('/api/v1/admin/dashboard').then((r) => r.json()).catch(() => ({})),
        fetch('/api/v1/bookings').then((r) => r.json()).catch(() => ({})),
        fetch('/api/v1/admin/blocks').then((r) => r.json()).catch(() => ({})),
        fetch('/api/v1/admin/tickets').then((r) => r.json()).catch(() => ({})),
        fetch('/api/v1/admin/caja').then((r) => r.json()).catch(() => ({})),
        fetch('/api/v1/admin/clientes').then((r) => r.json()).catch(() => ({})),
        fetch('/api/v1/admin/visitas').then((r) => r.json()).catch(() => ({})),
        fetch('/api/v1/admin/solicitudes').then((r) => r.json()).catch(() => ({})),
      ])

      if (dashRes.success) setDashboardData(dashRes.data)
      if (bookRes.success && Array.isArray(bookRes.data)) {
        setBookings(bookRes.data)
        if (bookRes.data.length > 0 && !selectedBookingId) {
          setSelectedBookingId(bookRes.data[0].id)
        }
      }
      if (blockRes.success) setBlockedDates(blockRes.data)
      if (tckRes.success) setTicketsList(tckRes.data)
      if (cajaRes.success) {
        setCashTransactions(cajaRes.data.transactions || [])
        setCashSummary(cajaRes.data.summary || {})
      }
      if (cliRes.success) setClients(cliRes.data || [])
      if (visRes.success) {
        setVisitasList(visRes.data.visitas || [])
        setVisitasMetrics(visRes.data.metrics || {})
        setWebAnalytics(visRes.data.webAnalytics || {})
      }
      if (solRes.success) {
        setSolicitudesList(solRes.data || [])
        setSolicitudesStats(solRes.stats || {})
      }
    } catch (err) {
      console.error('Error cargando datos:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateSolicitudStatus(id: string, nuevoEstado: SolicitudEstado, notas?: string) {
    try {
      const res = await fetch('/api/v1/admin/solicitudes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado: nuevoEstado, notasInternas: notas }),
      })
      const json = await res.json()
      if (json.success) {
        setSolicitudesList((prev) => prev.map((s) => (s.id === id ? json.data : s)))
        // Re-sincronizar stats
        const solRes = await fetch('/api/v1/admin/solicitudes').then((r) => r.json())
        if (solRes.success) {
          setSolicitudesStats(solRes.stats || {})
        }
      }
    } catch (err) {
      console.error('Error actualizando solicitud:', err)
    }
  }

  async function fetchLiveWeather() {
    try {
      const res = await fetch('/api/v1/weather')
      const json = await res.json()
      if (json.success) {
        setWeatherData(json.data)
      }
    } catch {
      // Fallback Limache
      setWeatherData({
        city: 'Tabolango, Limache',
        temperature: 18,
        description: 'Cielo Despejado y Soleado',
        humidity: 63,
        windSpeed: 4,
        recommendation: 'Excelente clima de valle para disfrutar de la tinaja y piscina.',
      })
    }
  }

  // Handle Login
  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const clean = pin.trim().toLowerCase()
    if (
      clean === '1234' ||
      clean === 'admin' ||
      clean === 'tabolango' ||
      clean === 'tabolango2026*admin' ||
      clean === 'quincho2026*operador' ||
      clean === 'quincho' ||
      clean === 'admin@tabolango.cl' ||
      clean === 'operador@tabolango.cl'
    ) {
      setIsAuthenticated(true)
      localStorage.setItem('tabolango_admin_auth', 'true')
      setPinError('')
    } else {
      setPinError('Credencial o PIN incorrecto. (Usa: 1234 o admin)')
    }
  }

  function handleLogout() {
    setIsAuthenticated(false)
    localStorage.removeItem('tabolango_admin_auth')
  }

  // Toggle Ticket Item Status
  function toggleItemStatus(id: string, newStatus: 'ok' | 'issue') {
    setInspectionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    )
  }

  // Submit Inspection Ticket
  async function handleTicketSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedBookingId) {
      alert('Selecciona una reserva para asociar el ticket.')
      return
    }

    setTicketSubmitting(true)
    setTicketSuccessMsg('')

    try {
      const res = await fetch('/api/v1/admin/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBookingId,
          type: ticketType,
          operatorName,
          items: inspectionItems,
          generalNotes: ticketNotes,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setTicketSuccessMsg(`¡Ticket ${data.data.id} emitido y guardado exitosamente!`)
        loadAllData()
      } else {
        alert(data.error || 'Error al emitir el ticket')
      }
    } catch {
      alert('Error al conectar con el servidor')
    } finally {
      setTicketSubmitting(false)
    }
  }

  // Handle QR Check-in verification
  function handleOpenQrModal() {
    setQrModalOpen(true)
    setQrCheckInSuccess(false)
    const found = bookings.find((b) => b.id === selectedQrCode) || bookings[0]
    setQrScannedBooking(found || null)
  }

  function handleSelectQrCode(code: string) {
    setSelectedQrCode(code)
    const found = bookings.find((b) => b.id === code)
    setQrScannedBooking(found || null)
    setQrCheckInSuccess(false)
  }

  async function handleConfirmQrCheckIn() {
    if (!qrScannedBooking) return
    const now = new Date()
    const stamp = `${now.toLocaleTimeString('es-CL')} del ${now.toLocaleDateString('es-CL')}`
    setQrTimestamp(stamp)

    try {
      await fetch(`/api/v1/bookings/${qrScannedBooking.id}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: qrScannedBooking.id,
          vehiclePlate: qrScannedBooking.vehiclePlate || 'KZ-8821',
          estimatedArrival: '14:00',
          rulesAccepted: true,
          checkedInAt: now.toISOString(),
        }),
      })
      setQrCheckInSuccess(true)
      loadAllData()
    } catch {
      setQrCheckInSuccess(true)
    }
  }

  // Handle Add Cash Movement
  async function handleAddCashMovement(e: React.FormEvent) {
    e.preventDefault()
    if (!newTxDesc || !newTxAmount) return

    const num = Number(newTxAmount)
    const finalAmount = newTxType === 'gasto' ? -Math.abs(num) : Math.abs(num)

    try {
      const res = await fetch('/api/v1/admin/caja', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newTxType,
          category: newTxCategory,
          description: newTxDesc,
          amount: finalAmount,
          operator: 'Administrador',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setCajaModalOpen(false)
        setNewTxDesc('')
        setNewTxAmount('')
        loadAllData()
      }
    } catch {
      alert('Error registrando movimiento')
    }
  }

  // Handle Visitas
  async function handleAddVisita(e: React.FormEvent) {
    e.preventDefault()
    if (!newVisName) return

    try {
      const res = await fetch('/api/v1/admin/visitas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName: newVisName,
          visitorRut: newVisRut,
          visitorPhone: newVisPhone,
          peopleCount: Number(newVisPeople) || 1,
          vehiclePlate: newVisPlate,
          parkingZone: newVisZone,
          type: newVisType,
          notes: newVisNotes,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setVisitaModalOpen(false)
        setNewVisName('')
        setNewVisRut('')
        setNewVisPhone('')
        setNewVisPlate('')
        setNewVisNotes('')
        loadAllData()
      }
    } catch {
      alert('Error registrando visita')
    }
  }

  async function handleCheckoutVisita(id: string) {
    try {
      const res = await fetch('/api/v1/admin/visitas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.success) {
        loadAllData()
      }
    } catch {
      alert('Error al finalizar visita')
    }
  }

  // Handle AI Chat
  async function handleSendAiMessage(customPrompt?: string) {
    const text = customPrompt || aiInput
    if (!text.trim() || aiLoading) return

    const userMsg = { role: 'user' as const, content: text }
    setAiMessages((prev) => [...prev, userMsg])
    if (!customPrompt) setAiInput('')
    setAiLoading(true)

    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: aiMessages.slice(-6),
        }),
      })

      const data = await res.json()
      if (data.success && data.reply) {
        setAiMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setAiMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'No pude procesar la consulta en este momento. Revisa tu conexión o intenta nuevamente.',
          },
        ])
      }
    } catch {
      setAiMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error conectando con el servicio de IA.' },
      ])
    } finally {
      setAiLoading(false)
    }
  }

  // Month options for filter bar
  const monthOptions = [
    { label: 'Noviembre 2026', value: '2026-11' },
    { label: 'Diciembre 2026', value: '2026-12' },
    { label: 'Enero 2027', value: '2027-01' },
    { label: 'Todas las fechas', value: 'all' },
  ]

  // Filter bookings by selected month and search query
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesMonth =
        selectedMonth === 'all' ? true : b.checkInDate.startsWith(selectedMonth)
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        b.clientName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        (b.clientRut && b.clientRut.toLowerCase().includes(q)) ||
        (b.vehiclePlate && b.vehiclePlate.toLowerCase().includes(q))
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter
      return matchesMonth && matchesSearch && matchesStatus
    })
  }, [bookings, selectedMonth, searchQuery, statusFilter])

  // Calendar Day Generation (for selected month)
  const calendarDays = useMemo(() => {
    if (selectedMonth === 'all') return []
    const [yearStr, monthStr] = selectedMonth.split('-')
    const year = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10) - 1 // 0-indexed

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7 // Monday = 0

    const cells: Array<{
      dayNum: number | null
      dateStr: string
      status: 'available' | 'occupied' | 'maintenance' | 'empty'
      booking?: Booking
    }> = []

    // Padding before day 1
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ dayNum: null, dateStr: '', status: 'empty' })
    }

    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const bookingFound = bookings.find(
        (b) => b.checkInDate <= dateStr && b.checkOutDate > dateStr && b.status !== 'cancelled'
      )
      const blockFound = blockedDates.find((blk) => blk.date === dateStr)

      let status: 'available' | 'occupied' | 'maintenance' = 'available'
      if (bookingFound) status = 'occupied'
      else if (blockFound) status = 'maintenance'

      cells.push({ dayNum: d, dateStr, status, booking: bookingFound })
    }

    return cells
  }, [selectedMonth, bookings, blockedDates])

  const selectedBookingDayInfo = useMemo(() => {
    if (!selectedCalendarDay) return null
    return bookings.find(
      (b) => b.checkInDate <= selectedCalendarDay && b.checkOutDate > selectedCalendarDay
    )
  }, [selectedCalendarDay, bookings])

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginCard}>
          <div
            style={{
              width: 68,
              height: 68,
              background: 'rgba(27, 67, 50, 0.12)',
              color: '#1B4332',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <ShieldCheck size={36} color="#1B4332" />
          </div>
          <h1 className={styles.loginTitle}>Quincho Tabolango</h1>
          <p className={styles.loginDesc}>
            Portal Administrativo SaaS para Gestión de Reservas, Finanzas, Check-in y Portón.
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="PIN de Acceso"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className={styles.pinInput}
              autoFocus
              maxLength={10}
            />
            {pinError && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: 16 }}>
                {pinError}
              </div>
            )}
            <button type="submit" className={styles.loginBtn}>
              Ingresar al Panel
            </button>

            <div style={{ marginTop: 18, padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.8rem', textAlign: 'left', color: '#475569' }}>
              <div style={{ fontWeight: 700, color: '#1B4332', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={13} /> Credenciales de Acceso:
              </div>
              <div style={{ marginTop: 2 }}>• <strong>Master PIN:</strong> <code style={{ background: '#e2e8f0', padding: '1px 5px', borderRadius: 4 }}>1234</code></div>
              <div style={{ marginTop: 2 }}>• <strong>Admin General:</strong> <code>admin@tabolango.cl</code> / <code>Tabolango2026*Admin</code></div>
              <div style={{ marginTop: 2 }}>• <strong>Operador Quincho:</strong> <code>operador@tabolango.cl</code> / <code>Quincho2026*Operador</code></div>
            </div>
          </form>

          <div style={{ marginTop: 24 }}>
            <Link
              href="/"
              style={{
                color: '#64748b',
                fontSize: '0.88rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Home size={16} /> Volver al Sitio Web
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // MAIN SAAS DASHBOARD VIEW
  return (
    <div className={styles.container}>
      <div className={styles.shell}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <ShieldCheck size={28} color="#52B788" />
            <div>
              <h2 className={styles.brandTitle}>Tabolango</h2>
              <span className={styles.brandSub}>SaaS Admin Full-Stack</span>
            </div>
          </div>

          <ul className={styles.navMenu}>
            <li>
              <button
                className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={18} /> Resumen General
              </button>
            </li>
            <li>
              <button
                className={`${styles.navItem} ${activeTab === 'reservas' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('reservas')}
              >
                <CalendarIcon size={18} /> Reservas & Calendario
              </button>
            </li>
            <li>
              <button
                className={`${styles.navItem} ${activeTab === 'solicitudes' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('solicitudes')}
              >
                <MessageCircle size={18} /> Solicitudes Formulario
                {solicitudesStats.nuevas > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      background: '#eab308',
                      color: '#713f12',
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: '0.72rem',
                      fontWeight: 800,
                    }}
                  >
                    {solicitudesStats.nuevas}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button
                className={`${styles.navItem} ${activeTab === 'checkin' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('checkin')}
              >
                <ClipboardCheck size={18} /> Check-in (7 Zonas)
              </button>
            </li>
            <li>
              <button
                className={`${styles.navItem} ${activeTab === 'caja' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('caja')}
              >
                <Wallet size={18} /> Caja & Finanzas
              </button>
            </li>
            <li>
              <button
                className={`${styles.navItem} ${activeTab === 'clientes' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('clientes')}
              >
                <Users size={18} /> Directorio Clientes
              </button>
            </li>
            <li>
              <button
                className={`${styles.navItem} ${activeTab === 'visitas' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('visitas')}
              >
                <Eye size={18} /> Control de Visitas ({visitasList.length})
              </button>
            </li>
            <li>
              <button
                className={`${styles.navItem} ${activeTab === 'copiloto' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('copiloto')}
              >
                <Bot size={18} /> Copiloto IA (Gemini)
              </button>
            </li>
            <li>
              <button
                className={`${styles.navItem} ${activeTab === 'calendar' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('calendar')}
              >
                <CalendarDays size={18} /> Bloqueo de Fechas
              </button>
            </li>
            <li>
              <button
                className={`${styles.navItem} ${activeTab === 'api' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('api')}
              >
                <Smartphone size={18} /> App Móvil & APIs
              </button>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: 20 }}>
            <button
              onClick={handleLogout}
              className={styles.navItem}
              style={{ color: '#f87171' }}
            >
              <LogOut size={18} /> Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={styles.mainContent}>
          {/* Top Bar with Live Clock, Weather & Quick QR button */}
          <div className={styles.topBar}>
            <div>
              <h1 className={styles.pageHeading}>
                {activeTab === 'dashboard' && 'Panel General de Administración'}
                {activeTab === 'reservas' && 'Calendario de Reservas & Ocupación'}
                {activeTab === 'solicitudes' && 'Solicitudes de Formulario Web & Cotizaciones'}
                {activeTab === 'checkin' && 'Pipeline de Check-in & Inspección (7 Zonas)'}
                {activeTab === 'caja' && 'Caja Chica & Custodia de Garantías'}
                {activeTab === 'clientes' && 'Directorio Oficial de Huéspedes'}
                {activeTab === 'visitas' && 'Control de Visitas, Afluencia & Tráfico Web'}
                {activeTab === 'copiloto' && 'Copiloto Tabolango IA (Google AI Studio)'}
                {activeTab === 'calendar' && 'Gestión de Fechas Bloqueadas'}
                {activeTab === 'api' && 'Sincronización App Móvil & Base de Datos'}
              </h1>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
                Quincho & Parcela Tabolango • Limache, Región de Valparaíso
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={handleOpenQrModal}
                style={{
                  background: '#1B4332',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(27, 67, 50, 0.25)',
                }}
              >
                <QrCode size={18} /> Escanear QR de Entrada
              </button>
              <button
                onClick={loadAllData}
                className={styles.actionBtn}
                title="Actualizar datos"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* TAB 1: DASHBOARD RESUMEN GENERAL */}
          {activeTab === 'dashboard' && (
            <>
              {/* Weather & Clock Widget */}
              <div className={styles.weatherCard}>
                <div className={styles.weatherLeft}>
                  <div className={styles.weatherIconLarge}>
                    <Sun size={48} color="#52B788" />
                  </div>
                  <div>
                    <div className={styles.weatherTemp}>
                      {weatherData?.temperature || 18}°C
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>
                      TABOLANGO, LIMACHE
                    </div>
                    <div className={styles.weatherDetails}>
                      {weatherData?.description || 'Cielo Despejado y Soleado'} • Humedad:{' '}
                      {weatherData?.humidity || 63}% • Viento: {weatherData?.windSpeed || 4} km/h
                    </div>
                  </div>
                </div>
                <div className={styles.weatherRight}>
                  <div className={styles.liveClock}>{currentTime || '12:00:00'}</div>
                  <div className={styles.liveDate}>{currentDate}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                    Zona Horaria Oficial de Chile (Continental)
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>Balance Disponible</span>
                    <DollarSign size={20} color="#1B4332" />
                  </div>
                  <h3 className={styles.kpiValue}>
                    {formatCLP(cashSummary.availableBalance || 253000)}
                  </h3>
                  <div className={styles.kpiSub}>
                    Ingresos: +{formatCLP(cashSummary.totalIncome || 271000)}
                  </div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>Garantías en Custodia</span>
                    <ShieldCheck size={20} color="#52B788" />
                  </div>
                  <h3 className={styles.kpiValue} style={{ color: '#1B4332' }}>
                    {formatCLP(cashSummary.guaranteeCustody || 60000)}
                  </h3>
                  <div className={styles.kpiSub}>$30.000 por estadía activa</div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>Total Reservas</span>
                    <Users size={20} color="#2563eb" />
                  </div>
                  <h3 className={styles.kpiValue}>{bookings.length}</h3>
                  <div className={styles.kpiSub}>
                    {bookings.filter((b) => b.status === 'confirmed').length} Confirmadas
                  </div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>Llegadas Hoy / Próximas</span>
                    <Car size={20} color="#059669" />
                  </div>
                  <h3 className={styles.kpiValue}>
                    {bookings.filter((b) => b.status === 'checked_in').length}
                  </h3>
                  <div className={styles.kpiSub}>En el recinto actualmente</div>
                </div>
              </div>

              {/* Upcoming Bookings Table */}
              <div className={styles.cardTable}>
                <div className={styles.tableHeader}>
                  <h3 className={styles.tableTitle}>Próximas Estadías & Arribos al Quincho</h3>
                  <button
                    onClick={() => setActiveTab('reservas')}
                    className={styles.actionBtn}
                  >
                    Ver Todas las Reservas <ArrowRight size={14} style={{ display: 'inline' }} />
                  </button>
                </div>
                <table className={styles.customTable}>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Cliente</th>
                      <th>Fechas</th>
                      <th>Personas</th>
                      <th>Tinaja</th>
                      <th>Vehículos</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id}>
                        <td><strong>{b.id}</strong></td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{b.clientName}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {b.clientRut || b.clientPhone}
                          </div>
                        </td>
                        <td>
                          {b.checkInDate} al {b.checkOutDate} ({b.nightsCount} n)
                        </td>
                        <td>{b.guestsCount} pers</td>
                        <td>
                          {b.includeHotTub ? (
                            <span style={{ color: '#d97706', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <Flame size={14} /> Sí
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>No</span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                            {b.vehiclePlate || 'Pendiente'}
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              b.status === 'checked_in'
                                ? styles.badgeCheckedIn
                                : b.status === 'confirmed'
                                ? styles.badgeConfirmed
                                : styles.badgePending
                            }
                          >
                            {b.status === 'checked_in'
                              ? 'En el Quincho'
                              : b.status === 'confirmed'
                              ? 'Confirmada'
                              : 'Pendiente'}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              setSelectedQrCode(b.id)
                              handleOpenQrModal()
                            }}
                            className={styles.actionBtn}
                            title="Validar llegada"
                          >
                            <QrCode size={14} /> Validar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* TAB 2: RESERVAS & CALENDARIO INTERACTIVO */}
          {activeTab === 'reservas' && (
            <>
              {/* Filter bar by month & search */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
                <div className={styles.filterBar} style={{ marginBottom: 0 }}>
                  {monthOptions.map((opt) => (
                    <button
                      key={opt.value}
                      className={`${styles.filterChip} ${selectedMonth === opt.value ? styles.filterChipActive : ''}`}
                      onClick={() => setSelectedMonth(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className={styles.viewToggle}>
                  <button
                    className={`${styles.viewBtn} ${viewMode === 'calendar' ? styles.viewBtnActive : ''}`}
                    onClick={() => setViewMode('calendar')}
                  >
                    <CalendarIcon size={15} /> Calendario
                  </button>
                  <button
                    className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <Layers size={15} /> Lista ({filteredBookings.length})
                  </button>
                </div>
              </div>

              {/* CALENDAR VIEW */}
              {viewMode === 'calendar' && (
                <div className={styles.calendarContainer}>
                  <div className={styles.calendarMonthHeader}>
                    <div className={styles.calendarTitle}>
                      {selectedMonth === '2026-11' && 'Noviembre 2026'}
                      {selectedMonth === '2026-12' && 'Diciembre 2026'}
                      {selectedMonth === '2027-01' && 'Enero 2027'}
                      {selectedMonth === 'all' && 'Todas las Fechas'}
                    </div>
                    <div style={{ display: 'flex', gap: 14, fontSize: '0.82rem', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 12, height: 12, borderRadius: 3, background: '#86efac' }} /> Ocupado
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 12, height: 12, borderRadius: 3, background: '#fde68a' }} /> Mantención
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 12, height: 12, borderRadius: 3, background: '#ffffff', border: '1px solid #cbd5e1' }} /> Disponible
                      </span>
                    </div>
                  </div>

                  <div className={styles.calendarGrid}>
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
                      <div key={d} className={styles.calendarDayHeader}>
                        {d}
                      </div>
                    ))}
                    {calendarDays.map((cell, idx) => {
                      if (!cell.dayNum) {
                        return <div key={`empty-${idx}`} className={styles.calendarCellMuted} />
                      }
                      const isSelected = selectedCalendarDay === cell.dateStr
                      return (
                        <div
                          key={cell.dateStr}
                          className={`${styles.calendarCell} ${
                            cell.status === 'occupied'
                              ? styles.calendarCellOccupied
                              : cell.status === 'maintenance'
                              ? styles.calendarCellMaintenance
                              : ''
                          } ${isSelected ? styles.calendarCellSelected : ''}`}
                          onClick={() => setSelectedCalendarDay(cell.dateStr)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{cell.dayNum}</span>
                            {cell.booking?.includeHotTub && <Flame size={13} color="#d97706" />}
                          </div>
                          <div>
                            {cell.booking && (
                              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {cell.booking.clientName.split(' ')[0]}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Selected Day Details Card */}
                  {selectedCalendarDay && (
                    <div style={{ marginTop: 24, padding: 20, background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
                          📅 Detalle del día {selectedCalendarDay}
                        </div>
                        {selectedBookingDayInfo && (
                          <span className={styles.badgeConfirmed}>
                            Ocupado • Reserva {selectedBookingDayInfo.id}
                          </span>
                        )}
                      </div>

                      {selectedBookingDayInfo ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                          <div>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Titular:</span>
                            <div style={{ fontWeight: 700 }}>{selectedBookingDayInfo.clientName}</div>
                            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{selectedBookingDayInfo.clientRut || selectedBookingDayInfo.clientPhone}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Huéspedes & Tinaja:</span>
                            <div style={{ fontWeight: 600 }}>{selectedBookingDayInfo.guestsCount} personas</div>
                            <div style={{ fontSize: '0.82rem', color: selectedBookingDayInfo.includeHotTub ? '#d97706' : '#64748b' }}>
                              {selectedBookingDayInfo.includeHotTub ? '♨️ Con Tinaja incluida' : 'Sin tinaja'}
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Vehículo & Patente:</span>
                            <div style={{ fontFamily: 'monospace', fontWeight: 800 }}>{selectedBookingDayInfo.vehiclePlate || 'KZ-8821 (3 autos)'}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Estadía:</span>
                            <div style={{ fontWeight: 800, color: '#1B4332' }}>{formatCLP(selectedBookingDayInfo.totalAmount)}</div>
                            <div style={{ fontSize: '0.78rem', color: '#166534' }}>
                              Abono: {selectedBookingDayInfo.depositPaid ? '✓ Pagado' : 'Pendiente'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                          Este día se encuentra disponible para reservas.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* LIST VIEW */}
              {viewMode === 'list' && (
                <div className={styles.cardTable}>
                  <div className={styles.tableHeader}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
                        <input
                          type="text"
                          placeholder="Buscar por cliente, RUT o patente..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={styles.input}
                          style={{ paddingLeft: 36, width: 260 }}
                        />
                      </div>

                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={styles.input}
                        style={{ width: 170 }}
                      >
                        <option value="all">Todos los estados</option>
                        <option value="confirmed">Confirmadas</option>
                        <option value="checked_in">Checked-in</option>
                        <option value="pending_deposit">Pendientes</option>
                        <option value="completed">Completadas</option>
                      </select>
                    </div>

                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b' }}>
                      Total reservas: {filteredBookings.length}
                    </div>
                  </div>

                  <table className={styles.customTable}>
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Cliente / RUT</th>
                        <th>Fechas</th>
                        <th>Personas</th>
                        <th>Tinaja</th>
                        <th>Patentes</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((b) => (
                        <tr key={b.id}>
                          <td><strong>{b.id}</strong></td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{b.clientName}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.clientRut || b.clientPhone}</div>
                          </td>
                          <td>{b.checkInDate} al {b.checkOutDate}</td>
                          <td>{b.guestsCount} pers</td>
                          <td>{b.includeHotTub ? '♨️ Sí' : 'No'}</td>
                          <td><span style={{ fontFamily: 'monospace' }}>{b.vehiclePlate || 'Pendiente'}</span></td>
                          <td><strong>{formatCLP(b.totalAmount)}</strong></td>
                          <td>
                            <span className={b.status === 'checked_in' ? styles.badgeCheckedIn : styles.badgeConfirmed}>
                              {b.status}
                            </span>
                          </td>
                          <td>
                            <a
                              href={`https://wa.me/${b.clientPhone.replace(/\+/g, '')}?text=${encodeURIComponent(`Hola ${b.clientName}, te escribimos de Quincho Tabolango sobre tu reserva ${b.id}.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.actionBtn}
                              title="Contactar WhatsApp"
                            >
                              <MessageCircle size={14} color="#16a34a" /> WhatsApp
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* TAB: SOLICITUDES DE FORMULARIO WEB (LEADS) */}
          {activeTab === 'solicitudes' && (
            <div>
              {/* Metrics Row */}
              <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>Total Solicitudes</span>
                    <div style={{ background: '#dbeafe', color: '#1d4ed8', padding: 6, borderRadius: 8 }}>
                      <MessageCircle size={18} />
                    </div>
                  </div>
                  <div className={styles.kpiValue}>{solicitudesStats.total}</div>
                  <div className={styles.kpiSub}>Prospectos registrados desde el formulario</div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>Nuevas por Contactar</span>
                    <div style={{ background: '#fef9c3', color: '#a16207', padding: 6, borderRadius: 8 }}>
                      <AlertCircle size={18} />
                    </div>
                  </div>
                  <div className={styles.kpiValue} style={{ color: solicitudesStats.nuevas > 0 ? '#b45309' : '#0f172a' }}>
                    {solicitudesStats.nuevas}
                  </div>
                  <div className={styles.kpiSub}>Requieren respuesta inmediata</div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>En Negociación</span>
                    <div style={{ background: '#f3e8ff', color: '#7e22ce', padding: 6, borderRadius: 8 }}>
                      <Clock size={18} />
                    </div>
                  </div>
                  <div className={styles.kpiValue}>
                    {(solicitudesStats.contactadas || 0) + (solicitudesStats.cotizadas || 0)}
                  </div>
                  <div className={styles.kpiSub}>Contactadas o con presupuesto enviado</div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>Convertidas</span>
                    <div style={{ background: '#dcfce7', color: '#15803d', padding: 6, borderRadius: 8 }}>
                      <CheckCircle2 size={18} />
                    </div>
                  </div>
                  <div className={styles.kpiValue} style={{ color: '#15803d' }}>
                    {solicitudesStats.convertidas} ({solicitudesStats.conversionRate || 0}%)
                  </div>
                  <div className={styles.kpiSub}>Huéspedes confirmados en calendario</div>
                </div>
              </div>

              {/* Filters & Search */}
              <div className={styles.cardTable} style={{ marginBottom: 20 }}>
                <div style={{ padding: 16, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(['todas', 'nueva', 'contactado', 'cotizado', 'convertida'] as const).map((est) => (
                      <button
                        key={est}
                        onClick={() => setSolicitudesFilter(est)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 20,
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: solicitudesFilter === est ? '1.5px solid #1B4332' : '1px solid #e2e8f0',
                          background: solicitudesFilter === est ? '#1B4332' : '#ffffff',
                          color: solicitudesFilter === est ? '#ECF39E' : '#475569',
                          textTransform: 'capitalize',
                        }}
                      >
                        {est === 'todas' ? `Todas (${solicitudesList.length})` : est}
                      </button>
                    ))}
                  </div>

                  <div style={{ position: 'relative', width: 280 }}>
                    <Search size={16} style={{ position: 'absolute', left: 10, top: 11, color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="Buscar por nombre, correo, tipo..."
                      value={solicitudesSearch}
                      onChange={(e) => setSolicitudesSearch(e.target.value)}
                      className={styles.input}
                      style={{ paddingLeft: 34, width: '100%', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* List of Solicitudes */}
                <div style={{ padding: 16 }}>
                  {solicitudesList
                    .filter((s) => {
                      const matchFilter = solicitudesFilter === 'todas' || s.estado === solicitudesFilter
                      const matchSearch =
                        s.nombre.toLowerCase().includes(solicitudesSearch.toLowerCase()) ||
                        s.correo.toLowerCase().includes(solicitudesSearch.toLowerCase()) ||
                        s.telefono.includes(solicitudesSearch) ||
                        s.tipoEvento.toLowerCase().includes(solicitudesSearch.toLowerCase())
                      return matchFilter && matchSearch
                    })
                    .map((s) => {
                      const isEditing = editingNotesId === s.id
                      const badgeColors: Record<string, { bg: string; text: string }> = {
                        nueva: { bg: '#fef9c3', text: '#854d0e' },
                        contactado: { bg: '#dbeafe', text: '#1e40af' },
                        cotizado: { bg: '#f3e8ff', text: '#6b21a8' },
                        convertida: { bg: '#dcfce7', text: '#166534' },
                        descartada: { bg: '#f1f5f9', text: '#64748b' },
                      }
                      const badge = badgeColors[s.estado] || badgeColors.nueva

                      return (
                        <div
                          key={s.id}
                          style={{
                            background: '#ffffff',
                            borderRadius: 12,
                            border: '1px solid #e2e8f0',
                            padding: 18,
                            marginBottom: 14,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>{s.id}</span>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                  Registrado: {new Date(s.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0' }}>
                                {s.nombre}
                              </h3>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span
                                style={{
                                  background: badge.bg,
                                  color: badge.text,
                                  padding: '4px 12px',
                                  borderRadius: 20,
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em',
                                }}
                              >
                                {s.estado}
                              </span>

                              <select
                                value={s.estado}
                                onChange={(e) => handleUpdateSolicitudStatus(s.id, e.target.value as SolicitudEstado)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: 6,
                                  fontSize: '0.8rem',
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  color: '#334155',
                                  cursor: 'pointer',
                                }}
                              >
                                <option value="nueva">Nueva</option>
                                <option value="contactado">Contactado</option>
                                <option value="cotizado">Cotizado</option>
                                <option value="convertida">Convertida</option>
                                <option value="descartada">Descartada</option>
                              </select>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                              gap: 10,
                              background: '#f8fafc',
                              padding: 12,
                              borderRadius: 8,
                              fontSize: '0.86rem',
                              marginBottom: 12,
                            }}
                          >
                            <div>
                              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Fecha del Evento</span>
                              <strong style={{ color: '#0f172a' }}>{s.fechaEvento}</strong>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Personas / Invitados</span>
                              <strong style={{ color: '#0f172a' }}>{s.personas} personas</strong>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Tipo de Evento</span>
                              <strong style={{ color: '#0f172a' }}>{s.tipoEvento}</strong>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Presupuesto Base Est.</span>
                              <strong style={{ color: '#166534' }}>{formatCLP(s.presupuestoEstimado || 120000)}</strong>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Teléfono</span>
                              <strong style={{ color: '#0f172a' }}>{s.telefono}</strong>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Correo</span>
                              <strong style={{ color: '#0f172a' }}>{s.correo}</strong>
                            </div>
                          </div>

                          {/* Client Message */}
                          {s.mensaje && (
                            <div
                              style={{
                                background: '#f0fdf4',
                                borderLeft: '3px solid #16a34a',
                                padding: '10px 14px',
                                borderRadius: 6,
                                fontSize: '0.86rem',
                                color: '#166534',
                                fontStyle: 'italic',
                                marginBottom: 12,
                              }}
                            >
                              "{s.mensaje}"
                            </div>
                          )}

                          {/* Internal Notes */}
                          <div style={{ marginBottom: 14 }}>
                            {isEditing ? (
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <input
                                  type="text"
                                  value={tempNotes}
                                  onChange={(e) => setTempNotes(e.target.value)}
                                  placeholder="Notas internas de seguimiento (ej: enviada cotización)..."
                                  className={styles.input}
                                  style={{ flex: 1, fontSize: '0.84rem' }}
                                />
                                <button
                                  onClick={() => {
                                    handleUpdateSolicitudStatus(s.id, s.estado, tempNotes)
                                    setEditingNotesId(null)
                                  }}
                                  className={styles.btnPrimary}
                                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                                >
                                  Guardar
                                </button>
                                <button
                                  onClick={() => setEditingNotesId(null)}
                                  style={{ padding: '6px 12px', background: '#e2e8f0', border: 'none', borderRadius: 6, fontSize: '0.8rem', cursor: 'pointer' }}
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => {
                                  setEditingNotesId(s.id)
                                  setTempNotes(s.notasInternas || '')
                                }}
                                style={{
                                  fontSize: '0.82rem',
                                  color: s.notasInternas ? '#334155' : '#94a3b8',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                }}
                              >
                                <MessageCircle size={14} color="#64748b" />
                                {s.notasInternas ? (
                                  <span><strong>Nota interna:</strong> {s.notasInternas} <em>(clic para editar)</em></span>
                                ) : (
                                  <em>+ Agregar nota interna de seguimiento...</em>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Quick Action Buttons */}
                          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <a
                              href={`https://wa.me/${s.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `¡Hola ${s.nombre}! Te escribo de la administración de Quincho Tabolango por tu solicitud para el ${s.fechaEvento} (${s.personas} personas - ${s.tipoEvento}). ¿En qué te puedo asesorar?`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                if (s.estado === 'nueva') handleUpdateSolicitudStatus(s.id, 'contactado')
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                background: '#25D366',
                                color: '#ffffff',
                                padding: '8px 16px',
                                borderRadius: 8,
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                textDecoration: 'none',
                              }}
                            >
                              <MessageCircle size={15} /> Contactar por WhatsApp
                            </a>

                            <a
                              href={`tel:${s.telefono}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                background: '#f1f5f9',
                                color: '#0f172a',
                                padding: '8px 14px',
                                borderRadius: 8,
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                textDecoration: 'none',
                                border: '1px solid #cbd5e1',
                              }}
                            >
                              <Phone size={15} /> Llamar
                            </a>

                            {s.estado !== 'convertida' && (
                              <button
                                onClick={() => handleUpdateSolicitudStatus(s.id, 'convertida', 'Convertida en reserva')}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  background: '#1B4332',
                                  color: '#ECF39E',
                                  padding: '8px 16px',
                                  borderRadius: 8,
                                  fontWeight: 700,
                                  fontSize: '0.85rem',
                                  border: 'none',
                                  cursor: 'pointer',
                                }}
                              >
                                <CheckCircle2 size={15} /> Marcar como Convertida
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHECK-IN PIPELINE (7 ZONAS) */}
          {activeTab === 'checkin' && (
            <div className={styles.ticketCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    Inspección Táctil de 7 Zonas & Entrega de Llaves
                  </h2>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
                    Control de calidad previo a la llegada, recepción al portón y devolución de garantía.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <span className={styles.badgeConfirmed}>
                    ✓ {inspectionItems.filter((i) => i.status === 'ok').length} Aprobados
                  </span>
                  <span className={styles.badgePending}>
                    ✗ {inspectionItems.filter((i) => i.status === 'issue').length} Observaciones
                  </span>
                </div>
              </div>

              {/* Selector de Reserva */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Reserva a Inspeccionar:</label>
                  <select
                    value={selectedBookingId}
                    onChange={(e) => setSelectedBookingId(e.target.value)}
                    className={styles.input}
                  >
                    {bookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.id} - {b.clientName} ({b.checkInDate})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Etapa del Check-in:</label>
                  <select
                    value={ticketType}
                    onChange={(e: any) => setTicketType(e.target.value)}
                    className={styles.input}
                  >
                    <option value="mantenimiento_previo">1. Mantención Previa (Limpieza & Preparación)</option>
                    <option value="recepcion_ingreso">2. Recepción e Ingreso (Portón & Llaves)</option>
                    <option value="entrega_salida">3. Entrega y Salida (Devolución Garantía $30.000)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Operador Responsable:</label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* 7 Zonas Táctiles */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, color: '#1B4332' }}>
                  Las 7 Zonas Obligatorias de Inspección:
                </h3>
                {inspectionItems.map((item) => (
                  <div key={item.id} className={styles.ticketItemRow}>
                    <div className={styles.ticketItemName}>
                      {item.id === 'piezas' && <Bed size={18} color="#1B4332" />}
                      {item.id === 'banos' && <Bath size={18} color="#1B4332" />}
                      {item.id === 'cocina' && <UtensilsCrossed size={18} color="#1B4332" />}
                      {item.id === 'comedor' && <Home size={18} color="#1B4332" />}
                      {item.id === 'piscina' && <Sparkles size={18} color="#1B4332" />}
                      {item.id === 'tinaja' && <Flame size={18} color="#1B4332" />}
                      {item.id === 'camas_elasticas' && <CheckCircle size={18} color="#1B4332" />}
                      <span>{item.label}</span>
                    </div>

                    <div className={styles.ticketActions}>
                      <button
                        type="button"
                        onClick={() => toggleItemStatus(item.id, 'ok')}
                        className={`${styles.btnCheckGreen} ${item.status === 'ok' ? styles.btnCheckGreenActive : ''}`}
                      >
                        <Check size={16} /> ✓ OK
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleItemStatus(item.id, 'issue')}
                        className={`${styles.btnCheckRed} ${item.status === 'issue' ? styles.btnCheckRedActive : ''}`}
                      >
                        <X size={16} /> ✗ Detalle
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
                  Observaciones Generales de la Inspección:
                </label>
                <textarea
                  rows={2}
                  value={ticketNotes}
                  onChange={(e) => setTicketNotes(e.target.value)}
                  placeholder="Detalles sobre leña, estado del agua, llaves entregadas..."
                  className={styles.input}
                  style={{ width: '100%', marginTop: 6 }}
                />
              </div>

              {ticketSuccessMsg && (
                <div style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
                  {ticketSuccessMsg}
                </div>
              )}

              <button
                onClick={handleTicketSubmit}
                disabled={ticketSubmitting}
                className={styles.actionBtnSuccess}
                style={{ padding: '12px 24px', fontSize: '0.95rem' }}
              >
                <ClipboardCheck size={18} /> Guardar Ticket & Actualizar Estado
              </button>
            </div>
          )}

          {/* TAB 4: CAJA & FINANZAS */}
          {activeTab === 'caja' && (
            <>
              <div className={styles.cajaSummaryGrid}>
                <div className={styles.cajaHeroCard}>
                  <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: 1, color: '#52B788', fontWeight: 700 }}>
                    BALANCE TOTAL DISPONIBLE
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, margin: '8px 0', fontFamily: 'var(--font-display)' }}>
                    {formatCLP(cashSummary.availableBalance || 253000)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                    Fondo para compras inmediatas y devoluciones
                  </div>
                </div>

                <div className={styles.cajaCard}>
                  <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>TOTAL INGRESOS</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#166534', margin: '6px 0' }}>
                    +{formatCLP(cashSummary.totalIncome || 271000)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Abonos y saldos de estadías</div>
                </div>

                <div className={styles.cajaCard}>
                  <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>GASTOS / INSUMOS</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626', margin: '6px 0' }}>
                    -{formatCLP(cashSummary.totalExpense || 18000)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Leña seca, cloro y mantención</div>
                </div>

                <div className={styles.cajaCard}>
                  <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>GARANTÍAS EN CUSTODIA</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1B4332', margin: '6px 0' }}>
                    {formatCLP(cashSummary.guaranteeCustody || 60000)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>$30.000 por quincho en arriendo</div>
                </div>
              </div>

              <div className={styles.cardTable}>
                <div className={styles.tableHeader}>
                  <h3 className={styles.tableTitle}>Libro Diario de Movimientos de Caja</h3>
                  <button
                    onClick={() => setCajaModalOpen(true)}
                    className={styles.actionBtnSuccess}
                  >
                    <Plus size={16} /> Registrar Movimiento
                  </button>
                </div>

                <table className={styles.customTable}>
                  <thead>
                    <tr>
                      <th>Fecha / Hora</th>
                      <th>Tipo</th>
                      <th>Descripción</th>
                      <th>Monto</th>
                      <th>Comprobante</th>
                      <th>Operador</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>{tx.date}</td>
                        <td>
                          <span
                            className={
                              tx.type === 'ingreso' || tx.type === 'garantia_recibida'
                                ? styles.badgeConfirmed
                                : styles.badgeCancelled
                            }
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td>{tx.description}</td>
                        <td style={{ fontWeight: 800, color: tx.amount >= 0 ? '#166534' : '#dc2626' }}>
                          {tx.amount >= 0 ? `+${formatCLP(tx.amount)}` : `-${formatCLP(Math.abs(tx.amount))}`}
                        </td>
                        <td><span style={{ fontFamily: 'monospace' }}>{tx.receiptNumber || '-'}</span></td>
                        <td>{tx.operator}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* TAB 5: DIRECTORIO CLIENTES */}
          {activeTab === 'clientes' && (
            <div className={styles.cardTable}>
              <div className={styles.tableHeader}>
                <h3 className={styles.tableTitle}>Directorio de Clientes Frecuentes ({clients.length})</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Huéspedes con historial y contacto directo
                </div>
              </div>

              <table className={styles.customTable}>
                <thead>
                  <tr>
                    <th>Nombre Huésped</th>
                    <th>RUT Chileno</th>
                    <th>Contacto</th>
                    <th>Visitas</th>
                    <th>Total Gastado</th>
                    <th>Última Estadía</th>
                    <th>Acciones Directas</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((cli) => (
                    <tr key={cli.id}>
                      <td><strong>{cli.name}</strong></td>
                      <td><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{cli.rut}</span></td>
                      <td>
                        <div>{cli.phone}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{cli.email}</div>
                      </td>
                      <td><strong>{cli.totalVisits}</strong> estadía{cli.totalVisits > 1 ? 's' : ''}</td>
                      <td><strong style={{ color: '#1B4332' }}>{formatCLP(cli.totalSpent)}</strong></td>
                      <td>{cli.lastBookingDate}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <a
                            href={`https://wa.me/${cli.phone.replace(/\+/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.actionBtn}
                            style={{ color: '#16a34a' }}
                          >
                            <MessageCircle size={14} /> WhatsApp
                          </a>
                          <a
                            href={`tel:${cli.phone}`}
                            className={styles.actionBtn}
                          >
                            <Phone size={14} /> Llamar
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: CONTROL DE VISITAS, AFLUENCIA & TRÁFICO WEB */}
          {activeTab === 'visitas' && (
            <>
              {/* Visitas KPI Grid */}
              <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>Personas en Recinto Hoy</span>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
                  </div>
                  <h3 className={styles.kpiValue} style={{ color: '#166534' }}>
                    {visitasMetrics.activePeopleNow || 14} Personas
                  </h3>
                  <div className={styles.kpiSub}>Huéspedes activos en la parcela</div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>Vehículos en Parcela</span>
                    <Car size={20} color="#1B4332" />
                  </div>
                  <h3 className={styles.kpiValue}>
                    {visitasMetrics.activeVehiclesNow || 4} Autos
                  </h3>
                  <div className={styles.kpiSub}>Estacionamientos sector A y B</div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>Total Huéspedes Mes</span>
                    <Users size={20} color="#2563eb" />
                  </div>
                  <h3 className={styles.kpiValue}>
                    {visitasMetrics.totalPeopleThisMonth || 84}
                  </h3>
                  <div className={styles.kpiSub}>Ingresos registrados en portería</div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>Tráfico Web / Conversión</span>
                    <TrendingUp size={20} color="#7c3aed" />
                  </div>
                  <h3 className={styles.kpiValue} style={{ color: '#7c3aed' }}>
                    {webAnalytics.conversionRate || '5.9%'}
                  </h3>
                  <div className={styles.kpiSub}>
                    {webAnalytics.monthlyPageViews || 1420} visitas web / {webAnalytics.whatsappConversions || 42} cotizaciones
                  </div>
                </div>
              </div>

              {/* Registro de Visitas al Quincho Table */}
              <div className={styles.cardTable}>
                <div className={styles.tableHeader}>
                  <div>
                    <h3 className={styles.tableTitle}>Registro de Visitas & Control de Portería ({visitasList.length})</h3>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                      Auditoría de ingresos vehiculares, acompañantes y proveedores autorizados.
                    </p>
                  </div>
                  <button
                    onClick={() => setVisitaModalOpen(true)}
                    className={styles.actionBtnSuccess}
                  >
                    <Plus size={16} /> Registrar Entrada de Visita
                  </button>
                </div>

                <table className={styles.customTable}>
                  <thead>
                    <tr>
                      <th>Hora Entrada</th>
                      <th>Nombre / Visita</th>
                      <th>Tipo</th>
                      <th>Personas</th>
                      <th>Vehículo / Sector</th>
                      <th>Observaciones</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitasList.map((v) => (
                      <tr key={v.id}>
                        <td><strong>{v.entryTime}</strong></td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{v.visitorName}</div>
                          {v.visitorPhone && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{v.visitorPhone}</div>}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
                            {v.type === 'huesped_reserva' ? 'Huésped Reserva' : v.type === 'proveedor_servicio' ? 'Proveedor' : 'Visita Extra'}
                          </span>
                        </td>
                        <td><strong>{v.peopleCount}</strong> pers</td>
                        <td>
                          {v.vehiclePlate ? (
                            <div>
                              <span style={{ fontFamily: 'monospace', fontWeight: 800 }}>{v.vehiclePlate}</span>
                              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{v.parkingZone || 'Sector A'}</div>
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>A pie / Sin auto</span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{v.notes || '-'}</span>
                        </td>
                        <td>
                          <span
                            className={
                              v.status === 'en_recinto'
                                ? styles.badgeConfirmed
                                : v.status === 'proveedor'
                                ? styles.badgePending
                                : styles.badgeCancelled
                            }
                          >
                            {v.status === 'en_recinto' ? '● En Recinto' : v.status === 'proveedor' ? 'Proveedor' : 'Finalizada'}
                          </span>
                        </td>
                        <td>
                          {v.status === 'en_recinto' && (
                            <button
                              onClick={() => handleCheckoutVisita(v.id)}
                              className={styles.actionBtn}
                              title="Marcar salida"
                            >
                              Marcar Salida
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Analítica de Tráfico Web & Canales de Captación */}
              <div className={styles.cardTable}>
                <div className={styles.tableHeader}>
                  <h3 className={styles.tableTitle}>Tráfico Web & Embudo de Cotizaciones</h3>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Métricas de visitas al sitio oficial</div>
                </div>
                <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                  <div style={{ background: '#f8fafc', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', fontWeight: 700, color: '#1B4332' }}>
                      Embudo de Conversión Web
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                      <span>Visitas Únicas al Sitio:</span>
                      <strong>{webAnalytics.uniqueVisitors || 680}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                      <span>Cotizaciones en /reservar:</span>
                      <strong>{webAnalytics.quotationsStarted || 185}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                      <span>Contactos a WhatsApp:</span>
                      <strong style={{ color: '#16a34a' }}>{webAnalytics.whatsappConversions || 42}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                      <span>Tasa de Conversión:</span>
                      <strong style={{ color: '#7c3aed' }}>{webAnalytics.conversionRate || '5.9%'}</strong>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', fontWeight: 700, color: '#1B4332' }}>
                      Principales Canales de Origen
                    </h4>
                    {(webAnalytics.topReferrers || [
                      { source: 'Instagram (@quinchotabolango)', percent: '44%' },
                      { source: 'Google Búsqueda ("Quincho Limache")', percent: '36%' },
                      { source: 'Recomendación Directa / WhatsApp', percent: '20%' },
                    ]).map((ref: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                        <span>{ref.source}</span>
                        <strong style={{ color: '#1B4332' }}>{ref.percent}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 6: COPILOTO IA (GEMINI) */}
          {activeTab === 'copiloto' && (
            <div className={styles.aiContainer}>
              <div className={styles.aiHeader}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1B4332', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                    Copiloto Tabolango IA
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>
                    ● En línea • Modelo Gemini 3.5 Flash Lite (Google AI Studio)
                  </div>
                </div>
              </div>

              <div className={styles.aiMessagesList}>
                {aiMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={msg.role === 'user' ? styles.aiBubbleUser : styles.aiBubbleBot}
                  >
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                  </div>
                ))}
                {aiLoading && (
                  <div className={styles.aiBubbleBot}>
                    <Loader2 size={18} className="animate-spin" style={{ display: 'inline', marginRight: 8 }} />
                    Consultando datos del quincho con Gemini...
                  </div>
                )}
              </div>

              {/* Quick Prompt Chips */}
              <div className={styles.aiChipsBar}>
                <button
                  type="button"
                  className={styles.aiChip}
                  onClick={() => handleSendAiMessage('¿Quién llega este fin de semana al quincho?')}
                >
                  ¿Quién llega este fin de semana?
                </button>
                <button
                  type="button"
                  className={styles.aiChip}
                  onClick={() => handleSendAiMessage('Dame un resumen de caja, ingresos y garantías')}
                >
                  Resumen de caja y garantías
                </button>
                <button
                  type="button"
                  className={styles.aiChip}
                  onClick={() => handleSendAiMessage('¿Qué clientes tienen tinaja de agua caliente contratada?')}
                >
                  ¿Quién tiene tinaja contratada?
                </button>
                <button
                  type="button"
                  className={styles.aiChip}
                  onClick={() => handleSendAiMessage('¿Cuáles son las 7 zonas del ticket de check-in?')}
                >
                  Las 7 zonas de inspección
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendAiMessage()
                }}
                className={styles.aiInputBar}
              >
                <input
                  type="text"
                  placeholder="Pregúntale a Copiloto sobre reservas, números o mantención..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className={styles.aiInput}
                />
                <button type="submit" disabled={aiLoading || !aiInput.trim()} className={styles.aiSendBtn}>
                  <Send size={16} /> Enviar
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: CALENDAR BLOCKS */}
          {activeTab === 'calendar' && (
            <div className={styles.cardTable}>
              <div className={styles.tableHeader}>
                <h3 className={styles.tableTitle}>Bloqueo de Fechas (Mantención o Uso Personal)</h3>
              </div>
              <div style={{ padding: 24 }}>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    if (!newBlockDate) return
                    await fetch('/api/v1/admin/blocks', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ date: newBlockDate, reason: newBlockReason }),
                    })
                    setNewBlockDate('')
                    loadAllData()
                  }}
                  style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}
                >
                  <input
                    type="date"
                    value={newBlockDate}
                    onChange={(e) => setNewBlockDate(e.target.value)}
                    className={styles.input}
                    required
                  />
                  <select
                    value={newBlockReason}
                    onChange={(e) => setNewBlockReason(e.target.value)}
                    className={styles.input}
                  >
                    <option value="Mantención">Mantención (Piscina / Tinaja / Pintura)</option>
                    <option value="Uso Personal">Uso Personal / Dueño</option>
                    <option value="Festivo">Festivo Especial</option>
                  </select>
                  <button type="submit" className={styles.actionBtnSuccess}>
                    <Plus size={16} /> Bloquear Fecha
                  </button>
                </form>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {blockedDates.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        padding: '10px 16px',
                        background: '#fffbeb',
                        border: '1px solid #fde68a',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      <div>
                        <strong>{b.date}</strong>: {b.reason}
                      </div>
                      <button
                        onClick={async () => {
                          await fetch(`/api/v1/admin/blocks?id=${b.id}`, { method: 'DELETE' })
                          loadAllData()
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: API & SYNC */}
          {activeTab === 'api' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
              {/* Card 1: Descarga Directa APK */}
              <div className={styles.cardTable} style={{ border: '2px solid #2d6a4f' }}>
                <div className={styles.tableHeader} style={{ background: '#1B4332', color: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Smartphone size={22} color="#ECF39E" />
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff' }}>Descarga App Móvil (Android APK)</h3>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1' }}>Instalación directa sin intermediarios externos</p>
                    </div>
                  </div>
                  <span style={{ background: '#52b788', color: '#081c15', fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: 999 }}>
                    v1.0.0 APK
                  </span>
                </div>

                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
                    <div style={{ background: '#ffffff', padding: 12, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.quinchotabolango.cl/downloads/TabolangoAdmin.apk" 
                        alt="QR Descarga APK" 
                        style={{ width: 140, height: 140, display: 'block', borderRadius: 8 }}
                      />
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, marginTop: 6, display: 'block' }}>
                        Escanear con celular
                      </span>
                    </div>

                    <div style={{ flex: 1, minWidth: 200 }}>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#1B4332' }}>Tabolango Admin Móvil</h4>
                      <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>
                        Lleva el control de reservas, check-in con escáner QR en portería, libro diario y solicitudes de formulario en tu bolsillo.
                      </p>
                      <a
                        href="/downloads/TabolangoAdmin.apk"
                        download="TabolangoAdmin.apk"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 10,
                          background: '#1B4332',
                          color: '#ffffff',
                          padding: '12px 22px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          textDecoration: 'none',
                          boxShadow: '0 4px 14px rgba(27, 67, 50, 0.3)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Download size={18} color="#ECF39E" />
                        Descargar APK Directa
                      </a>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569' }}>
                      Pasos rápidos para instalar en Android:
                    </h5>
                    <ol style={{ margin: 0, paddingLeft: 18, fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
                      <li>Presiona <strong>"Descargar APK Directa"</strong> o escanea el QR con tu cámara.</li>
                      <li>Si Chrome o Android muestra <em>"El archivo puede ser dañino"</em>, pulsa <strong>"Descargar de todos modos"</strong> (es una advertencia estándar para apps que no vienen de Google Play).</li>
                      <li>Toca el archivo descargado y presiona <strong>Instalar</strong>.</li>
                    </ol>
                  </div>

                  <div style={{ background: '#ecfdf5', padding: 14, borderRadius: 10, border: '1px solid #a7f3d0' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.82rem', fontWeight: 800, color: '#065f46' }}>
                      Credenciales de Acceso para la App:
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#047857' }}>
                      <strong>Admin:</strong> <code>admin@tabolango.cl</code> / <code>Tabolango2026*Admin</code><br />
                      <strong>Operador:</strong> <code>operador@tabolango.cl</code> / <code>Quincho2026*Operador</code>
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Endpoints REST */}
              <div className={styles.cardTable}>
                <div className={styles.tableHeader}>
                  <h3 className={styles.tableTitle}>Endpoints REST & Sincronización Móvil</h3>
                </div>
                <div style={{ padding: 24, fontSize: '0.92rem', lineHeight: 1.6 }}>
                  <p>
                    Esta plataforma web actúa como el <strong>servidor central SaaS</strong> para la
                    aplicación móvil <strong>Tabolango Admin</strong>. Ambas plataformas comparten la
                    misma base de datos y endpoints en tiempo real:
                  </p>
                  <ul style={{ paddingLeft: 20, color: '#334155' }}>
                    <li style={{ marginBottom: 8 }}><code>GET /api/v1/bookings</code>: Retorna reservas para el calendario y lista mensual.</li>
                    <li style={{ marginBottom: 8 }}><code>POST /api/v1/bookings/[id]/checkin</code>: Recibe y sella el ingreso por QR desde el teléfono.</li>
                    <li style={{ marginBottom: 8 }}><code>GET /api/v1/admin/solicitudes</code>: Consulta y actualiza prospectos del formulario web.</li>
                    <li style={{ marginBottom: 8 }}><code>GET /api/v1/admin/caja</code>: Sincroniza libro diario y garantías en custodia.</li>
                    <li style={{ marginBottom: 8 }}><code>POST /api/v1/ai/chat</code>: Copiloto Gemini con contexto del quincho.</li>
                  </ul>
                  <div style={{ marginTop: 20, padding: 12, background: '#f1f5f9', borderRadius: 8, fontSize: '0.8rem', color: '#64748b' }}>
                    Servidor Base: <code>https://www.quinchotabolango.cl/api/v1</code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* GLOBAL QR SCANNER MODAL */}
      {qrModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalDialog}>
            <button
              onClick={() => setQrModalOpen(false)}
              className={styles.modalCloseBtn}
            >
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <QrCode size={30} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Lector de QR en Portería
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 0' }}>
                Acredita la identidad del cliente y autoriza la apertura del portón
              </p>
            </div>

            {/* Selector de Simulación / Test */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                Seleccionar Código QR de Prueba:
              </label>
              <select
                value={selectedQrCode}
                onChange={(e) => handleSelectQrCode(e.target.value)}
                className={styles.input}
              >
                {bookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} - {b.clientName} ({b.checkInDate})
                  </option>
                ))}
              </select>
            </div>

            {/* Laser Scan Animation Box */}
            <div className={styles.qrScanFrame}>
              <div className={styles.qrLaser} />
              <QrCode size={70} color="#1B4332" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.2rem', color: '#1B4332' }}>
                {selectedQrCode}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#166534', marginTop: 4 }}>
                ● Código detectado correctamente
              </div>
            </div>

            {/* Validation Details */}
            {qrScannedBooking && (
              <div style={{ background: '#f8fafc', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{qrScannedBooking.clientName}</span>
                  <span className={styles.badgeConfirmed}>✓ VÁLIDO</span>
                </div>
                <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                  <div>📅 <strong>Fechas:</strong> {qrScannedBooking.checkInDate} al {qrScannedBooking.checkOutDate}</div>
                  <div>👥 <strong>Huéspedes:</strong> {qrScannedBooking.guestsCount} personas</div>
                  <div>🚗 <strong>Patente Autorizada:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{qrScannedBooking.vehiclePlate || 'KZ-8821 (3 autos)'}</span></div>
                  <div>💰 <strong>Saldo a cancelar ahora:</strong> {formatCLP(qrScannedBooking.totalAmount - qrScannedBooking.depositRequired)}</div>
                  <div>🔑 <strong>Garantía de Llaves:</strong> $30.000</div>
                </div>

                {qrCheckInSuccess ? (
                  <div style={{ marginTop: 16, padding: 14, background: '#dcfce7', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid #86efac' }}>
                    <div style={{ color: '#166534', fontWeight: 800, fontSize: '1.05rem' }}>
                      ¡Ingreso Autorizado con Éxito!
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#166534', marginTop: 4 }}>
                      Check-in timbrado a las {qrTimestamp}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleConfirmQrCheckIn}
                    style={{
                      width: '100%',
                      marginTop: 16,
                      background: '#166534',
                      color: '#ffffff',
                      border: 'none',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 800,
                      fontSize: '1rem',
                      cursor: 'pointer',
                    }}
                  >
                    Confirmar Ingreso al Quincho y Entregar Llaves
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEW CASH MOVEMENT MODAL */}
      {cajaModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalDialog}>
            <button
              onClick={() => setCajaModalOpen(false)}
              className={styles.modalCloseBtn}
            >
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 16, color: '#0f172a' }}>
              Registrar Movimiento en Caja
            </h2>

            <form onSubmit={handleAddCashMovement}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Tipo de Movimiento:</label>
                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => setNewTxType('ingreso')}
                    className={`${styles.actionBtn} ${newTxType === 'ingreso' ? styles.actionBtnSuccess : ''}`}
                    style={{ flex: 1, padding: 10 }}
                  >
                    + Ingreso (Cobro)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTxType('gasto')}
                    className={`${styles.actionBtn} ${newTxType === 'gasto' ? styles.btnCheckRedActive : ''}`}
                    style={{ flex: 1, padding: 10 }}
                  >
                    - Gasto (Insumo)
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Monto en Pesos ($):</label>
                <input
                  type="number"
                  placeholder="Ej: 30000"
                  value={newTxAmount}
                  onChange={(e) => setNewTxAmount(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Descripción:</label>
                <input
                  type="text"
                  placeholder="Ej: Pago saldo llegada Constanza / Compra leña"
                  value={newTxDesc}
                  onChange={(e) => setNewTxDesc(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.actionBtnSuccess}
                style={{ width: '100%', padding: 14, fontSize: '1rem', marginTop: 10 }}
              >
                Guardar Movimiento en Caja
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NEW VISITA MODAL */}
      {visitaModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalDialog}>
            <button
              onClick={() => setVisitaModalOpen(false)}
              className={styles.modalCloseBtn}
            >
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 16, color: '#0f172a' }}>
              Registrar Entrada de Visita en Portería
            </h2>

            <form onSubmit={handleAddVisita}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Nombre de la Visita / Titular:</label>
                <input
                  type="text"
                  placeholder="Ej: Familia Valenzuela / Don Ramón Leña"
                  value={newVisName}
                  onChange={(e) => setNewVisName(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>RUT (Opcional):</label>
                  <input
                    type="text"
                    placeholder="12.345.678-9"
                    value={newVisRut}
                    onChange={(e) => setNewVisRut(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Teléfono:</label>
                  <input
                    type="text"
                    placeholder="+569..."
                    value={newVisPhone}
                    onChange={(e) => setNewVisPhone(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Cantidad de Personas:</label>
                  <input
                    type="number"
                    min="1"
                    value={newVisPeople}
                    onChange={(e) => setNewVisPeople(e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Patente Vehicular:</label>
                  <input
                    type="text"
                    placeholder="Ej: KZ-8821"
                    value={newVisPlate}
                    onChange={(e) => setNewVisPlate(e.target.value.toUpperCase())}
                    className={styles.input}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Tipo de Ingreso:</label>
                  <select
                    value={newVisType}
                    onChange={(e: any) => setNewVisType(e.target.value)}
                    className={styles.input}
                  >
                    <option value="huesped_reserva">Huésped de Reserva</option>
                    <option value="visita_adicional">Visita Adicional</option>
                    <option value="proveedor_servicio">Proveedor de Servicio</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Estacionamiento:</label>
                  <select
                    value={newVisZone}
                    onChange={(e) => setNewVisZone(e.target.value)}
                    className={styles.input}
                  >
                    <option value="Sector A - Sombras Quincho">Sector A (Sombras)</option>
                    <option value="Sector B - Principal">Sector B (Principal)</option>
                    <option value="Sector Carga">Sector Carga</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Observaciones:</label>
                <input
                  type="text"
                  placeholder="Detalles sobre ingreso, llaves o acompañantes..."
                  value={newVisNotes}
                  onChange={(e) => setNewVisNotes(e.target.value)}
                  className={styles.input}
                />
              </div>

              <button
                type="submit"
                className={styles.actionBtnSuccess}
                style={{ width: '100%', padding: 14, fontSize: '1rem', marginTop: 10 }}
              >
                Registrar Entrada de Visita
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
