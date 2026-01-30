// ================= SELECCIÓN DE SERVICIO =================

let PERFIL_COMPLETO = false; 
// Variable global que controla si el usuario puede confirmar la cita

// Selecciona todas las tarjetas de servicios
const fifaCards = document.querySelectorAll('.fifa-card'); 
// Selecciona el contenedor donde se cargan los barberos
const barbersContainer = document.getElementById('barbers'); 

// Recorre cada tarjeta
fifaCards.forEach(card => {

    // Escucha el clic en cada tarjeta
    card.addEventListener('click', () => {

        // Quita la clase activa de todas
        fifaCards.forEach(c => c.classList.remove('active'));

        // Activa solo la seleccionada
        card.classList.add('active');

        // Obtiene el servicio seleccionado desde data-cut
        const selectedCut = card.dataset.cut;

        // Guarda el servicio para pasos siguientes (barbero / calendario)
        localStorage.setItem('servicio', selectedCut);

        // Debug en consola
        console.log("Servicio seleccionado:", selectedCut);

        // Muestra el hero de barberos
        barbersContainer.style.display = 'block';

        // Hace scroll suave hacia el hero de barberos
        barbersContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

    });
    
});


// ================= CARGAR HERO BARBEROS =================
fetch('../html/barbers.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('barbers').innerHTML = html;

        // 🔑 Inicializa la lógica de barberos
        initBarbers();
    });

// ================= FUNCIÓN FORMATEAR FECHA =================

function formatDateForModal(dateString) {
    // FUNCIÓN que recibe una fecha en formato ISO y la convierte a algo legible

    const date = new Date(dateString);
    // Convierte el string ISO en objeto Date

    const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    // Nombres cortos de los días

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    // Nombres de los meses

    const dayName = weekDays[date.getDay()];
    // Obtiene el día de la semana

    const dayNumber = date.getDate();
    // Obtiene el número del día

    const monthName = months[date.getMonth()];
    // Obtiene el nombre del mes

    return `${dayName} ${dayNumber} de ${monthName}`;
    // Devuelve formato bonito para el cliente
}

// ================= MOSTRAR MODAL DE CONFIRMACIÓN =================

function showConfirmModal() {
    // FUNCIÓN que llena el resumen y muestra el modal

    const confirmModal = document.getElementById("confirmModal");
    // Modal principal

    const selectedDate = sessionStorage.getItem("selectedDate");
    // Fecha guardada (YYYY-MM-DD)

    document.getElementById("summary-date").textContent =
    formatDateForModal(sessionStorage.getItem("selectedDate"));

    // Inserta la fecha bonita en el modal

    document.getElementById("summary-service").textContent =
        sessionStorage.getItem("selectedService");
    // Inserta servicio

    document.getElementById("summary-barber").textContent =
        sessionStorage.getItem("selectedBarber");
    // Inserta barbero

    document.getElementById("summary-time").textContent =
        sessionStorage.getItem("selectedTime");
    // Inserta hora

    confirmModal.style.display = "flex";
    // Muestra el modal
}

    

// ================= CONTROL DEL MODAL DE CONFIRMACIÓN =================

// Botón X para cerrar el modal
const closeModalBtn = document.getElementById("closeModal"); 
// Obtiene el botón de cerrar (X) desde el HTML del modal

// Botón para cambiar la cita
const changeCitaBtn = document.getElementById("changeCita"); 
// Obtiene el botón "Cambiar cita" del modal

// Contenedor principal del modal
const confirmModal = document.getElementById("confirmModal"); 
// Obtiene el contenedor general del modal



// ================= BOTÓN CAMBIAR CITA =================
document.addEventListener("DOMContentLoaded", () => {
    // Espera a que el DOM esté completamente cargado

    const changeCitaBtn = document.getElementById("changeCita");
    // Obtiene el botón "Cambiar cita"

    const confirmModal = document.getElementById("confirmModal");
    // Obtiene el modal

    changeCitaBtn.addEventListener("click", () => {
        // Escucha el clic en "Cambiar cita"

        confirmModal.style.display = "none";
        // Cierra el modal de confirmación

        const calendarSection = document.getElementById("calendar");
        // Obtiene la sección del calendario

        calendarSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        // Lleva al usuario al calendario para modificar la cita
    });
});

    // Hace scroll suave hacia el calendario para cambiar fecha u hora

// ================= CERRAR MODAL AL HACER CLICK FUERA =================

document.addEventListener("DOMContentLoaded", () => {
    // Espera a que todo el DOM esté cargado

    // ================= MODAL =================

    const confirmModal = document.getElementById("confirmModal");
    // Modal principal

    const changeCitaBtn = document.getElementById("changeCita");
    // Botón cambiar cita

    const closeModalBtn = document.getElementById("closeModal");
    // Botón X

    // 🔒 Asegura que el modal esté oculto al iniciar
    confirmModal.style.display = "none";

    // ================= CAMBIAR CITA =================
    changeCitaBtn.addEventListener("click", () => {

        confirmModal.style.display = "none";
        // Cierra el modal

        const calendarSection = document.getElementById("calendar");
        // Sección calendario

        calendarSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        // Scroll suave al calendario
    });

    // ================= CERRAR AL HACER CLICK FUERA =================
    window.addEventListener("click", (event) => {
        if (event.target === confirmModal) {
            confirmModal.style.display = "none";
        }
    });
});

