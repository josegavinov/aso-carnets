// Archivo: script.js (Versión corregida para Turso)

window.onload = async function() {
    const params = new URLSearchParams(window.location.search);
    const jugadorId = params.get('id');

    if (!jugadorId) {
        mostrarError("No se especificó un ID de jugador.");
        return;
    }

    try {
        const response = await fetch(`/.netlify/functions/getPlayer?id=${jugadorId}`);
        const jugador = await response.json();

        if (!response.ok) {
            // Si la función devuelve un error (ej: 404), usamos el mensaje de error que nos manda
            throw new Error(jugador.error || "Ocurrió un error al buscar el jugador.");
        }

        const fechaActual = new Date();
        const fechaExpiracion = new Date(jugador.fechaExpiracion);

        if (fechaActual > fechaExpiracion) {
            mostrarError(`El carnet de ${jugador.nombre} ha expirado el ${fechaExpiracion.toLocaleDateString()}.`);
            return;
        }

        document.getElementById('nombre-jugador').innerText = jugador.nombre;
        document.getElementById('cedula-jugador').innerText = jugador.cedula;
        document.getElementById('fecha-jugador').innerText = jugador.fechaNacimiento;
        document.getElementById('camiseta-jugador').innerText = jugador.camiseta;
        
        // --- SECCIÓN CORREGIDA PARA LAS IMÁGENES DE TURSO ---
        // Ahora leemos la URL directamente de la propiedad correspondiente.
        if (jugador.logoEquipoURL) {
            document.getElementById('logo-equipo').src = jugador.logoEquipoURL;
        }
        if (jugador.fotoFrontalURL) {
            document.getElementById('imagen-frontal').src = jugador.fotoFrontalURL;
        }
        if (jugador.fotoTraseraURL) {
            document.getElementById('imagen-trasera').src = jugador.fotoTraseraURL;
        }
        
        document.title = `Carnet de ${jugador.nombre}`;

    } catch (error) {
        console.error("Error en el script principal:", error);
        mostrarError(error.message);
    }
};

function mostrarError(mensaje) {
    const container = document.querySelector('.carnet-container');
    container.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h1>Aviso</h1><p>${mensaje}</p>
        </div>`;
}