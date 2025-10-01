// Archivo: roster.js
window.onload = async function() {
    const params = new URLSearchParams(window.location.search);
    const torneo = params.get('torneo');
    const equipo = params.get('equipo');

    if (!torneo || !equipo) {
        document.getElementById('nombre-equipo').innerText = "Información incompleta";
        return;
    }

    document.getElementById('nombre-equipo').innerText = `Roster de ${equipo} | ${torneo}`;
    document.title = `Roster de ${equipo}`;

    try {
        const response = await fetch(`/.netlify/functions/get-roster?torneo=${encodeURIComponent(torneo)}&equipo=${encodeURIComponent(equipo)}`);
        const jugadores = await response.json();
        
        const tablaBody = document.querySelector("#roster-tabla tbody");
        
        if (!response.ok || !jugadores) {
            tablaBody.innerHTML = `<tr><td colspan="3">${jugadores.error || 'No se pudo cargar el roster.'}</td></tr>`;
            return;
        }

        if (jugadores.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="3">No se encontraron jugadores inscritos para este equipo en este torneo.</td></tr>';
            return;
        }

        jugadores.forEach(jugador => {
            const edad = calcularEdad(jugador.fechaNacimiento);
            const fila = `<tr><td>${jugador.camiseta}</td><td>${jugador.nombre}</td><td>${edad}</td></tr>`;
            tablaBody.innerHTML += fila;
        });

    } catch (error) {
        console.error("Error:", error);
        document.getElementById('nombre-equipo').innerText = "Error al cargar el roster.";
    }
};

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const cumpleanos = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }
    return edad;
}