/**
 * Datos Operativos — SelvaStay Pro
 * Datos locales para modo offline y desarrollo sin Supabase.
 * Estos datos simulan operaciones reales del eco-lodge.
 */

export const demoLodge = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  nombre: 'SelvaStay Tarapoto',
  direccion: 'Km 12 Carretera a Lamas, San Martín, Perú',
  telefono: '042-585-200',
  email: 'reservas@selvastay.pe',
};

export const demoHabitaciones = [
  // Nivel 100 — Planta Baja
  { id: 'h1',  lodge_id: demoLodge.id, numero: '101', tipo: 'simple',    precio_noche: 85,  estado: 'disponible',    capacidad: 2, descripcion: 'Habitación simple con vista al jardín tropical' },
  { id: 'h2',  lodge_id: demoLodge.id, numero: '102', tipo: 'simple',    precio_noche: 85,  estado: 'ocupada',       capacidad: 2, descripcion: 'Habitación simple con ventilador de techo' },
  { id: 'h3',  lodge_id: demoLodge.id, numero: '103', tipo: 'doble',     precio_noche: 130, estado: 'ocupada',       capacidad: 4, descripcion: 'Habitación doble con balcón al río' },
  { id: 'h4',  lodge_id: demoLodge.id, numero: '104', tipo: 'doble',     precio_noche: 130, estado: 'reservada',     capacidad: 4, descripcion: 'Habitación doble con hamaca y terraza' },
  { id: 'h12', lodge_id: demoLodge.id, numero: '105', tipo: 'simple',    precio_noche: 90,  estado: 'disponible',    capacidad: 2, descripcion: 'Habitación simple renovada con aire acondicionado' },
  { id: 'h13', lodge_id: demoLodge.id, numero: '106', tipo: 'doble',     precio_noche: 140, estado: 'reservada',     capacidad: 4, descripcion: 'Habitación doble superior con minibar' },
  { id: 'h14', lodge_id: demoLodge.id, numero: '107', tipo: 'simple',    precio_noche: 90,  estado: 'limpieza',      capacidad: 2, descripcion: 'Habitación compacta recién desocupada' },

  // Nivel 200 — Planta Alta
  { id: 'h5',  lodge_id: demoLodge.id, numero: '201', tipo: 'suite',     precio_noche: 220, estado: 'disponible',    capacidad: 2, descripcion: 'Suite premium con jacuzzi privado' },
  { id: 'h6',  lodge_id: demoLodge.id, numero: '202', tipo: 'suite',     precio_noche: 220, estado: 'ocupada',       capacidad: 2, descripcion: 'Suite con vista panorámica a la cascada' },
  { id: 'h15', lodge_id: demoLodge.id, numero: '203', tipo: 'suite',     precio_noche: 250, estado: 'disponible',    capacidad: 2, descripcion: 'Suite Imperial con sala de estar' },
  { id: 'h16', lodge_id: demoLodge.id, numero: '204', tipo: 'doble',     precio_noche: 160, estado: 'ocupada',       capacidad: 4, descripcion: 'Doble superior con vista al valle' },

  // Cabañas y Experiencias
  { id: 'h7',  lodge_id: demoLodge.id, numero: 'C-01', tipo: 'cabaña',   precio_noche: 190, estado: 'ocupada',       capacidad: 6, descripcion: 'Cabaña familiar junto al río Mayo' },
  { id: 'h8',  lodge_id: demoLodge.id, numero: 'C-02', tipo: 'cabaña',   precio_noche: 190, estado: 'mantenimiento', capacidad: 6, descripcion: 'Cabaña rústica en restauración programada' },
  { id: 'h9',  lodge_id: demoLodge.id, numero: 'B-01', tipo: 'bungalow', precio_noche: 280, estado: 'disponible',    capacidad: 4, descripcion: 'Bungalow de lujo con piscina privada' },
  { id: 'h10', lodge_id: demoLodge.id, numero: 'G-01', tipo: 'glamping', precio_noche: 160, estado: 'disponible',    capacidad: 2, descripcion: 'Glamping bajo las estrellas amazónicas' },
  { id: 'h11', lodge_id: demoLodge.id, numero: 'G-02', tipo: 'glamping', precio_noche: 160, estado: 'limpieza',      capacidad: 2, descripcion: 'Glamping con fogata y telescopio' },
];

