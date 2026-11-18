'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles, MapPin, Calendar, Flame, Waves, ShieldAlert, DollarSign } from 'lucide-react'
import styles from './SalesAgent.module.css'

const WHATSAPP_NUMBER = '56912345678'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const KB: Record<string, { keys: string[]; reply: string; action?: string }> = {
  precios: {
    keys: ['precio', 'precios', 'tarifa', 'tarifas', 'cuanto', 'cuánto', 'cuesta', 'valor', 'jornada', 'costo'],
    reply: `Nuestras tarifas oficiales en Quincho Tabolango 🌿:\n\n☀️ Jornada Diurna (09:00 - 19:00): $120.000 (Base 50 personas)\n🌙 Jornada Nocturna (20:00 - 02:00): $160.000\n👥 Persona Adicional (>50 pers.): $5.000 p/p\n♨️ Tinaja de Agua Caliente: $35.000 (3 hrs) / $50.000 (5 hrs)\n🛡️ Garantía Reembolsable: $30.000\n\n¿Te gustaría cotizar para una fecha en particular?`,
  },
  reglas: {
    keys: ['reglas', 'regla', 'norma', 'normas', 'musica', 'música', 'parlante', 'parlantes', 'sonido', 'volumen', 'condiciones'],
    reply: `Reglas y condiciones de Quincho Tabolango 🌿:\n\n📅 RESERVAS: Deben realizarse con antelación y requieren un pago inicial para confirmar. Cancelaciones con menos de 7 días de anticipación no serán reembolsadas.\n\n🎵 EQUIPO DE MÚSICA: Está PROHIBIDO el ingreso de parlantes externos, sistemas de sonido y amplificadores. Solo se permite el sistema de sonido interno pre-instalado a volumen moderado.\n\n🗑️ MANEJO DE RESIDUOS: Los usuarios son responsables de recolectar y depositar todos los residuos en los contenedores designados. El quincho debe dejarse limpio y ordenado, libre de basura.\n\n🛡️ DEPÓSITO DE SEGURIDAD: Se requiere un depósito reembolsable ($30.000) antes del uso de las instalaciones. Se retendrá si se detectan daños a la propiedad o incumplimiento de normas de limpieza.\n\n⏰ HORARIOS: Ingreso (Check-in) a las 14:00 hrs | Salida (Check-out) a las 12:00 hrs (Mediodía). El ingreso anticipado o salida tarde están sujetos a disponibilidad (coordinar con anticipación).`,
  },
  reserva: {
    keys: ['reserva', 'reservar', 'abonar', 'abono', 'pago', 'cancelacion', 'cancelación'],
    reply: `Para confirmar tu reserva se abonará el 50% del valor total. El 50% restante se cancela al momento de tu llegada antes de instalarte.\n\n*Nota: Cancelaciones con menos de 7 días de anticipación no poseen reembolso.*`,
  },
  piscina: {
    keys: ['piscina', 'tinaja', 'agua caliente', 'solarium', 'reposera', 'nadar', 'bañarse'],
    reply: `En Quincho Tabolango contamos con una amplia piscina privada rodeada de césped natural y reposeras, además de una relajante tinaja de agua caliente al aire libre ($35.000 por 3 hrs / $50.000 por 5 hrs).\n\n¿Te gustaría consultar disponibilidad para alguna fecha?`,
  },
  quincho: {
    keys: ['quincho', 'parrilla', 'asado', 'bar', 'cocina', 'mesones', 'equipada', 'nevera', 'refrigerador', 'leña'],
    reply: `Nuestro quincho techado está completamente equipado con parrilla rústica, mesones de madera, zona de bar, cocina, refrigerador y congelador. También contamos con sacos de leña a $10.000.\n\n¡Todo listo para disfrutar en familia!`,
  },
  ubicacion: {
    keys: ['donde', 'dónde', 'ubicacion', 'ubicación', 'llegar', 'direccion', 'dirección', 'limache', 'tabolango', 'km', 'kilometro', 'kilómetro'],
    reply: `📍 Nos encontramos en:\n\nKilómetro 9, Tabolango, Limache (Región de Valparaíso)\n\nEstamos en un entorno rural tranquilo. Contamos con estacionamiento privado dentro del recinto y control de acceso vehicular.\n\n¿Deseas que te enviemos la ubicación exacta por WhatsApp?`,
  },
  cotizar: {
    keys: ['cotizar', 'agendar', 'disponibilidad', 'fecha', 'contactar', 'whatsapp'],
    reply: `¡Con gusto te ayudamos a agendar! Déjanos tu nombre y número a continuación para derivarte a WhatsApp y asegurar tu fecha.`,
    action: 'lead',
  },
  saludo: {
    keys: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos', 'hola!'],
    reply: `¡Hola! Bienvenid@ a Quincho Tabolango 🌿. Soy Constanza, tu anfitriona virtual.\n\n¿En qué te puedo orientar hoy? Puedes preguntarme por las tarifas, reglas del recinto, piscina, tinaja o reservar tu fecha.`,
  },
  gracias: {
    keys: ['gracias', 'muchas gracias', 'excelente', 'genial', 'perfecto'],
    reply: `¡Un placer atenderte! En Quincho Tabolango estamos para brindarte la mejor experiencia junto a tu familia. 🌿`,
  },
  default: {
    keys: [],
    reply: `En Quincho Tabolango contamos con arriendo por jornada diurna ($120.000) y nocturna ($160.000), piscina privada, tinaja y quincho completo en Tabolango, Limache.\n\n¿Qué consulta tienes sobre las instalaciones, valores o reglas del recinto?`,
  },
}

