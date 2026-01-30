/* ========================================================= */
/* 🧔 LÓGICA DE BARBEROS */
/* Archivo: js/barbers.js */
/* Proyecto: BARBER1CONNECT2.0 */
/* Controla selección de barbero y carga del calendario */
/* ========================================================= */

function initBarbers() { // INICIA la lógica de selección de barberos en la pantalla principal.

    const barberCards = document.querySelectorAll(".barber-card"); // BUSCA todas las tarjetas de barberos disponibles en el HTML.
    const calendarContainer = document.getElementById("calendar"); // BUSCA el contenedor donde se debe mostrar el calendario.

    barberCards.forEach(card => { // RECORRE cada tarjeta para asignarle su comportamiento.

        card.addEventListener("click", () => { // ESCUCHA el clic del usuario en un barbero (Brayan u Oscar).

            // --- GESTIÓN DE SELECCIÓN ---
            barberCards.forEach(c => c.classList.remove("active")); // DESACTIVA visualmente a cualquier barbero seleccionado previamente.
            card.classList.add("active"); // ACTIVA visualmente solo al barbero que recibió el clic.

            const selectedBarber = card.dataset.barber; // OBTIENE el nombre técnico del barbero (ej: 'brayan') desde el HTML.
            localStorage.setItem("barbero", selectedBarber); // GUARDA el nuevo barbero en la memoria del navegador.
            localStorage.removeItem("fecha"); // LIMPIA cualquier fecha elegida antes para obligar a elegir una nueva.
            localStorage.removeItem("hora"); // LIMPIA cualquier hora elegida antes para evitar errores.

            console.log("Barbero seleccionado:", selectedBarber); // INFORMA en consola quién es el barbero actual.

            // --- LÓGICA DE CARGA INTELIGENTE ---
            // Si el calendario YA existe en el HTML, solo lo reiniciamos sin volver a cargar archivos
            if (document.getElementById("calendarDays")) { 
                console.log("♻️ Reiniciando lógica de calendario existente"); // AVISA que el calendario ya estaba ahí.
                if (window.initCalendar) { 
                    window.initCalendar(); // LLAMA a la función global para refrescar días y horas sin recargar el archivo.
                }
                
                calendarContainer.scrollIntoView({ behavior: "smooth", block: "start" }); // DESPLAZA la vista al calendario.
                return; // FINALIZA aquí para no volver a descargar el HTML innecesariamente.
            }

            // --- PRIMERA CARGA DEL CALENDARIO (Solo si no existe) ---
            fetch('../html/calendar.html') // SOLICITA el archivo HTML del calendario al servidor.
                .then(res => res.text()) // CONVIERTE la respuesta del servidor en texto plano.
                .then(html => { // RECIBE el texto del HTML listo para usar.
                    
                    calendarContainer.innerHTML = html; // INSERTA el contenido del calendario dentro del contenedor.
                    calendarContainer.style.display = "block"; // HACE que el contenedor sea visible en la pantalla.

                    const script = document.createElement("script"); // CREA una etiqueta <script> nueva en memoria.
                    script.type = "module"; // DEFINE el script como módulo para que soporte importaciones de Firebase.
                    script.src = "../js/calendar.js"; // ASIGNA la ruta del archivo de lógica del calendario.
                    script.id = "calendar-script"; // LE PONE un ID para identificarlo en el sistema.
                    
                    document.body.appendChild(script); // PEGA el script en el documento para que empiece a funcionar.

                    calendarContainer.scrollIntoView({ behavior: "smooth", block: "start" }); // MUEVE la pantalla hacia el calendario recién cargado.
                });

        }); // 🔒 CIERRE del evento clic.
    }); // 🔒 CIERRE del recorrido de tarjetas.
} // 🔒 CIERRE de la función initBarbers.

initBarbers(); // EJECUTA la función de barberos apenas se carga este archivo.