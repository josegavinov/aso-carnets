-- Archivo: schema.sql (Versión final para el modelo de eventos)

-- Borra las tablas si ya existen para empezar desde cero.
DROP TABLE IF EXISTS inscripciones;
DROP TABLE IF EXISTS jugadores;

-- Tabla Maestra de Jugadores
CREATE TABLE jugadores (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  nombre TEXT NOT NULL,
  cedula TEXT UNIQUE NOT NULL,
  fechaNacimiento DATE NOT NULL,
  camiseta INTEGER NOT NULL CHECK (camiseta >= 0 AND camiseta <= 100),
  equipo TEXT NOT NULL, -- Columna para el equipo principal/actual
  logoEquipoURL TEXT NOT NULL,
  fotoFrontalURL TEXT NOT NULL,
  fotoTraseraURL TEXT NOT NULL,
  fechaCreacion DATETIME DEFAULT (datetime('now', 'localtime')),
  fechaExpiracion DATETIME AS (datetime(fechaCreacion, '+1 year')) STORED
);

-- Tabla de Registros de Eventos
CREATE TABLE inscripciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  torneo_nombre TEXT NOT NULL,
  equipo_nombre TEXT NOT NULL,
  jugador_id INTEGER NOT NULL,
  FOREIGN KEY (jugador_id) REFERENCES jugadores(id)
);