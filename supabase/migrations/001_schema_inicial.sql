-- ============================================================
-- SELVASTAY PRO — Migración Inicial
-- Sistema de Gestión para Eco-Lodges | San Martín, Perú
-- ============================================================
-- Ejecutar este script en el SQL Editor de Supabase

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLA: lodges
-- Representa cada eco-lodge o recreo turístico registrado
-- ============================================================
CREATE TABLE IF NOT EXISTS lodges (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre        TEXT NOT NULL,
  ubicacion_geo POINT,                 -- latitud/longitud
  direccion     TEXT,
  telefono      TEXT,
  email         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE lodges IS 'Eco-lodges y recreos turísticos registrados en el sistema';

-- ============================================================
-- TABLA: habitaciones
-- Cada habitación pertenece a un lodge específico
-- ============================================================
CREATE TYPE tipo_habitacion AS ENUM (
  'simple', 'doble', 'suite', 'cabaña', 'bungalow', 'glamping'
);

CREATE TYPE estado_habitacion AS ENUM (
  'disponible', 'reservada', 'ocupada', 'mantenimiento', 'limpieza'
);

CREATE TABLE IF NOT EXISTS habitaciones (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lodge_id      UUID NOT NULL REFERENCES lodges(id) ON DELETE CASCADE,
  numero        TEXT NOT NULL,
  tipo          tipo_habitacion NOT NULL DEFAULT 'simple',
  precio_noche  NUMERIC(10, 2) NOT NULL CHECK (precio_noche >= 0),
  estado        estado_habitacion NOT NULL DEFAULT 'disponible',
  capacidad     INT NOT NULL DEFAULT 2 CHECK (capacidad > 0),
  descripcion   TEXT,
  imagen_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(lodge_id, numero)
);

COMMENT ON TABLE habitaciones IS 'Habitaciones de cada lodge con estado en tiempo real';

CREATE INDEX idx_habitaciones_lodge ON habitaciones(lodge_id);
CREATE INDEX idx_habitaciones_estado ON habitaciones(estado);

-- ============================================================
-- TABLA: clientes
-- Huéspedes y visitantes del lodge
-- ============================================================
CREATE TYPE tipo_documento AS ENUM ('DNI', 'CE', 'PASAPORTE', 'RUC');

CREATE TABLE IF NOT EXISTS clientes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_completo TEXT NOT NULL,
  tipo_doc        tipo_documento NOT NULL DEFAULT 'DNI',
  documento_id    TEXT NOT NULL UNIQUE,
  telefono        TEXT,
  email           TEXT,
  nacionalidad    TEXT DEFAULT 'Peruana',
  notas           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE clientes IS 'Registro de huéspedes y visitantes';

CREATE INDEX idx_clientes_documento ON clientes(documento_id);

-- ============================================================
-- TABLA: reservas
-- Reservas vinculadas a un cliente y una habitación
-- ============================================================
CREATE TYPE estado_reserva AS ENUM (
  'pendiente', 'confirmada', 'checkin', 'checkout', 'cancelada', 'no_show'
);

CREATE TABLE IF NOT EXISTS reservas (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id      UUID NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  habitacion_id   UUID NOT NULL REFERENCES habitaciones(id) ON DELETE RESTRICT,
  fecha_ingreso   DATE NOT NULL,
  fecha_salida    DATE NOT NULL,
  estado          estado_reserva NOT NULL DEFAULT 'pendiente',
  total_precio    NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_precio >= 0),
  notas           TEXT,
  num_huespedes   INT NOT NULL DEFAULT 1 CHECK (num_huespedes > 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CHECK (fecha_salida > fecha_ingreso)
);

COMMENT ON TABLE reservas IS 'Reservas de habitaciones con control de fechas';

CREATE INDEX idx_reservas_cliente ON reservas(cliente_id);
CREATE INDEX idx_reservas_habitacion ON reservas(habitacion_id);
CREATE INDEX idx_reservas_fechas ON reservas(fecha_ingreso, fecha_salida);
CREATE INDEX idx_reservas_estado ON reservas(estado);

-- ============================================================
-- TABLA: servicios_extra
-- Servicios adicionales (restaurante, tours, spa, etc.)
-- ============================================================
CREATE TYPE tipo_servicio AS ENUM (
  'restaurante', 'tour', 'transporte', 'spa', 'lavanderia', 'otro'
);

CREATE TABLE IF NOT EXISTS servicios_extra (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reserva_id  UUID NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
  tipo        tipo_servicio NOT NULL DEFAULT 'otro',
  descripcion TEXT NOT NULL,
  monto       NUMERIC(10, 2) NOT NULL CHECK (monto >= 0),
  cantidad    INT NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  fecha       DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE servicios_extra IS 'Consumos y servicios adicionales vinculados a una reserva';

CREATE INDEX idx_servicios_reserva ON servicios_extra(reserva_id);

-- ============================================================
-- FUNCIÓN: Calcular total de reserva automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION calcular_total_reserva()
RETURNS TRIGGER AS $$
DECLARE
  precio_hab NUMERIC(10, 2);
  dias INT;
  total_servicios NUMERIC(10, 2);
BEGIN
  -- Obtener precio por noche de la habitación
  SELECT precio_noche INTO precio_hab
  FROM habitaciones WHERE id = NEW.habitacion_id;
  
  -- Calcular noches
  dias := NEW.fecha_salida - NEW.fecha_ingreso;
  
  -- Calcular servicios extra existentes
  SELECT COALESCE(SUM(monto * cantidad), 0) INTO total_servicios
  FROM servicios_extra WHERE reserva_id = NEW.id;
  
  -- Actualizar total
  NEW.total_precio := (precio_hab * dias) + total_servicios;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calcular_total
  BEFORE INSERT OR UPDATE ON reservas
  FOR EACH ROW
  EXECUTE FUNCTION calcular_total_reserva();

-- ============================================================
-- FUNCIÓN: Actualizar estado de habitación al cambiar reserva
-- ============================================================
CREATE OR REPLACE FUNCTION sync_estado_habitacion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.estado = 'checkin' THEN
    UPDATE habitaciones SET estado = 'ocupada' WHERE id = NEW.habitacion_id;
  ELSIF NEW.estado = 'checkout' OR NEW.estado = 'cancelada' THEN
    UPDATE habitaciones SET estado = 'limpieza' WHERE id = NEW.habitacion_id;
  ELSIF NEW.estado = 'confirmada' THEN
    UPDATE habitaciones SET estado = 'reservada' WHERE id = NEW.habitacion_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_habitacion
  AFTER UPDATE OF estado ON reservas
  FOR EACH ROW
  EXECUTE FUNCTION sync_estado_habitacion();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE lodges ENABLE ROW LEVEL SECURITY;
ALTER TABLE habitaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios_extra ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden ver lodges"
  ON lodges FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuarios autenticados pueden gestionar lodges"
  ON lodges FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden ver habitaciones"
  ON habitaciones FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuarios autenticados pueden gestionar habitaciones"
  ON habitaciones FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden ver clientes"
  ON clientes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuarios autenticados pueden gestionar clientes"
  ON clientes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden ver reservas"
  ON reservas FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuarios autenticados pueden gestionar reservas"
  ON reservas FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden ver servicios"
  ON servicios_extra FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuarios autenticados pueden gestionar servicios"
  ON servicios_extra FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Políticas anon para modo demo / desarrollo
CREATE POLICY "Acceso anon lectura lodges" ON lodges FOR SELECT TO anon USING (true);
CREATE POLICY "Acceso anon todo lodges" ON lodges FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Acceso anon lectura habitaciones" ON habitaciones FOR SELECT TO anon USING (true);
CREATE POLICY "Acceso anon todo habitaciones" ON habitaciones FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Acceso anon lectura clientes" ON clientes FOR SELECT TO anon USING (true);
CREATE POLICY "Acceso anon todo clientes" ON clientes FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Acceso anon lectura reservas" ON reservas FOR SELECT TO anon USING (true);
CREATE POLICY "Acceso anon todo reservas" ON reservas FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Acceso anon lectura servicios" ON servicios_extra FOR SELECT TO anon USING (true);
CREATE POLICY "Acceso anon todo servicios" ON servicios_extra FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- HABILITAR REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE habitaciones;
ALTER PUBLICATION supabase_realtime ADD TABLE reservas;

-- ============================================================
-- DATOS SEED (Demo)
-- ============================================================
INSERT INTO lodges (id, nombre, direccion, telefono, email) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'EcoLodge Tarapoto', 'Km 12 Carretera a Lamas, San Martín', '942-555-100', 'info@ecolodgetarapoto.pe');

INSERT INTO habitaciones (lodge_id, numero, tipo, precio_noche, estado, capacidad, descripcion) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '101', 'simple',   80.00,  'disponible',   2, 'Habitación simple con vista al jardín'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '102', 'simple',   80.00,  'disponible',   2, 'Habitación simple con ventilador'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '103', 'doble',    120.00, 'disponible',   4, 'Habitación doble con balcón'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '104', 'doble',    120.00, 'reservada',    4, 'Habitación doble con hamaca'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '201', 'suite',    200.00, 'disponible',   2, 'Suite premium con jacuzzi'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '202', 'suite',    200.00, 'ocupada',      2, 'Suite con vista a la cascada'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'C-01', 'cabaña',  180.00, 'disponible',   6, 'Cabaña familiar junto al río'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'C-02', 'cabaña',  180.00, 'mantenimiento',6, 'Cabaña rústica en restauración'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'B-01', 'bungalow',250.00, 'disponible',   4, 'Bungalow de lujo con piscina privada'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'G-01', 'glamping', 150.00,'disponible',   2, 'Glamping bajo las estrellas'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'G-02', 'glamping', 150.00,'limpieza',     2, 'Glamping con fogata privada'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '105', 'simple',    85.00, 'disponible',   2, 'Habitación simple renovada');

INSERT INTO clientes (id, nombre_completo, tipo_doc, documento_id, telefono, email, nacionalidad) VALUES
  ('c1d2e3f4-a5b6-7890-cdef-123456789abc', 'Carlos Mendoza Ríos',   'DNI', '72345678', '912-345-678', 'carlos.mendoza@email.com', 'Peruana'),
  ('d2e3f4a5-b6c7-8901-defa-23456789abcd', 'Ana María Torres Vega', 'DNI', '45678901', '945-678-901', 'anatorres@email.com',      'Peruana');

-- ============================================================
-- FIN DE MIGRACIÓN
-- ============================================================
