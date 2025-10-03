// Archivo: agregar_jugador.js (Versión con posición y foto de jugador)
require('dotenv').config();
const readlineSync = require('readline-sync');

// ... (El resto de la configuración de fetch se mantiene igual) ...
const dbUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

async function agregarJugador() {
    console.log("--- ⚽ Nuevo Jugador (Pasaporte Anual) ---");
    const nombre = readlineSync.question('Nombre completo: ');
    const cedula = readlineSync.question('Cédula: ');
    const fechaNacimiento = readlineSync.question('Fecha de Nacimiento (YYYY-MM-DD): ');
    const camiseta = readlineSync.question('Número de camiseta: ');
    const equipo = readlineSync.question('Equipo principal/actual: ');
    const posicion = readlineSync.question('Posición de juego (Base, Escolta, Alero, Ala-Pivot, Pivot): '); // <-- NUEVO
    const fotoJugadorURL = readlineSync.question('URL de la foto del jugador (circular): '); // <-- NUEVO
    const logoEquipoURL = readlineSync.question('URL del logo del equipo: ');
    const fotoFrontalURL = readlineSync.question('URL de la foto frontal de la cédula: ');
    const fotoTraseraURL = readlineSync.question('URL de la foto trasera de la cédula: ');
    
    console.log("\nInsertando en la base de datos...");

    try {
        const response = await fetch(dbUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                statements: [{
                    q: `INSERT INTO jugadores (nombre, cedula, fechaNacimiento, camiseta, equipo, posicion, fotoJugadorURL, logoEquipoURL, fotoFrontalURL, fotoTraseraURL) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`, // <-- NUEVO
                    params: [nombre, cedula, fechaNacimiento, camiseta, equipo, posicion, fotoJugadorURL, logoEquipoURL, fotoFrontalURL, fotoTraseraURL], // <-- NUEVO
                }]
            }),
        });

        const data = await response.json();
        
        if (data.error || data[0].error) {
            throw new Error(data.error?.message || data[0].error.message);
        }

        const nuevoId = data[0].results.rows[0][0];
        const linkCarnet = `https://aso-carnets.netlify.app/?id=${nuevoId}`;

        console.log("\n✅ ¡Jugador agregado con éxito!");
        console.log(`🆔 ID Asignado: ${nuevoId}`);
        console.log(`🔗 Link del Carnet Virtual: ${linkCarnet}`);

    } catch (error) {
        console.error("\n❌ ERROR: No se pudo agregar al jugador.");
        console.error("Razón:", error.message);
    }
}

agregarJugador();