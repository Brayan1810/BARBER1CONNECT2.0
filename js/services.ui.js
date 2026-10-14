// =========================================================
// 🎨 SERVICES UI — BARBER1CONNECT2
// Archivo: js/services.ui.js
// Responsable de construir las tarjetas de servicios
// =========================================================



// =========================================================
// 🎨 MOSTRAR PRIMER SERVICIO
// =========================================================

// Construye la primera tarjeta utilizando los datos recibidos
export function mostrarPrimerServicio(servicios) {

    // Verifica que exista al menos un servicio
    if (!servicios || servicios.length === 0) {

        // Informa que no existen servicios
        console.warn("No hay servicios para mostrar");

        // Finaliza la función
        return;

    }

    // Obtiene el primer servicio
    const servicio = servicios[0];

    // Busca el contenedor donde se insertarán las tarjetas
    const container = document.getElementById("servicesContainer");

    // Verifica que exista el contenedor
    if (!container) {

        // Muestra un error
        console.error("No existe #servicesContainer");

        // Finaliza la función
        return;

    }

    // Inserta una tarjeta utilizando la información de Firebase
    container.innerHTML = `

        <button
            class="fifa-card"
            data-id="${servicio.id}"
        >

            <img
                src="${servicio.imagen}"
                alt="${servicio.nombre}"
            >

            <h3>${servicio.nombre}</h3>

            <p><strong>Precio:</strong> $${servicio.precio}</p>

            <p><strong>Duración:</strong> ${servicio.duracion} min</p>

        </button>

    `;

    // Muestra un mensaje para comprobar que la tarjeta fue creada
    console.log("✅ Primera tarjeta creada correctamente");

}