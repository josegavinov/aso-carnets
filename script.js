// Archivo: script.js
// Propósito: Mostrar el carnet individual de forma segura, llamando a nuestra propia función serverless.

// No hay claves ni tokens aquí. ¡Este código es seguro para subir a GitHub!

// Esta función se ejecuta cuando la página ha cargado completamente.
window.onload = async function() {
    // Busca los parámetros en la URL (ej: ?id=1)
    const params = new URLSearchParams(window.location.search);
    const jugadorId = params.get('id');

    // Si no hay un ID en el enlace, muestra un error.
    if (!jugadorId) {
        mostrarError("No se especificó un ID de jugador.");
        return;
    }

    try {
        // Hacemos la llamada a nuestra propia función segura en Netlify, pasándole el ID del jugador.
        const response = await fetch(`/.netlify/functions/getPlayer?id=${jugadorId}`);
        const jugador = await response.json();

        // Si la función serverless devolvió un error (ej: jugador no encontrado), lo mostramos.
        if (!response.ok) {
            throw new Error(jugador.error || "Ocurrió un error al buscar el jugador.");
        }

        // --- VERIFICACIÓN DE EXPIRACIÓN ---
        const fechaActual = new Date();
        const fechaExpiracion = new Date(jugador.fechaExpiracion);

        // Compara si la fecha de hoy es posterior a la de expiración.
        if (fechaActual > fechaExpiracion) {
            mostrarError(`El carnet de ${jugador.nombre} ha expirado el ${fechaExpiracion.toLocaleDateString()}.`);
            document.querySelector('.main-content').style.display = 'none';
            document.querySelector('.cedula-seccion').style.display = 'none';
            return;
        }
        
        // --- RELLENAR LA PLANTILLA CON LOS DATOS ---
        // Si el carnet es válido, rellena la plantilla con los datos recibidos.
        document.getElementById('nombre-jugador').innerText = jugador.nombre;
        document.getElementById('cedula-jugador').innerText = jugador.cedula;
        document.getElementById('fecha-jugador').innerText = jugador.fechaNacimiento;
        document.getElementById('camiseta-jugador').innerText = jugador.camiseta;
        
        // Las imágenes en Airtable son un array, por eso tomamos la URL del primer elemento [0].
        if (jugador.logoEquipo && jugador.logoEquipo[0]) {
            document.getElementById('logo-equipo').src = jugador.logoEquipo[0].url;
        }
        if (jugador.fotoFrontal && jugador.fotoFrontal[0]) {
            document.getElementById('imagen-frontal').src = jugador.fotoFrontal[0].url;
        }
        if (jugador.fotoTrasera && jugador.fotoTrasera[0]) {
            document.getElementById('imagen-trasera').src = jugador.fotoTrasera[0].url;
        }
        
        document.title = `Carnet de ${jugador.nombre}`;

    } catch (error) {
        console.error("Error en el script principal:", error);
        mostrarError(error.message);
    }
};

// --- FUNCIÓN DE AYUDA PARA MOSTRAR ERRORES ---
function mostrarError(mensaje) {
    const container = document.querySelector('.carnet-container');
    container.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h1>Aviso</h1><p>${mensaje}</p>
        </div>`;
}