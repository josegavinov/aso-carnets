// Archivo: netlify/functions/get-roster.js (Versión final y funcional)

exports.handler = async function (event, context) {
    const dbUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    const torneo = event.queryStringParameters.torneo;
    const equipo = event.queryStringParameters.equipo;

    if (!torneo || !equipo) {
        return { statusCode: 400, body: JSON.stringify({ error: "Faltan parámetros de torneo o equipo" }) };
    }

    try {
        const response = await fetch(dbUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                statements: [{
                    q: `SELECT j.nombre, j.fechaNacimiento, j.camiseta 
                        FROM jugadores j
                        INNER JOIN inscripciones i ON j.id = i.jugador_id
                        WHERE i.torneo_nombre = ? AND i.equipo_nombre = ?
                        ORDER BY j.camiseta`,
                    params: [torneo, equipo],
                }]
            }),
        });

        const data = await response.json();

        if (data.error) { throw new Error(data.error.message); }

        // ----- LA MISMA CORRECCIÓN APLICADA AQUÍ -----
        const result = data[0].results;
        
        const columns = result.columns;
        const rows = result.rows.map(rowValues => {
            const playerObject = {};
            for (let i = 0; i < columns.length; i++) {
                playerObject[columns[i]] = rowValues[i];
            }
            return playerObject;
        });
        // ------------------------------------------

        return {
            statusCode: 200,
            body: JSON.stringify(rows),
        };

    } catch (error) {
        console.error("Error en get-roster:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "No se pudo obtener la lista del equipo." }) };
    }
};