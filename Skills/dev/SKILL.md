---
name: dev
trigger: /dev
description: >
  Activar cuando la tarea es de desarrollo: crear componentes, endpoints,
  rutas, páginas, features, APIs, autenticación, base de datos, tests,
  seguridad, deploy o revisión de código. Stack: React, Next.js, NestJS,
  TypeScript, Node.js, Astro.
scope: full-stack, frontend, backend, testing, security
profiles: [2-TRABAJO]
---

# /dev — Equipo Full Stack

Al activar `/dev` se activa el equipo completo de desarrollo. Aplica las reglas
de todos los especialistas listados abajo según la tarea específica.

## Stack de Matías

| Capa | Tecnologías |
|------|-------------|
| Frontend | React 19, Next.js App Router, Astro, TypeScript |
| Estilos | Tailwind CSS, HTML/CSS vanilla |
| Backend | Node.js, NestJS, API Routes (Next.js / Astro) |
| ORM / DB | Prisma, TypeORM, PostgreSQL |
| Auth | JWT, NextAuth, sesiones |
| Deploy | Vercel, Netlify |
| Testing | Vitest, Jest, React Testing Library, Playwright |

---

## Especialistas activos en /dev

### React Expert
Componentes React 19, hooks, Server Components, Suspense, TanStack Query, Zustand.

**Reglas clave:**
- TypeScript con strict mode siempre
- Usar `key` estable y único (nunca index en listas dinámicas)
- Limpiar effectos (return cleanup)
- Error boundaries en producción
- No mutar el state directamente
- No crear funciones dentro del JSX (causa re-renders)

**Referencia completa:** `D:\CLAUDE\2-TRABAJO\Skills\react-expert\SKILL.md`

---

### Next.js Developer
App Router, Server Components, Server Actions, SEO, Metadata API, Vercel deploy.

**Reglas clave:**
- Server Components por defecto; `'use client'` solo cuando se necesita interactividad
- Colocar `loading.tsx` y `error.tsx` en cada segmento de ruta
- Usar `generateMetadata()` para SEO dinámico
- Validar con `tsc --noEmit` antes de dar algo por terminado
- Optimizar imágenes con `<Image>` de Next.js

**Referencia completa:** `D:\CLAUDE\2-TRABAJO\Skills\nextjs-developer\SKILL.md`

---

### NestJS Expert
APIs REST/GraphQL, inyección de dependencias, JWT, TypeORM, Prisma.

**Reglas clave:**
- Validar con `class-validator` + `class-transformer` en todos los DTOs
- Usar `@UseGuards()` en rutas protegidas
- Manejar errores con filtros globales
- No exponer stacktraces en producción
- Documentar con Swagger (`@ApiProperty`)

**Referencia completa:** `D:\CLAUDE\2-TRABAJO\Skills\nestjs-expert\SKILL.md`

---

### TypeScript Pro
Tipos avanzados, generics, type guards, utility types, strict mode.

**Reglas clave:**
- `strict: true` en tsconfig
- Nunca usar `any` (usar `unknown` + narrowing)
- Preferir tipos derivados (`ReturnType<>`, `Awaited<>`, `Parameters<>`)
- Discriminated unions para estados
- Validar antes de entregar: `tsc --noEmit` debe pasar limpio

**Referencia completa:** `D:\CLAUDE\2-TRABAJO\Skills\typescript-pro\SKILL.md`

---

### Fullstack Guardian
Features end-to-end: front + back + seguridad integrada.

**Reglas clave:**
- Revisar el impacto de la feature en todos los layers antes de implementar
- Validar en frontend Y en backend (nunca solo en uno)
- Auth y permisos verificados en cada endpoint nuevo
- Transacciones de DB para operaciones múltiples
- Logging suficiente para debuggear en producción

**Referencia completa:** `D:\CLAUDE\2-TRABAJO\Skills\fullstack-guardian\SKILL.md`

---

### Secure Code Guardian
Auth, validación, OWASP Top 10, hashing, manejo de errores seguro.

**Reglas clave:**
- Nunca almacenar contraseñas en texto plano (bcrypt mínimo 12 rounds)
- Queries parametrizadas siempre (nunca concatenar SQL)
- Variables de entorno para secretos (nunca en código)
- Sanitizar inputs antes de procesar
- Avisar si un endpoint queda sin autenticación

**Referencia completa:** `D:\CLAUDE\2-TRABAJO\Skills\secure-code-guardian\SKILL.md`

---

### Test Master
Tests unitarios, integración, E2E. Vitest, Jest, React Testing Library, Playwright.

**Reglas clave:**
- Tests unitarios para lógica de negocio crítica
- Tests de integración para flujos API completos
- E2E con Playwright para flujos de usuario críticos
- Aserciones que fallen por razones claras
- Correr tests antes de dar algo por terminado

**Referencia completa:** `D:\CLAUDE\2-TRABAJO\Skills\test-master\SKILL.md`

---

## Flujos de trabajo

**Nueva feature:**
Feature Forge → Architecture Designer → Fullstack Guardian + stack → Test Master → Security Reviewer → DevOps

**Bug:**
Debugging sistemático → Fullstack Guardian + stack → Test Master → revisión

**App web nueva:**
Next.js Developer + TypeScript Pro + API Designer + `/diseño`

---

## Reglas generales (siempre en /dev)

1. Leer el código existente antes de escribir; respetar el estilo del proyecto.
2. Código completo y funcional, no fragmentos a medias.
3. `tsc --noEmit` limpio antes de entregar.
4. Build/tests corriendo antes de dar algo por terminado.
5. Avisar si un endpoint queda sin autenticación.
6. Confirmar antes de acciones que borran o modifican datos en producción.
7. Seguridad por defecto: validación, manejo de errores, queries parametrizadas.

---
Skill del protocolo de Matías. Ver `D:\CLAUDE\Skills\INDICE.md`.
