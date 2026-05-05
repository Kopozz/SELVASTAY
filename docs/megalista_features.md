# 🚀 SelvaStay Pro — Megalista de Features

**Hoja de ruta completa del producto**  
Organizada en 3 fases: Esencial → Profesional → Innovador

---

## 🔴 FASE 1 — ESENCIAL (Sistema Funcional Mínimo)
> Lo que el sistema **NECESITA** para que un lodge lo use en producción.

### ✅ Ya implementados

| # | Feature | Estado | Descripción |
|---|---------|--------|-------------|
| 1 | Dashboard de Ocupación | ✅ Hecho | Grid visual con estados, estadísticas, filtros y vistas grid/lista |
| 2 | Check-in Express | ✅ Hecho | Registro de huésped + reserva en flujo de 2 pasos |
| 3 | Guardia de Conectividad | ✅ Hecho | Detección offline, ping a Supabase, fallback a datos demo |
| 4 | Página de Reservas | ✅ Hecho | Lista con badges de estado y acciones rápidas |
| 5 | Página de Clientes | ✅ Hecho | Grid de tarjetas con datos del huésped |
| 6 | Página de Servicios | ✅ Hecho | Visualización de consumos por reserva |
| 7 | Navegación SPA | ✅ Hecho | Sidebar colapsable con React Router |

### 🔲 Pendientes — Prioridad Alta

| # | Feature | Complejidad | Descripción |
|---|---------|-------------|-------------|
| 8 | Check-out funcional | 🟡 Media | Flujo de salida: calcular total final (noches + servicios), marcar habitación en `limpieza`, generar resumen |
| 9 | CRUD Habitaciones | 🟡 Media | Crear, editar y eliminar habitaciones desde la UI con modal. Cambiar estado manual |
| 10 | CRUD Clientes | 🟢 Fácil | Editar datos del huésped, eliminar (si no tiene reservas), búsqueda avanzada por DNI |
| 11 | Gestión completa de Reservas | 🟡 Media | Crear reserva futura (sin check-in inmediato), modificar fechas, cancelar con motivo |
| 12 | Agregar Servicios Extra | 🟡 Media | Formulario para cargar consumos (restaurante, tours, spa) al folio de una reserva activa |
| 13 | Cuenta final detallada | 🟡 Media | Vista resumen al check-out: desglose de noches, servicios, subtotales y total |
| 14 | Calendario de disponibilidad | 🔴 Alta | Vista calendario mensual con ocupación por fecha. Clic en fecha para ver/crear reserva |
| 15 | Autenticación (Login) | 🟡 Media | Pantalla de login con email/password vía Supabase Auth |
| 16 | Protección de rutas | 🟢 Fácil | Middleware que redirige a `/login` si no hay sesión activa |
| 17 | Validaciones robustas | 🟢 Fácil | Validar fechas solapadas, capacidad de habitación, formato de DNI |

---

## 🟡 FASE 2 — PROFESIONAL (Valor Agregado Sólido)
> Lo que convierte el MVP en un **producto profesional** digno de cobrar suscripción.

| # | Feature | Complejidad | Descripción |
|---|---------|-------------|-------------|
| 18 | Roles de usuario | 🟡 Media | Admin (todo acceso) vs Recepcionista (solo operaciones del día). Implementar con RLS en Supabase |
| 19 | Reportes de ocupación | 🟡 Media | Gráficas interactivas: % ocupación por día/semana/mes, tendencias, habitaciones más populares |
| 20 | Reportes de ingresos | 🟡 Media | Dashboard financiero: ingresos totales, por habitación, por tipo de servicio, comparativa mensual |
| 21 | Historial de huéspedes | 🟢 Fácil | Al abrir un cliente: ver todas sus estadías anteriores, preferencias, total gastado |
| 22 | Notificaciones en-app | 🟡 Media | Alertas: check-outs pendientes del día, reservas sin confirmar, habitaciones en mantenimiento prolongado |
| 23 | Búsqueda global (Cmd+K) | 🟡 Media | Command palette: buscar cualquier cliente, reserva o habitación desde cualquier página |
| 24 | Export PDF de cuenta | 🔴 Alta | Generar boleta/comprobante al check-out con datos del lodge, huésped, desglose y total |
| 25 | Soporte multi-lodge | 🔴 Alta | Un admin puede gestionar varios lodges. Selector de lodge en el sidebar |
| 26 | Mantenimiento programado | 🟢 Fácil | Agendar mantenimiento de habitaciones con fecha inicio/fin y responsable |
| 27 | Tarifas por temporada | 🟡 Media | Configurar precios diferentes para temporada alta, baja y feriados. Cálculo automático |
| 28 | Dark/Light mode | 🟢 Fácil | Toggle de tema. Actualmente solo dark, agregar modo claro para uso bajo el sol |

