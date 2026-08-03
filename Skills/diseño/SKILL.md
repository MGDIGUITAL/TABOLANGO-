---
name: diseño
trigger: /diseño
description: >
  Activar cuando la tarea involucra UI, UX, diseño visual, componentes,
  color, tipografía, animación, layout, formularios, navegación o charts.
  Aplica para web y mobile en cualquier stack (React, Next.js, Astro,
  HTML/CSS, Vue, Flutter, etc.).
scope: visual-design, ux, ui-implementation
profiles: [2-TRABAJO, 3-LIBRE]
---

# /diseño — UI/UX Pro Max

Guía de diseño de nivel profesional. Al activar `/diseño` aplicar estas reglas
en todo lo que se produzca durante la sesión.

## Principios base (siempre)

1. **Accesibilidad primero.** Contraste mínimo 4.5:1, foco visible, ARIA correcto.
2. **Mobile-first.** Diseñar para 375px y escalar hacia arriba.
3. **Sistema de espaciado.** Grid de 4px/8px. No usar valores arbitrarios.
4. **Tokens, no valores hardcoded.** Colores y tipografías como variables CSS o tokens.
5. **Una acción primaria por pantalla.** El usuario no debe dudar qué hacer.

## Prioridad de reglas

| P | Categoría | Impacto |
|---|-----------|---------|
| 1 | Accesibilidad | CRÍTICO |
| 2 | Touch e Interacción | CRÍTICO |
| 3 | Performance visual | ALTO |
| 4 | Selección de estilo | ALTO |
| 5 | Layout y responsive | ALTO |
| 6 | Tipografía y color | MEDIO |
| 7 | Animación | MEDIO |
| 8 | Formularios y feedback | MEDIO |
| 9 | Navegación | ALTO |
| 10 | Charts y datos | BAJO |

## Estilos disponibles

glassmorphism · claymorphism · minimalism · brutalism · neumorphism ·
bento-grid · dark-mode · skeuomorphism · flat · editorial

Elegir el estilo según el producto. No mezclar estilos distintos en la misma vista.

## Tipografía — reglas

- Tamaño mínimo body: **16px**
- Line-height body: **1.5 – 1.75**
- Escala tipográfica: 12 / 14 / 16 / 18 / 24 / 32 / 48 / 64
- Máximo 65-75 caracteres por línea en desktop
- Fuentes recomendadas: Inter, Geist, Outfit, DM Sans, Sora

## Color — reglas

- Definir tokens semánticos: `--color-primary`, `--color-surface`, `--color-text`, etc.
- Nunca usar hex crudo dentro de componentes
- Dark mode: variantes desaturadas/más claras, nunca simplemente invertir
- El color nunca es el único indicador de estado (agregar ícono o texto)

## Animación — reglas

- Duración: 150–300ms para microinteracciones, ≤400ms para transiciones complejas
- Usar solo `transform` y `opacity` (evitar animar width/height)
- Siempre respetar `prefers-reduced-motion`
- Easing: `ease-out` al entrar, `ease-in` al salir
- Nunca bloquear el input del usuario durante una animación

## Formularios — reglas

- Siempre label visible (no solo placeholder)
- Error debajo del campo relacionado
- Feedback visual al enviar (loading → success/error)
- Campos obligatorios marcados
- Validación en blur, no en cada keystroke

## Checklist pre-entrega

### Visual
- [ ] Sin emojis como íconos (usar SVG: Lucide, Heroicons)
- [ ] Íconos consistentes (mismo set, mismo stroke)
- [ ] Assets oficiales con proporciones correctas
- [ ] Tokens semánticos (sin hex hardcoded)

### Interacción
- [ ] Touch targets ≥44×44px (iOS) / ≥48×48dp (Android)
- [ ] Feedback al tap/click en <150ms
- [ ] Microinteracciones 150–300ms
- [ ] Estados disabled claros y no interactivos
- [ ] Focus order = orden visual

### Layout
- [ ] Safe areas respetadas
- [ ] Sin scroll horizontal en mobile
- [ ] Ritmo de espaciado 4/8dp
- [ ] Responsive verificado: 375, 768, 1024, 1440

### Accesibilidad
- [ ] Contraste ≥4.5:1 en texto
- [ ] Imágenes/íconos con alt/aria-label
- [ ] Formularios con labels y errores legibles
- [ ] Color no es el único indicador

---

## Referencia completa

El SKILL.md completo con las 99 guías UX, 161 paletas de color, 57 combinaciones
tipográficas y los 10 stacks está en:
`D:\CLAUDE\2-TRABAJO\Skills\ui-ux-pro-max\SKILL.md`

Leer ese archivo cuando se necesite detalle específico sobre un tema puntual.

---
Skill del protocolo de Matías. Ver `D:\CLAUDE\Skills\INDICE.md`.
