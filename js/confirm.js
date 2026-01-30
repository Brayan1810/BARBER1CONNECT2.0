/* ================= INICIO confirm.js ================= */
/* Este archivo controla la lógica de la pantalla confirm.html dentro de BARBER1CONNECT2.0 */

/* ================= CARGA INICIAL ================= */

/* Espera a que todo el DOM de confirm.html esté completamente cargado */
document.addEventListener('DOMContentLoaded', function () {

    function formatDate(dateString) { 
    // FUNCIÓN que recibe una fecha en formato largo o ISO.

        const date = new Date(dateString); 
        // CONVIERTE el string en un objeto Date de JavaScript.

        const day = String(date.getDate()).padStart(2, '0'); 
        // OBTIENE el día y asegura que tenga dos dígitos.

        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        // OBTIENE el mes (se suma 1 porque JS empieza en 0).

        const year = date.getFullYear(); 
        // OBTIENE el año completo.

        return `${day}/${month}/${year}`; 
        // DEVUELVE la fecha en formato bonito para el cliente.
    }

    /* ================= OBTENER DATOS DESDE sessionStorage ================= */

    /* Obtiene el servicio seleccionado previamente en schedule.html */
    const service = sessionStorage.getItem('selectedService'); // Dato guardado temporalmente del servicio

    /* Obtiene el barbero seleccionado previamente en barbers.html o calendar.html */
    const barber = sessionStorage.getItem('selectedBarber'); // Barbero elegido por el cliente

    /* Obtiene la fecha seleccionada en el calendario */
    const date = sessionStorage.getItem('selectedDate'); // Fecha de la cita

    /* Obtiene la hora seleccionada por el cliente */
    const time = sessionStorage.getItem('selectedTime'); // Hora exacta de la cita

    /* ================= VALIDACIÓN DE FLUJO ================= */

    /* Si falta algún dato clave, el usuario no debería estar aquí */
    if (!service || !barber || !date || !time) {
        alert('Faltan datos para confirmar la cita. Por favor vuelve a seleccionar tu horario.'); // Mensaje de error UX
        window.location.href = 'schedule.html'; // Redirige al flujo correcto
        return; // Detiene la ejecución del script
    }

    /* ================= PINTAR RESUMEN EN PANTALLA ================= */

    /* Inserta el servicio en el resumen de confirmación */
    document.getElementById('summary-service').textContent = service; // Muestra el servicio elegido

    /* Inserta el barbero en el resumen */
    document.getElementById('summary-barber').textContent = barber; // Muestra el barbero elegido

    /* Inserta la fecha en el resumen */
    document.getElementById('summary-date').textContent = formatDate(date); // Muestra la fecha elegida

    /* Inserta la hora en el resumen */
    document.getElementById('summary-time').textContent = time; // Muestra la hora elegida

    /* ================= FORMULARIO ================= */

    /* Obtiene el formulario de confirmación */
    const form = document.querySelector('.confirm-form'); // Referencia al formulario principal

    /* Escucha el evento submit del formulario */
    form.addEventListener('submit', function (event) {

        event.preventDefault(); // Evita que la página se recargue al enviar el formulario

        /* ================= CAPTURAR DATOS DEL CLIENTE ================= */

        /* Obtiene el nombre ingresado por el cliente */
        const name = document.getElementById('name').value.trim(); // Nombre del cliente

        /* Obtiene el apellido ingresado */
        const lastname = document.getElementById('lastname').value.trim(); // Apellido del cliente

        /* Obtiene el teléfono ingresado */
        const phone = document.getElementById('phone').value.trim(); // Teléfono del cliente

        /* Obtiene las recomendaciones opcionales */
        const notes = document.getElementById('notes').value.trim(); // Comentarios adicionales

        /* ================= VALIDACIÓN BÁSICA ================= */

        /* Verifica que los campos obligatorios no estén vacíos */
        if (!name || !lastname || !phone) {
            alert('Por favor completa todos los campos obligatorios.'); // Mensaje UX claro
            return; // Detiene el proceso si falta información
        }

        /* ================= PREPARAR OBJETO CITA ================= */

        /* Crea el objeto de la cita con toda la información */
        const appointmentData = {
            service: service, // Servicio seleccionado
            barber: barber, // Barbero seleccionado
            date: date, // Fecha de la cita
            time: time, // Hora de la cita
            clientName: name, // Nombre del cliente
            clientLastname: lastname, // Apellido del cliente
            clientPhone: phone, // Teléfono del cliente
            notes: notes || '', // Recomendaciones opcionales
            status: 'confirmada', // Estado inicial de la cita
            createdAt: new Date().toISOString() // Fecha de creación en formato estándar
        };

        /* ================= GUARDADO TEMPORAL ================= */

        /* Guarda la cita completa en sessionStorage para el siguiente paso */
        sessionStorage.setItem('appointmentData', JSON.stringify(appointmentData)); // Persistencia temporal

        /* ================= SIGUIENTE PASO ================= */

        /* Redirige a la pantalla final de confirmación */
        window.location.href = 'success.html'; // Pantalla que mostrará la cita confirmada

    }); // Fin del submit del formulario

}); // Fin del DOMContentLoaded

/* ================= FIN confirm.js ================= */
function formatDate(dateString) { 
    // FUNCIÓN que recibe una fecha en formato largo o ISO.

    const date = new Date(dateString); 
    // CONVIERTE el string en un objeto Date de JavaScript.

    const day = String(date.getDate()).padStart(2, '0'); 
    // OBTIENE el día y asegura que tenga dos dígitos.

    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    // OBTIENE el mes (se suma 1 porque JS empieza en 0).

    const year = date.getFullYear(); 
    // OBTIENE el año completo.

    return `${day}/${month}/${year}`; 
    // DEVUELVE la fecha en formato bonito para el cliente.
}
document.querySelector('.btn-back').addEventListener('click', () => {
    // ESCUCHA el click del botón cambiar cita.

    sessionStorage.clear(); 
    // LIMPIA los datos temporales de la cita.

    window.location.href = 'schedule.html'; 
    // REDIRIGE al inicio del flujo de agendamiento.
});
