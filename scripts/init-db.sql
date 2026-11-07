-- ============================================================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS PARA ERP DEMO COUNTRY CLUB
-- ============================================================================
-- Este script crea las tablas necesarias para el módulo de Pádel
-- Compatible con PostgreSQL y MySQL

-- ============================================================================
-- TABLA: CANCHAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS canchas (
  id VARCHAR(50) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  numero INT NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'Disponible',
  capacidad INT NOT NULL,
  tipo_superficie VARCHAR(50) NOT NULL,
  iluminacion BOOLEAN NOT NULL DEFAULT true,
  ultimo_mantenimiento TIMESTAMP NOT NULL,
  proximo_mantenimiento TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLA: SOCIOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS socios (
  id VARCHAR(50) PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(100),
  telefono VARCHAR(20),
  tipo_membresia VARCHAR(50) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'Activa',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLA: RESERVACIONES
-- ============================================================================
CREATE TABLE IF NOT EXISTS reservaciones (
  id VARCHAR(50) PRIMARY KEY,
  cancha_id VARCHAR(50) NOT NULL,
  socio_id VARCHAR(50) NOT NULL,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  jugadores JSON,
  estado VARCHAR(20) NOT NULL DEFAULT 'Confirmada',
  tipo_pago VARCHAR(50) NOT NULL,
  monto DECIMAL(10, 2) NOT NULL,
  notas TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cancha_id) REFERENCES canchas(id) ON DELETE CASCADE,
  FOREIGN KEY (socio_id) REFERENCES socios(id) ON DELETE CASCADE,
  INDEX idx_cancha_fecha (cancha_id, fecha),
  INDEX idx_socio_fecha (socio_id, fecha)
);

-- ============================================================================
-- TABLA: INSTRUCTORES
-- ============================================================================
CREATE TABLE IF NOT EXISTS instructores (
  id VARCHAR(50) PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(100),
  telefono VARCHAR(20),
  especialidad VARCHAR(100),
  horario_disponible VARCHAR(200),
  tarifa DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLA: CLASES
-- ============================================================================
CREATE TABLE IF NOT EXISTS clases (
  id VARCHAR(50) PRIMARY KEY,
  cancha_id VARCHAR(50) NOT NULL,
  instructor_id VARCHAR(50) NOT NULL,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  alumnos JSON,
  capacidad_maxima INT NOT NULL,
  tipo_clase VARCHAR(50) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'Programada',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cancha_id) REFERENCES canchas(id) ON DELETE CASCADE,
  FOREIGN KEY (instructor_id) REFERENCES instructores(id) ON DELETE CASCADE,
  INDEX idx_cancha_fecha (cancha_id, fecha),
  INDEX idx_instructor_fecha (instructor_id, fecha)
);

-- ============================================================================
-- DATOS DE EJEMPLO
-- ============================================================================

-- Insertar canchas de ejemplo
INSERT INTO canchas (id, nombre, numero, status, capacidad, tipo_superficie, iluminacion, ultimo_mantenimiento) VALUES
('CANCHA-001', 'Cancha 1', 1, 'Disponible', 4, 'Cemento', true, NOW()),
('CANCHA-002', 'Cancha 2', 2, 'Disponible', 4, 'Cemento', true, NOW()),
('CANCHA-003', 'Cancha 3', 3, 'Disponible', 4, 'Cemento', true, NOW()),
('CANCHA-004', 'Cancha 4', 4, 'Disponible', 4, 'Cemento', true, NOW());

-- Insertar socios de ejemplo
INSERT INTO socios (id, nombre, email, telefono, tipo_membresia, estado) VALUES
('SOC-001', 'Carlos Mendoza Ríos', 'cmendoza@email.com', '+52 123456789', 'Platino', 'Activa'),
('SOC-002', 'María Elena Gutiérrez', 'megutierrez@email.com', '+52 123456790', 'Oro', 'Activa'),
('SOC-003', 'Roberto Sánchez Villa', 'rsanchez@email.com', '+52 123456791', 'Platino', 'Activa'),
('SOC-004', 'Ana Patricia López', 'alopez@email.com', '+52 123456792', 'Diferida', 'Activa');

-- Insertar instructores de ejemplo
INSERT INTO instructores (id, nombre, email, telefono, especialidad, tarifa, estado) VALUES
('INST-001', 'Pro. Miguel Ángel Reyes', 'miguel@email.com', '+52 123456793', 'Pádel Profesional', 850.00, 'Activo'),
('INST-002', 'Pro. Laura Martínez', 'laura@email.com', '+52 123456794', 'Pádel Avanzado', 1200.00, 'Activo'),
('INST-003', 'Pro. David Ochoa', 'david@email.com', '+52 123456795', 'Pádel Grupal', 650.00, 'Activo');

-- ============================================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_reservaciones_estado ON reservaciones(estado);
CREATE INDEX IF NOT EXISTS idx_clases_estado ON clases(estado);
CREATE INDEX IF NOT EXISTS idx_socios_estado ON socios(estado);
CREATE INDEX IF NOT EXISTS idx_instructores_estado ON instructores(estado);