function detectKB(text: string) {
  const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  for (const [intent, data] of Object.entries(KB)) {
    if (intent === 'default') continue
    if (data.keys.some((k) => t.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
      return data
    }
  }
  return null
}

export default function SalesAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputVal, setInputVal] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')

  const msgsEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, showLeadForm])

  const handleOpenToggle = () => {
    const nextState = !isOpen
    setIsOpen(nextState)
    if (nextState && !started) {
      setStarted(true)
      const welcomeMsg =
        '¡Hola! Bienvenid@ a Quincho Tabolango 🌿. Soy Constanza, tu anfitriona virtual.\n\n¿En qué te puedo orientar hoy? Puedes preguntarme por las tarifas, reglas del recinto, piscina, tinaja o cotizar una fecha para tu evento.'
      setMessages([{ role: 'assistant', content: welcomeMsg }])
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return

    const userMsg: Message = { role: 'user', content: text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInputVal('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/constanza', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      const data = await res.json()

      if (data.reply && !data.useFallback) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
        const lowerQ = text.toLowerCase()
        const lowerR = data.reply.toLowerCase()
        if (
          lowerQ.includes('cotizar') ||
          lowerQ.includes('precio') ||
          lowerQ.includes('reserva') ||
          lowerR.includes('whatsapp')
        ) {
          setShowLeadForm(true)
        }
      } else {
        handleKB(text, updatedMessages)
      }
    } catch {
      handleKB(text, updatedMessages)
    } finally {
      setIsTyping(false)
    }
  }

  const handleKB = (text: string, currentMsgs: Message[]) => {
    const match = detectKB(text)
    const replyText = match ? match.reply : KB.default.reply
    setMessages([...currentMsgs, { role: 'assistant', content: replyText }])
    if (match?.action === 'lead') {
      setShowLeadForm(true)
    }
  }

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadName || !leadPhone) return

    const waMsg = encodeURIComponent(
      `Hola Constanza, soy ${leadName} (${leadPhone}). Me gustaría cotizar y consultar disponibilidad para Quincho Tabolango.`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`, '_blank')
    setShowLeadForm(false)
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `¡Muchas gracias ${leadName}! Te hemos derivado a WhatsApp para confirmar los detalles de tu evento. 🎉`,
      },
    ])
  }

  return (
    <div className={styles.agentWrapper}>
      {/* Floating Button */}
      <button
        type="button"
        onClick={handleOpenToggle}
        className={styles.bubble}
        aria-label="Asistente Virtual Quincho Tabolango"
      >
        <span className={styles.tooltip}>Anfitriona IA</span>
        <span className={styles.onlineDot} />
        {isOpen ? <X size={24} color="#FFFFFF" /> : <MessageCircle size={26} color="#FFFFFF" />}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className={styles.panel}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.avatar}>QL</div>
            <div className={styles.headerInfo}>
              <div className={styles.headerTitle}>Constanza · Quincho Tabolango</div>
              <div className={styles.headerStatus}>
                <span className={styles.greenPulse} />
                En línea · Respuesta inmediata
              </div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className={styles.closeBtn}>
              <X size={20} />
            </button>
          </div>

          {/* Quick Option Chips */}
          <div className={styles.chips}>
            <button type="button" className={styles.chip} onClick={() => sendMessage('¿Cuáles son los precios y tarifas?')}>
              <DollarSign size={12} /> Tarifas y Valores
            </button>
            <button type="button" className={styles.chip} onClick={() => sendMessage('¿Cuáles son las reglas de música y recinto?')}>
              <ShieldAlert size={12} /> Reglas del recinto
            </button>
            <button type="button" className={styles.chip} onClick={() => sendMessage('¿Cómo es la piscina y tinaja?')}>
              <Waves size={12} /> Piscina & Tinaja
            </button>
            <button type="button" className={styles.chip} onClick={() => sendMessage('¿Qué equipamiento tiene el quincho?')}>
              <Flame size={12} /> Quincho & Leña
            </button>
            <button type="button" className={styles.chip} onClick={() => sendMessage('¿Cómo llegar a la ubicación?')}>
              <MapPin size={12} /> Ubicación
            </button>
            <button type="button" className={styles.chip} onClick={() => sendMessage('Quiero cotizar una fecha')}>
              <Calendar size={12} /> Cotizar fecha
            </button>
          </div>

          {/* Messages Container */}
          <div className={styles.messagesList}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.messageBubble} ${
                  msg.role === 'user' ? styles.userBubble : styles.botBubble
                }`}
              >
                {msg.content}
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.messageBubble} ${styles.botBubble} ${styles.typingDots}`}>
                <Sparkles size={14} className={styles.sparkleIcon} /> Escribiendo...
              </div>
            )}

            {/* Lead Form Inside Chat */}
            {showLeadForm && (
              <form onSubmit={handleLeadSubmit} className={styles.leadForm}>
                <div className={styles.leadTitle}>📅 Cotiza tu fecha en WhatsApp</div>
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  required
                  className={styles.leadInput}
                />
                <input
                  type="tel"
                  placeholder="Tu número WhatsApp (+56 9...)"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  required
                  className={styles.leadInput}
                />
                <button type="submit" className={styles.leadSubmitBtn}>
                  <MessageCircle size={16} /> Hablar por WhatsApp
                </button>
              </form>
            )}

            <div ref={msgsEndRef} />
          </div>

          {/* Bottom Input Bar */}
          <div className={styles.inputRow}>
            <input
              type="text"
              placeholder="Escribe tu duda aquí..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputVal)}
              className={styles.textInput}
            />
            <button
              type="button"
              onClick={() => sendMessage(inputVal)}
              disabled={!inputVal.trim() || isTyping}
              className={styles.sendBtn}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
