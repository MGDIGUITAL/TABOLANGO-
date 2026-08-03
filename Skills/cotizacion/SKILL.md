---
name: cotizacion
description: "Genera cotizaciones formales de VisionCode en HTML + PDF, con branding oficial (negro #030303 + burdeos #8B1A2B), sistema de descuento visible, condiciones de pago 50/50 y bloques por plan (Landing, E-commerce, Pro, Diamante). Activar con /cotizacion o /cotizaciones."
---

# Cotizaciones VisionCode — Modo /cotizacion

Cuando Matías escribe `/cotizacion` (o `/cotizaciones`), leer el archivo completo en
`D:\CLAUDE\2-TRABAJO\Skills\cotizaciones-pro\SKILL.md` y aplicar sus reglas al trabajo actual.

## Qué hacer al activarse

1. Leer `D:\CLAUDE\2-TRABAJO\Skills\cotizaciones-pro\SKILL.md`
2. Confirmar los datos mínimos del pedido (plan, cantidad, precios, extras, cliente, condiciones)
3. Generar HTML según la plantilla oficial dentro de la carpeta del cliente
4. Convertir automáticamente a PDF con Chrome headless
5. Entregar las rutas del HTML y del PDF y pedir aprobación

## Cuándo aplicar

Obligatorio cuando el usuario menciona: cotización, cotizar, presupuesto, propuesta económica,
propuesta comercial o "pasarle un valor" a un cliente.

## Skills hermanas

- Aplicar también reglas de `/diseno` (UI/UX Pro Max) para calidad visual del PDF final.
- Respetar el `PERFIL.md` de `2-TRABAJO` (entregables funcionales, código completo, seguridad).

## Datos fijos del emisor (nunca modificar)

- Nombre: **VisionCode**
- Tagline: Firma de Ingeniería & Diseño
- Giro: **Desarrollo Web**
- Email: Vision.code.vs@gmail.com
- Contacto: +56 9 2964 5522 (nunca escribir "WhatsApp")
- Sitio: vision-code.cl

## Ruta de salida

`D:\CLAUDE\2-TRABAJO\clientes\<slug-proyecto>\cotizacion-<slug>.html` + `.pdf`