export const demoClientes = [
  { id: 'c1', nombre_completo: 'Carlos Eduardo Mendoza Ríos',   tipo_doc: 'DNI',       documento_id: '72345678',  telefono: '912-345-678', email: 'carlos.mendoza@gmail.com',     nacionalidad: 'Peruana' },
  { id: 'c2', nombre_completo: 'Ana María Torres Vega',          tipo_doc: 'DNI',       documento_id: '45678901',  telefono: '945-678-901', email: 'ana.torres@outlook.com',       nacionalidad: 'Peruana' },
  { id: 'c3', nombre_completo: 'Pierre Dubois Laurent',          tipo_doc: 'PASAPORTE', documento_id: 'FR2839471', telefono: '+33-612-345', email: 'pierre.dubois@orange.fr',      nacionalidad: 'Francesa' },
  { id: 'c4', nombre_completo: 'Martha Elizabeth Smith',          tipo_doc: 'PASAPORTE', documento_id: 'US5847293', telefono: '+1-555-0199', email: 'martha.smith@yahoo.com',       nacionalidad: 'Estadounidense' },
  { id: 'c5', nombre_completo: 'Roberto Alejandro García Flores', tipo_doc: 'DNI',       documento_id: '10482756',  telefono: '976-482-315', email: 'roberto.garcia@hotmail.com',   nacionalidad: 'Peruana' },
  { id: 'c6', nombre_completo: 'Lucía Fernanda Paredes Ruiz',    tipo_doc: 'DNI',       documento_id: '48293156',  telefono: '923-715-842', email: 'lucia.paredes@gmail.com',      nacionalidad: 'Peruana' },
  { id: 'c7', nombre_completo: 'Hans Müller Weber',              tipo_doc: 'PASAPORTE', documento_id: 'DE7493820', telefono: '+49-176-3829', email: 'hans.muller@web.de',          nacionalidad: 'Alemana' },
  { id: 'c8', nombre_completo: 'Valentina Rodríguez Sánchez',    tipo_doc: 'DNI',       documento_id: '73829461',  telefono: '951-283-647', email: 'valentina.rdzs@gmail.com',    nacionalidad: 'Peruana' },
];

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const inTwoDays = new Date(today);
inTwoDays.setDate(inTwoDays.getDate() + 2);
const inThreeDays = new Date(today);
inThreeDays.setDate(inThreeDays.getDate() + 3);
const inFiveDays = new Date(today);
inFiveDays.setDate(inFiveDays.getDate() + 5);

const fmt = (d) => d.toISOString().split('T')[0];

