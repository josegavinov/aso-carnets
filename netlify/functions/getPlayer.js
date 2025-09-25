// Archivo: netlify/functions/getPlayer.js (Versión para Turso)
// Propósito: Conectarse de forma segura a Turso para buscar UN solo jugador por su ID.

import { createClient } from "@libsql/client";

// Lee las credenciales seguras desde las variables de entorno configuradas en Netlify
const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

// Crea el cliente de Turso que usaremos para hacer las consultas
const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

// Esta es la función principal que Netlify ejecutará
exports.handler = async function (event, context) {
  // 1. Obtenemos el ID del jugador que nos manda el script del navegador
  const jugadorId = event.queryStringParameters.id;

  if (!jugadorId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "ID de jugador no especificado" }),
    };
  }

  try {
    // 2. Ejecutamos una consulta SQL para buscar al jugador por su ID
    const rs = await client.execute({
      sql: "SELECT * FROM jugadores WHERE id = ?",
      args: [jugadorId],
    });

    // Si la consulta no devuelve ninguna fila, el jugador no fue encontrado
    if (rs.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Jugador no encontrado" }),
      };
    }

    // 3. Devolvemos la primera (y única) fila encontrada al navegador
    return {
      statusCode: 200,
      body: JSON.stringify(rs.rows[0]),
    };

  } catch (error) {
    // Si algo sale mal, devolvemos un error genérico
    console.error("Error en la función serverless:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "No se pudo obtener la información del jugador" }),
    };
  }
};