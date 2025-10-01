// Archivo: agregar_jugador.js (Versión final y victoriosa)
require('dotenv').config();
const readlineSync = require('readline-sync');

const dbUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

async function agregarJugador() {
    console.log("--- ⚽ Nuevo Jugador (Pasaporte Anual) ---");
    const nombre = readlineSync.question('Nombre completo: ');
    const cedula = readlineSync.question('Cédula: ');
    const fechaNacimiento = readlineSync.question('Fecha de Nacimiento (YYYY-MM-DD): ');
    const camiseta = readlineSync.question('Número de camiseta: ');
    const equipo = readlineSync.question('Equipo principal/actual: ');
    const logoEquipoURL = readlineSync.question('URL del logo del equipo: ');
    const fotoFrontalURL = readlineSync.question('URL de la foto frontal: ');
    const fotoTraseraURL = readlineSync.question('URL de la foto trasera: ');
    
    console.log("\nInsertando en la base de datos...");

    try {
        const response = await fetch(dbUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                statements: [
                    {
                        // La magia: INSERT que devuelve el ID que acaba de crear.
                        q: `INSERT INTO jugadores (nombre, cedula, fechaNacimiento, camiseta, equipo, logoEquipoURL, fotoFrontalURL, fotoTraseraURL) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
                        params: [nombre, cedula, fechaNacimiento, camiseta, equipo, logoEquipoURL, fotoFrontalURL, fotoTraseraURL],
                    }
                ],
            }),
        });

        const data = await response.json();
        
        // Verificamos el error usando la estructura correcta
        if (data.error) {
            throw new Error(data.error.message);
        }
        if (data[0].error) {
            throw new Error(data[0].error.message);
        }

        // Leemos el ID devuelto usando la estructura correcta que descubrimos
        const nuevoId = data[0].results.rows[0][0];

        console.log("\n✅ ¡Jugador agregado con éxito!");
        console.log(`🆔 ID Asignado: ${nuevoId}. Su carnet es válido por 1 año.`);

    } catch (error) {
        console.error("\n❌ ERROR: No se pudo agregar al jugador.");
        console.error("Razón:", error.message);
    }
}

agregarJugador();   