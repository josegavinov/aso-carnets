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
            throw new Error(jugador.error || "Ocurrió un error al buscar el jugador.");
        }

        // --- SECCIÓN DE FECHAS CORREGIDA ---
        
        // Formatear Fecha de Nacimiento (Método seguro)
        // Tomamos "2005-06-04", lo separamos en ["2005", "06", "04"] y lo reordenamos.
        const [anioNac, mesNac, diaNac] = jugador.fechaNacimiento.split('-');
        document.getElementById('fecha-jugador').innerText = `${diaNac}-${mesNac}-${anioNac}`;

        // Formatear Fecha de Expiración (Método seguro)
        // Tomamos "2026-09-30 20:22:28", nos quedamos con "2026-09-30",
        // lo separamos en ["2026", "09", "30"] y lo reordenamos.
        const fechaExpString = jugador.fechaExpiracion.split(' ')[0];
        const [anioExp, mesExp, diaExp] = fechaExpString.split('-');
        const fechaExpiracionBonita = `${diaExp}-${mesExp}-${anioExp}`;
        
        document.getElementById('expiracion-jugador').innerText = fechaExpiracionBonita;

        // --- FIN DE SECCIÓN CORREGIDA ---

        const fechaActual = new Date();
        const fechaExpiracion = new Date(jugador.fechaExpiracion);

        if (fechaActual > fechaExpiracion) {
            mostrarError(`El carnet de ${jugador.nombre} ha expirado el ${fechaExpiracionBonita}.`);
            return;
        }

        document.getElementById('nombre-jugador').innerText = jugador.nombre;
        document.getElementById('cedula-jugador').innerText = jugador.cedula;
        document.getElementById('camiseta-jugador').innerText = jugador.camiseta;
        
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