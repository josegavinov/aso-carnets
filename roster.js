// Archivo: roster.js (Versión interactiva)

// Función para formatear fechas a DD-MM-YYYY
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const [year, month, day] = dateString.split(' ')[0].split('-');
    return `${day}-${month}-${year}`;
}

window.onload = async function() {
    const params = new URLSearchParams(window.location.search);
    const torneo = params.get('torneo');
    const equipo = params.get('equipo');

    if (!torneo || !equipo) {
        document.getElementById('nombre-equipo').innerText = "Información de torneo incompleta";
        return;
    }

    document.getElementById('nombre-equipo').innerText = `Roster de ${equipo} | ${torneo}`;
    document.title = `Roster de ${equipo}`;

    try {
        const response = await fetch(`/.netlify/functions/get-roster?torneo=${encodeURIComponent(torneo)}&equipo=${encodeURIComponent(equipo)}`);
        const jugadores = await response.json();
        
        if (!response.ok) {
            throw new Error(jugadores.error || 'No se pudo cargar el roster.');
        }

        const rosterBody = document.getElementById('roster-body');
        if (jugadores.length === 0) {
            rosterBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No hay jugadores inscritos.</td></tr>';
            return;
        }

        // Guardamos una copia de todos los jugadores para el filtro
        window.todosLosJugadores = jugadores;
        renderRoster(jugadores); // Función que dibuja la tabla

    } catch (error) {
        console.error("Error:", error);
        document.getElementById('nombre-equipo').innerText = "Error al cargar el roster.";
    }

    // Añadir el listener para la barra de búsqueda
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keyup', handleSearch);
};

function renderRoster(jugadores) {
    const rosterBody = document.getElementById('roster-body');
    rosterBody.innerHTML = ''; // Limpiamos la tabla antes de dibujar

    jugadores.forEach(jugador => {
        // Fila principal del jugador (visible)
        const playerRow = document.createElement('tr');
        playerRow.className = 'player-row';
        playerRow.innerHTML = `
            <td class="player-info-cell">
                <img src="${jugador.fotoJugadorURL || 'placeholder.png'}" alt="Foto de ${jugador.nombre}" class="player-image">
                <div>
                    <div class="player-name">${jugador.nombre}</div>
                    <div class="player-dob">Nac: ${formatDate(jugador.fechaNacimiento)}</div>
                </div>
            </td>
            <td>${jugador.posicion || 'N/A'}</td>
            <td>${formatDate(jugador.fechaExpiracion)}</td>
            <td class="expand-icon"><i class="fas fa-chevron-down"></i></td>
        `;
        
        // Fila de detalles (oculta por defecto)
        const detailsRow = document.createElement('tr');
        detailsRow.className = 'details-row';
        detailsRow.innerHTML = `
            <td colspan="4" class="details-cell">
                <div class="cedula-container-rost">
                    <h3>Cédula de Identidad</h3>
                    <div class="cedula-images-rost">
                        <img src="${jugador.fotoFrontalURL}" alt="Cédula Frontal">
                        <img src="${jugador.fotoTraseraURL}" alt="Cédula Trasera">
                    </div>
                </div>
            </td>
        `;

        rosterBody.appendChild(playerRow);
        rosterBody.appendChild(detailsRow);

        // Añadir el evento de clic para el efecto acordeón
        playerRow.addEventListener('click', () => {
            detailsRow.classList.toggle('visible');
            // Para la animación de mostrar/ocultar con CSS
            if (detailsRow.style.display === 'table-row') {
                detailsRow.style.display = 'none';
            } else {
                detailsRow.style.display = 'table-row';
            }
        });
    });
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const noResultsMessage = document.getElementById('no-results');
    
    // Filtramos la lista completa de jugadores
    const jugadoresFiltrados = window.todosLosJugadores.filter(jugador => 
        jugador.nombre.toLowerCase().includes(searchTerm)
    );

    renderRoster(jugadoresFiltrados); // Volvemos a dibujar la tabla con los resultados

    // Mostramos un mensaje si no hay resultados
    if (jugadoresFiltrados.length === 0) {
        noResultsMessage.style.display = 'block';
    } else {
        noResultsMessage.style.display = 'none';
    }
}