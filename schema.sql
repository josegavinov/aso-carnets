-- Archivo: schema.sql (Versión final con campos opcionales)

-- Tabla para almacenar la información permanente de cada jugador (su "pasaporte")
CREATE TABLE IF NOT EXISTS jugadores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    cedula TEXT NOT NULL UNIQUE,
    fechaNacimiento DATE NOT NULL,
    camiseta INTEGER NOT NULL,
    equipo TEXT NOT NULL,
    posicion TEXT,                      -- Opcional
    fotoJugadorURL TEXT,                -- Opcional
    logoEquipoURL TEXT,                 -- Opcional
    fotoFrontalURL TEXT,                -- Opcional
    fotoTraseraURL TEXT,                -- Opcional
    fechaCreacion DATETIME DEFAULT (datetime('now', 'localtime')),
    fechaExpiracion DATETIME AS (datetime(fechaCreacion, '+1 year')) STORED
);

-- Tabla para inscribir jugadores a torneos específicos con un equipo específico
CREATE TABLE IF NOT EXISTS inscripciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    torneo_nombre TEXT NOT NULL,
    equipo_nombre TEXT NOT NULL,
    jugador_id INTEGER NOT NULL,
    FOREIGN KEY (jugador_id) REFERENCES jugadores(id)
);