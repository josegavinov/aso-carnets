// Archivo: inscribir_equipo.js (Versión con manejo de errores corregido)
require('dotenv').config();
const readlineSync = require('readline-sync');

const dbUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

async function inscribirEquipo() {
    console.log("--- 📝 Inscribir Equipo a Torneo ---");
    const torneo = readlineSync.question('Nombre del Torneo: ');
    const equipo = readlineSync.question('Nombre del Equipo para este torneo: ');
    const idsInput = readlineSync.question('Ingresa los IDs de los jugadores, separados por comas (ej: 1, 5, 8, 12): ');
    
    const jugadorIds = idsInput.split(',').map(id => parseInt(id.trim()));
    if (jugadorIds.some(isNaN)) {
        console.error("Error: Asegúrate de que todos los IDs sean números.");
        return;
    }

    const statements = jugadorIds.map(jugadorId => ({
        q: 'INSERT INTO inscripciones (torneo_nombre, equipo_nombre, jugador_id) VALUES (?, ?, ?)',
        params: [torneo, equipo, jugadorId],
    }));

    console.log(`\nInscribiendo ${jugadorIds.length} jugadores al torneo...`);

    try {
        const response = await fetch(dbUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ statements: statements }),
        });

        const data = await response.json();

        // --- CORRECCIÓN EN EL MANEJO DE ERRORES ---
        // Verificamos si la respuesta es un error directo
        if (data.error) {
            throw new Error(data.error); // Usamos 'data.error' directamente
        }
        // Verificamos si la respuesta es una lista y el primer elemento es un error
        // El '?' (optional chaining) evita un error si 'data[0]' no existe.
        if (data[0]?.error) {
            throw new Error(data[0].error); // Usamos 'data[0].error' directamente
        }
        // --- FIN DE LA CORRECCIÓN ---

        const linkRoster = `https://aso-carnets.netlify.app/roster.html?torneo=${encodeURIComponent(torneo)}&equipo=${encodeURIComponent(equipo)}`;
        console.log("\n✅ ¡Equipo inscrito con éxito!");
        console.log(`🔗 Link del Roster Virtual: ${linkRoster}`);

    } catch (error) {
        console.error("\n❌ ERROR: No se pudo inscribir al equipo.");
        // Ahora 'error.message' tendrá el texto correcto del error de la base de datos
        console.error("Razón:", error.message);
    }
}

inscribirEquipo();