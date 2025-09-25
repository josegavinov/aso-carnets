
CREATE TABLE jugadores (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  nombre TEXT NOT NULL,
  cedula TEXT UNIQUE NOT NULL,
  fechaNacimiento DATE NOT NULL,
  camiseta INTEGER NOT NULL CHECK (camiseta >= 0 AND camiseta <= 100),
  logoEquipoURL TEXT NOT NULL,
  fotoFrontalURL TEXT NOT NULL,
  fotoTraseraURL TEXT NOT NULL,
  fechaCreacion DATETIME DEFAULT (datetime('now', 'localtime')),
  fechaExpiracion DATETIME AS (datetime(fechaCreacion, '+1 year')) STORED
);