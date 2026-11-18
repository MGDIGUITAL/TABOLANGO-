import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Tabolango, Limache coordinates
    const lat = -32.997
    const lon = -71.293

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America%2FSantiago`

    const res = await fetch(url, { next: { revalidate: 900 } }) // Cache 15 min
    if (!res.ok) throw new Error('Error al consultar Open-Meteo')

    const data = await res.json()
    const current = data.current
    const daily = data.daily

    // Helper to translate weather codes
    function getWeatherDesc(code: number) {
      if (code === 0) return { label: 'Despejado / Soleado', icon: '☀️', poolIdeal: true }
      if (code === 1 || code === 2) return { label: 'Parcialmente nublado', icon: '⛅', poolIdeal: true }
      if (code === 3) return { label: 'Nublado', icon: '☁️', poolIdeal: false }
      if (code >= 45 && code <= 48) return { label: 'Neblina matinal', icon: '🌫️', poolIdeal: false }
      if (code >= 51 && code <= 67) return { label: 'Llovizna', icon: '🌦️', poolIdeal: false }
      if (code >= 71 && code <= 82) return { label: 'Chubascos', icon: '🌧️', poolIdeal: false }
      if (code >= 95) return { label: 'Tormenta eléctrica', icon: '⛈️', poolIdeal: false }
      return { label: 'Templado', icon: '🌤️', poolIdeal: true }
    }

    const weatherInfo = getWeatherDesc(current.weather_code)

    return NextResponse.json({
      success: true,
      location: 'Tabolango, Limache',
      current: {
        temp: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        condition: weatherInfo.label,
        icon: weatherInfo.icon,
        poolIdeal: weatherInfo.poolIdeal,
      },
      forecast: daily.time.slice(0, 3).map((day: string, idx: number) => ({
        date: day,
        max: Math.round(daily.temperature_2m_max[idx]),
        min: Math.round(daily.temperature_2m_min[idx]),
        condition: getWeatherDesc(daily.weather_code[idx]).label,
        icon: getWeatherDesc(daily.weather_code[idx]).icon,
      })),
    })
  } catch (error) {
    // Fallback static weather for Limache microclimate
    return NextResponse.json({
      success: true,
      location: 'Tabolango, Limache',
      current: {
        temp: 24,
        humidity: 50,
        windSpeed: 12,
        condition: 'Soleado / Microclima Cálido',
        icon: '☀️',
        poolIdeal: true,
      },
    })
  }
}
