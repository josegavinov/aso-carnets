// Archivo: netlify/functions/getPlayer.js (Versión final y funcional)

exports.handler = async function (event, context) {
    // Volvemos a usar las variables de entorno, es más seguro y profesional.
    const dbUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    const playerId = event.queryStringParameters.id;

    if (!playerId) {
        return { statusCode: 400, body: JSON.stringify({ error: "ID de jugador no especificado" }) };
    }

    try {
        const response = await fetch(dbUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                statements: [{ q: "SELECT * FROM jugadores WHERE id = ?", params: [playerId] }]
            }),
        });

        const data = await response.json();

        if (data.error) { throw new Error(data.error.message); }

        // ----- LA CORRECCIÓN CLAVE ESTÁ AQUÍ -----
        // Leemos la respuesta como una lista y accedemos al primer elemento.
        const result = data[0].results;

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: `No se encontró ningún jugador con el ID ${playerId}` }),
            };
        }

        // Reconstruimos el objeto del jugador combinando columnas y valores
        const columns = result.columns;
        const values = result.rows[0];
        const formattedPlayer = {};
        for (let i = 0; i < columns.length; i++) {
            formattedPlayer[columns[i]] = values[i];
        }
        // ------------------------------------------

        return {
            statusCode: 200,
            body: JSON.stringify(formattedPlayer),
        };

    } catch (error) {
        console.error("Error en getPlayer:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "No se pudo obtener la información del jugador." }) };
    }
};