export const demoReservas = [
  // Huéspedes actualmente hospedados (check-in realizado)
  {
    id: 'r1',
    cliente_id: 'c1',
    habitacion_id: 'h6',  // Suite 202 — ocupada
    fecha_ingreso: fmt(twoDaysAgo),
    fecha_salida: fmt(inTwoDays),
    estado: 'checkin',
    total_precio: 880,
    num_huespedes: 2,
    created_at: twoDaysAgo.toISOString(),
    cliente: demoClientes[0],
    habitacion: demoHabitaciones.find(h => h.id === 'h6'),
  },
  {
    id: 'r2',
    cliente_id: 'c3',
    habitacion_id: 'h3',  // Doble 103 — ocupada
    fecha_ingreso: fmt(yesterday),
    fecha_salida: fmt(inThreeDays),
    estado: 'checkin',
    total_precio: 520,
    num_huespedes: 3,
    created_at: yesterday.toISOString(),
    cliente: demoClientes[2],
    habitacion: demoHabitaciones.find(h => h.id === 'h3'),
  },
  {
    id: 'r3',
    cliente_id: 'c5',
    habitacion_id: 'h7',  // Cabaña C-01 — ocupada
    fecha_ingreso: fmt(twoDaysAgo),
    fecha_salida: fmt(inFiveDays),
    estado: 'checkin',
    total_precio: 1330,
    num_huespedes: 5,
    created_at: twoDaysAgo.toISOString(),
    cliente: demoClientes[4],
    habitacion: demoHabitaciones.find(h => h.id === 'h7'),
  },
  {
    id: 'r4',
    cliente_id: 'c4',
    habitacion_id: 'h16', // Doble 204 — ocupada
    fecha_ingreso: fmt(yesterday),
    fecha_salida: fmt(tomorrow),
    estado: 'checkin',
    total_precio: 320,
    num_huespedes: 2,
    created_at: yesterday.toISOString(),
    cliente: demoClientes[3],
    habitacion: demoHabitaciones.find(h => h.id === 'h16'),
  },
  {
    id: 'r5',
    cliente_id: 'c8',
    habitacion_id: 'h2',  // Simple 102 — ocupada
    fecha_ingreso: fmt(today),
    fecha_salida: fmt(inTwoDays),
    estado: 'checkin',
    total_precio: 170,
    num_huespedes: 1,
    created_at: today.toISOString(),
    cliente: demoClientes[7],
    habitacion: demoHabitaciones.find(h => h.id === 'h2'),
  },

  // Reservas confirmadas (llegarán pronto)
  {
    id: 'r6',
    cliente_id: 'c2',
    habitacion_id: 'h4',  // Doble 104 — reservada
    fecha_ingreso: fmt(tomorrow),
    fecha_salida: fmt(inFiveDays),
    estado: 'confirmada',
    total_precio: 520,
    num_huespedes: 4,
    created_at: today.toISOString(),
    cliente: demoClientes[1],
    habitacion: demoHabitaciones.find(h => h.id === 'h4'),
  },
  {
    id: 'r7',
    cliente_id: 'c7',
    habitacion_id: 'h13', // Doble 106 — reservada
    fecha_ingreso: fmt(inTwoDays),
    fecha_salida: fmt(inFiveDays),
    estado: 'confirmada',
    total_precio: 420,
    num_huespedes: 2,
    created_at: today.toISOString(),
    cliente: demoClientes[6],
    habitacion: demoHabitaciones.find(h => h.id === 'h13'),
  },

  // Reserva completada recientemente (checkout)
  {
    id: 'r8',
    cliente_id: 'c6',
    habitacion_id: 'h14', // Simple 107 — en limpieza tras checkout
    fecha_ingreso: fmt(twoDaysAgo),
    fecha_salida: fmt(today),
    estado: 'checkout',
    total_precio: 180,
    num_huespedes: 1,
    created_at: twoDaysAgo.toISOString(),
    cliente: demoClientes[5],
    habitacion: demoHabitaciones.find(h => h.id === 'h14'),
  },
];

export const demoServicios = [
  { id: 's1', reserva_id: 'r1', tipo: 'restaurante', descripcion: 'Cena amazónica para 2 personas',        monto: 120, cantidad: 1 },
  { id: 's2', reserva_id: 'r1', tipo: 'tour',        descripcion: 'Tour Cataratas de Ahuashiyacu',         monto: 80,  cantidad: 2 },
  { id: 's3', reserva_id: 'r1', tipo: 'spa',         descripcion: 'Masaje relajante de 60 minutos',        monto: 95,  cantidad: 1 },
  { id: 's4', reserva_id: 'r3', tipo: 'tour',        descripcion: 'Paseo en bote por el río Mayo',         monto: 60,  cantidad: 5 },
  { id: 's5', reserva_id: 'r3', tipo: 'restaurante',  descripcion: 'Almuerzo típico familiar',              monto: 85,  cantidad: 1 },
  { id: 's6', reserva_id: 'r4', tipo: 'transporte',   descripcion: 'Traslado aeropuerto - lodge',           monto: 45,  cantidad: 2 },
  { id: 's7', reserva_id: 'r2', tipo: 'restaurante',  descripcion: 'Desayuno buffet continental',           monto: 35,  cantidad: 3 },
  { id: 's8', reserva_id: 'r5', tipo: 'lavanderia',   descripcion: 'Servicio de lavado y planchado express', monto: 25,  cantidad: 1 },
  { id: 's9', reserva_id: 'r8', tipo: 'tour',         descripcion: 'Visita al Museo del Cacao',              monto: 40,  cantidad: 1 },
];
