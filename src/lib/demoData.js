/**
 * Datos Demo — SelvaStay Pro
 * Datos locales para modo offline y desarrollo sin Supabase.
 */

export const demoLodge = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  nombre: 'EcoLodge Tarapoto',
  direccion: 'Km 12 Carretera a Lamas, San Martín',
  telefono: '942-555-100',
  email: 'info@ecolodgetarapoto.pe',
};

export const demoHabitaciones = [
  // Nivel 100
  { id: 'h1', lodge_id: demoLodge.id, numero: '101', tipo: 'simple',   precio_noche: 80,  estado: 'disponible',    capacidad: 2, descripcion: 'Habitación simple con vista al jardín' },
  { id: 'h2', lodge_id: demoLodge.id, numero: '102', tipo: 'simple',   precio_noche: 80,  estado: 'disponible',    capacidad: 2, descripcion: 'Habitación simple con ventilador' },
  { id: 'h3', lodge_id: demoLodge.id, numero: '103', tipo: 'doble',    precio_noche: 120, estado: 'disponible',    capacidad: 4, descripcion: 'Habitación doble con balcón' },
  { id: 'h4', lodge_id: demoLodge.id, numero: '104', tipo: 'doble',    precio_noche: 120, estado: 'reservada',     capacidad: 4, descripcion: 'Habitación doble con hamaca' },
  { id: 'h12', lodge_id: demoLodge.id, numero: '105', tipo: 'simple',    precio_noche: 85,  estado: 'disponible',  capacidad: 2, descripcion: 'Habitación simple renovada' },
  { id: 'h13', lodge_id: demoLodge.id, numero: '106', tipo: 'doble',    precio_noche: 130, estado: 'disponible',   capacidad: 4, descripcion: 'Habitación doble superior' },
  { id: 'h14', lodge_id: demoLodge.id, numero: '107', tipo: 'simple',   precio_noche: 90,  estado: 'limpieza',     capacidad: 2, descripcion: 'Habitación compacta' },

  // Nivel 200
  { id: 'h5', lodge_id: demoLodge.id, numero: '201', tipo: 'suite',    precio_noche: 200, estado: 'disponible',    capacidad: 2, descripcion: 'Suite premium con jacuzzi' },
  { id: 'h6', lodge_id: demoLodge.id, numero: '202', tipo: 'suite',    precio_noche: 200, estado: 'ocupada',       capacidad: 2, descripcion: 'Suite con vista a la cascada' },
  { id: 'h15', lodge_id: demoLodge.id, numero: '203', tipo: 'suite',    precio_noche: 220, estado: 'disponible',   capacidad: 2, descripcion: 'Suite Imperial' },
  { id: 'h16', lodge_id: demoLodge.id, numero: '204', tipo: 'doble',    precio_noche: 150, estado: 'ocupada',      capacidad: 4, descripcion: 'Doble en nivel alto' },

  // Cabañas y Glamping
  { id: 'h7', lodge_id: demoLodge.id, numero: 'C-01', tipo: 'cabaña',  precio_noche: 180, estado: 'disponible',    capacidad: 6, descripcion: 'Cabaña familiar junto al río' },
  { id: 'h8', lodge_id: demoLodge.id, numero: 'C-02', tipo: 'cabaña',  precio_noche: 180, estado: 'mantenimiento', capacidad: 6, descripcion: 'Cabaña rústica en restauración' },
  { id: 'h9', lodge_id: demoLodge.id, numero: 'B-01', tipo: 'bungalow', precio_noche: 250, estado: 'disponible',   capacidad: 4, descripcion: 'Bungalow de lujo con piscina privada' },
  { id: 'h10', lodge_id: demoLodge.id, numero: 'G-01', tipo: 'glamping', precio_noche: 150, estado: 'disponible',  capacidad: 2, descripcion: 'Glamping bajo las estrellas' },
  { id: 'h11', lodge_id: demoLodge.id, numero: 'G-02', tipo: 'glamping', precio_noche: 150, estado: 'limpieza',    capacidad: 2, descripcion: 'Glamping con fogata privada' },
];

export const demoClientes = [
  { id: 'c1', nombre_completo: 'Carlos Mendoza Ríos',   tipo_doc: 'DNI', documento_id: '72345678', telefono: '912-345-678', email: 'carlos.mendoza@email.com', nacionalidad: 'Peruana' },
  { id: 'c2', nombre_completo: 'Ana María Torres Vega', tipo_doc: 'DNI', documento_id: '45678901', telefono: '945-678-901', email: 'anatorres@email.com',      nacionalidad: 'Peruana' },
  { id: 'c3', nombre_completo: 'Pierre Dubois',         tipo_doc: 'PASAPORTE', documento_id: 'FR123456', telefono: '+33-612-345', email: 'pierre@email.fr',    nacionalidad: 'Francesa' },
  { id: 'c4', nombre_completo: 'Martha Smith',          tipo_doc: 'PASAPORTE', documento_id: 'US987654', telefono: '+1-555-0199', email: 'martha@email.com',    nacionalidad: 'Estadounidense' },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 3);

export const demoReservas = [
  {
    id: 'r1',
    cliente_id: 'c1',
    habitacion_id: 'h6',
    fecha_ingreso: today.toISOString().split('T')[0],
    fecha_salida: dayAfter.toISOString().split('T')[0],
    estado: 'checkin',
    total_precio: 600,
    num_huespedes: 2,
    created_at: today.toISOString(),
    cliente: demoClientes[0],
    habitacion: demoHabitaciones[8],
  },
  {
    id: 'r2',
    cliente_id: 'c2',
    habitacion_id: 'h4',
    fecha_ingreso: tomorrow.toISOString().split('T')[0],
    fecha_salida: dayAfter.toISOString().split('T')[0],
    estado: 'confirmada',
    total_precio: 240,
    num_huespedes: 3,
    created_at: today.toISOString(),
    cliente: demoClientes[1],
    habitacion: demoHabitaciones[3],
  },
  {
    id: 'r4',
    cliente_id: 'c4',
    habitacion_id: 'h16',
    fecha_ingreso: today.toISOString().split('T')[0],
    fecha_salida: tomorrow.toISOString().split('T')[0],
    estado: 'checkin',
    total_precio: 150,
    num_huespedes: 2,
    created_at: today.toISOString(),
    cliente: demoClientes[3],
    habitacion: demoHabitaciones[10],
  },
];

export const demoServicios = [
  { id: 's1', reserva_id: 'r1', tipo: 'restaurante', descripcion: 'Cena amazónica para 2', monto: 120, cantidad: 1 },
  { id: 's2', reserva_id: 'r1', tipo: 'tour', descripcion: 'Tour Cataratas de Ahuashiyacu', monto: 80, cantidad: 2 },
  { id: 's3', reserva_id: 'r4', tipo: 'bebida', descripcion: 'Cóctel de Bienvenida', monto: 35, cantidad: 2 },
];