---

## 🟢 FASE 3 — INNOVADOR (Diferenciadores SaaS)
> Lo que hace que SelvaStay Pro **no se parezca a ningún otro sistema** del mercado.

### 🌐 Tecnología Offline-First

| # | Feature | Complejidad | Descripción |
|---|---------|-------------|-------------|
| 29 | Offline-First real con IndexedDB | 🔴 Alta | Cola de sincronización: todas las operaciones se guardan localmente y se sincronizan al volver la señal. Resolución de conflictos |
| 30 | PWA instalable | 🟡 Media | Service Worker + manifest.json para instalar como app nativa en celular/tablet. Funcionar sin internet |
| 31 | Push Notifications | 🟡 Media | Notificaciones push al admin cuando llega una reserva nueva o hay un check-out vencido |

### 🗺️ Experiencia Visual Única

| # | Feature | Complejidad | Descripción |
|---|---------|-------------|-------------|
| 32 | Mapa interactivo del lodge | 🔴 Alta | Plano visual SVG del lodge con habitaciones clickeables. Estado en tiempo real tipo "mapa de asientos de avión" |
| 33 | Galería de fotos por habitación | 🟢 Fácil | Subir y mostrar fotos de cada habitación. Carrusel en la tarjeta |
| 34 | Dashboard público del lodge | 🟡 Media | Página pública (sin login) con disponibilidad, fotos y formulario de reserva para turistas |

### 🤖 Automatización y Herramientas

| # | Feature | Complejidad | Descripción |
|---|---------|-------------|-------------|
| 36 | Check-in con QR | 🟡 Media | Generar QR único por reserva. Huésped escanea y llena sus datos desde su celular |
| 37 | WhatsApp Bot | 🔴 Alta | Confirmar reservas, enviar bienvenida y compartir indicaciones por WhatsApp (Twilio/Meta API) |

### 🌿 Eco-Branding & Turismo

| # | Feature | Complejidad | Descripción |
|---|---------|-------------|-------------|
| 39 | Integración clima | 🟢 Fácil | Widget con clima actual de la zona (OpenWeatherMap). Sugerir actividades según el tiempo |
| 40 | Huella de carbono | 🟢 Fácil | Calculadora de impacto ambiental por estadía. Badge "Eco-Friendly" para el lodge |
| 41 | Sistema de reseñas | 🟡 Media | QR en habitación para que huéspedes dejen valoración. Puntaje público del lodge |
| 42 | Programa de fidelidad | 🟡 Media | Puntos por estadía, niveles (Explorador, Aventurero, Nativo), descuentos automáticos |
| 43 | Multilingüe (i18n) | 🟡 Media | Interfaz en español, inglés y portugués para turistas internacionales |

### 📊 Integraciones & Cumplimiento

| # | Feature | Complejidad | Descripción |
|---|---------|-------------|-------------|
| 44 | Integración Booking/Airbnb | 🔴 Alta | Channel Manager básico: sincronizar disponibilidad y precios con OTAs |
| 45 | Integración SUNAT | 🔴 Alta | Emisión de comprobantes electrónicos (factura/boleta) cumpliendo normativa peruana |
| 46 | Analytics de conversión | 🟡 Media | Métricas: ratio reserva→check-in, tasa de cancelación, RevPAR, ADR |
| 47 | API pública | 🟡 Media | REST API documentada para que terceros integren con el sistema |

---

## 📊 Resumen por Fase

| Fase | Items | Hechos | Pendientes | Prioridad |
|------|-------|--------|------------|-----------|
| 🔴 Esencial | 17 | 7 | 10 | **AHORA** |
| 🟡 Profesional | 11 | 0 | 11 | Siguiente sprint |
| 🟢 Innovador | 19 | 0 | 19 | Roadmap futuro |
| **Total** | **47** | **7** | **40** | — |

---

## 🎯 Siguiente Sprint Recomendado (Top 5)

1. **#8 Check-out funcional** — Sin esto el ciclo de la reserva no cierra
2. **#9 CRUD Habitaciones** — El admin necesita gestionar sus propias habitaciones
3. **#12 Agregar Servicios Extra** — El 40% de ingresos de un lodge viene de servicios adicionales
4. **#15 Autenticación** — Sin login no es un sistema serio
5. **#14 Calendario de disponibilidad** — La vista más pedida por recepcionistas

---

> **💡 Filosofía:** Cada feature se implementa de forma modular. Un nuevo hook, un nuevo componente, una nueva página. Sin romper lo que ya funciona.
