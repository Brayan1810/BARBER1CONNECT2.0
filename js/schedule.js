// ================= SELECCIÓN DE SERVICIO =================

// ================= IMPORTAR FIREBASE CITAS =================

// Variable global que controla si el perfil está completo
let PERFIL_COMPLETO = false;

// ================= IMPORTAR FIREBASE CITAS =================

// Importa la función encargada de guardar las citas en Firestore
import { guardarCita } from "./appointments.firebase.js";

// Selecciona todas las tarjetas de servicios
const fifaCards = document.querySelectorAll('.fifa-card');

// Selecciona el contenedor de los barberos
const barbersContainer = document.getElementById('barbers');


// ================= SELECCIONAR SERVICIO =================

// Recorre todas las tarjetas de servicios
fifaCards.forEach(card => {

    // Escucha cuando el usuario hace clic en una tarjeta
    card.addEventListener('click', () => {

        // Quita la clase activa de todas las tarjetas
        fifaCards.forEach(c => c.classList.remove('active'));

        // Activa la tarjeta seleccionada
        card.classList.add('active');

        // Obtiene el servicio seleccionado
        const selectedCut = card.dataset.cut;

        // Guarda el servicio en localStorage
        localStorage.setItem('servicio', selectedCut);

        // Guarda el servicio también en sessionStorage
        sessionStorage.setItem('selectedService', selectedCut);

        // Muestra el servicio en la consola
        console.log("Servicio seleccionado:", selectedCut);

        // Verifica que exista el contenedor de barberos
        if (barbersContainer) {

            // Muestra la sección de barberos
            barbersContainer.style.display = 'block';

            // Desplaza la pantalla hacia los barberos
            barbersContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        }

    });

});


// ================= CARGAR HERO BARBEROS =================

// Carga el archivo HTML de los barberos
fetch('../html/barbers.html')

// Convierte la respuesta en texto
.then(res => res.text())

// Ejecuta esta función cuando el HTML esté cargado
.then(html => {

    // Obtiene el contenedor de los barberos
    const barbersElement = document.getElementById('barbers');

    // Verifica que el contenedor exista
    if (barbersElement) {

        // Inserta el HTML de los barberos
        barbersElement.innerHTML = html;

        // Verifica que exista la función para iniciar los barberos
        if (typeof initBarbers === 'function') {

            // Inicia la lógica de selección de barberos
            initBarbers();

        }

    }

})

// Captura errores al cargar los barberos
.catch(error => {

    // Muestra el error en la consola
    console.error("Error cargando barbers.html:", error);

});


// ================= FORMATEAR FECHA =================

// Función para convertir una fecha a un formato bonito
function formatDateForModal(dateString) {

    // Convierte la fecha recibida en un objeto Date
    const date = new Date(dateString);

    // Lista de días de la semana
    const weekDays = [
        "Dom",
        "Lun",
        "Mar",
        "Mié",
        "Jue",
        "Vie",
        "Sáb"
    ];

    // Lista de meses
    const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ];

    // Obtiene el nombre del día
    const dayName = weekDays[date.getDay()];

    // Obtiene el número del día
    const dayNumber = date.getDate();

    // Obtiene el nombre del mes
    const monthName = months[date.getMonth()];

    // Devuelve la fecha formateada
    return `${dayName} ${dayNumber} de ${monthName}`;

}


// ================= CONTROL DEL MODAL =================

// Espera a que toda la página esté cargada
document.addEventListener("DOMContentLoaded", () => {

    // Obtiene el botón AGENDAR
    const agendarBtn = document.getElementById("agendarBtn");

    // Obtiene el modal de confirmación
    const confirmModal = document.getElementById("confirmModal");

    // Obtiene el botón Cambiar cita
    const changeCitaBtn = document.getElementById("changeCita");


    // ================= OCULTAR MODAL AL INICIAR =================

    // Verifica que el modal exista
    if (confirmModal) {

        // Oculta el modal al cargar la página
        confirmModal.style.display = "none";

    }


    // ================= BOTÓN AGENDAR =================

    // Verifica que el botón AGENDAR exista
    if (agendarBtn) {

        // Escucha el clic sobre el botón AGENDAR
        agendarBtn.addEventListener("click", () => {

            // Obtiene el servicio seleccionado
            const servicio = sessionStorage.getItem("selectedService");

            // Obtiene el barbero seleccionado
            const barbero = sessionStorage.getItem("selectedBarber");

            // Obtiene la fecha seleccionada
            const fecha = sessionStorage.getItem("selectedDate");

            // Obtiene la hora seleccionada
            const hora = sessionStorage.getItem("selectedTime");


            // ================= VALIDAR INFORMACIÓN =================

            // Verifica que todos los datos estén seleccionados
            if (!servicio || !barbero || !fecha || !hora) {

                // Muestra un mensaje en la consola
                console.warn("Faltan datos para agendar la cita");

                // Detiene la función
                return;

            }


            // ================= MOSTRAR INFORMACIÓN =================

            // Obtiene el campo del servicio
            const summaryService =
                document.getElementById("summary-service");

            // Coloca el servicio seleccionado
            if (summaryService) {

                summaryService.textContent = servicio;

            }


            // Obtiene el campo del barbero
            const summaryBarber =
                document.getElementById("summary-barber");

            // Coloca el barbero seleccionado
            if (summaryBarber) {

                summaryBarber.textContent = barbero;

            }


            // Obtiene el campo de la fecha
            const summaryDate =
                document.getElementById("summary-date");

            // Coloca la fecha seleccionada
            if (summaryDate) {

                summaryDate.textContent =
                    formatDateForModal(fecha);

            }


            // Obtiene el campo de la hora
            const summaryTime =
                document.getElementById("summary-time");

            // Coloca la hora seleccionada
            if (summaryTime) {

                summaryTime.textContent = hora;

            }


            // ================= ABRIR MODAL =================

            // Verifica que el modal exista
            if (confirmModal) {

                // Abre el modal de confirmación
                confirmModal.style.display = "flex";

                // Muestra mensaje de confirmación en consola
                console.log("Modal de confirmación abierto");

            }

        });

    }


    // ================= CAMBIAR CITA =================

    // Verifica que exista el botón Cambiar cita
    if (changeCitaBtn) {

        // Escucha el clic sobre Cambiar cita
        changeCitaBtn.addEventListener("click", () => {

            // Cierra el modal
            confirmModal.style.display = "none";

            // Obtiene la sección del calendario
            const calendarSection =
                document.getElementById("calendar");

            // Verifica que exista el calendario
            if (calendarSection) {

                // Desplaza la pantalla hasta el calendario
                calendarSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    }


    // ================= CERRAR MODAL AL HACER CLIC AFUERA =================

    // Escucha los clics realizados en toda la ventana
    window.addEventListener("click", (event) => {

        // Comprueba si el clic fue sobre el fondo del modal
        if (event.target === confirmModal) {

            // Cierra el modal
            confirmModal.style.display = "none";

        }

    });

});

// ================= MOSTRAR BOTÓN AGENDAR =================

// Esta función muestra el botón AGENDAR después de seleccionar una hora
function mostrarBotonAgendar() {

    // Busca el contenedor principal del calendario
    const calendarSection = document.getElementById("calendar");

    // Verifica que el calendario exista
    if (!calendarSection) {

        // Muestra un error en la consola si no existe
        console.error("No se encontró el contenedor #calendar");

        // Detiene la función
        return;
    }


    // Busca si el botón AGENDAR ya fue creado anteriormente
    let botonAgendar = document.getElementById("btnAgendar");


    // ================= CREAR BOTÓN =================

    // Si el botón todavía no existe
    if (!botonAgendar) {

        // Crea un nuevo elemento de tipo botón
        botonAgendar = document.createElement("button");

        // Asigna un ID único al botón
        botonAgendar.id = "btnAgendar";

        // Asigna una clase CSS para darle diseño
        botonAgendar.className = "btn-agendar";

        // Coloca el texto visible dentro del botón
        botonAgendar.textContent = "AGENDAR CITA";

        // Agrega el botón después de todo el contenido del calendario
        calendarSection.appendChild(botonAgendar);


        // ================= EVENTO DEL BOTÓN =================

        // Escucha cuando el usuario haga clic en AGENDAR
        botonAgendar.addEventListener("click", () => {

            // Ejecuta la función que abre el modal de confirmación
            abrirModalConfirmacion();

        });

    }


    // ================= MOSTRAR BOTÓN =================

    // Hace visible el botón
    botonAgendar.style.display = "block";


    // ================= SCROLL AUTOMÁTICO =================

    // Espera un momento para que el navegador actualice el botón
    setTimeout(() => {

        // Desplaza suavemente la pantalla hasta el botón
        botonAgendar.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 100);

}


// ================= ABRIR MODAL DE CONFIRMACIÓN =================

// Esta función abre el modal únicamente cuando se pulsa AGENDAR
function abrirModalConfirmacion() {

    // Obtiene el servicio guardado
    const servicio = sessionStorage.getItem("selectedService");

    // Obtiene el barbero guardado
    const barbero = sessionStorage.getItem("selectedBarber");

    // Obtiene la fecha guardada
    const fecha = sessionStorage.getItem("selectedDate");

    // Obtiene la hora guardada
    const hora = sessionStorage.getItem("selectedTime");


    // ================= VALIDAR DATOS =================

    // Verifica que todos los datos de la cita existan
    if (!servicio || !barbero || !fecha || !hora) {

        // Muestra un mensaje de advertencia
        console.warn("No se puede abrir el modal porque faltan datos de la cita");

        // Detiene la función
        return;
    }


    // ================= OBTENER MODAL =================

    // Busca el modal de confirmación
    const confirmModal = document.getElementById("confirmModal");


    // Verifica que el modal exista
    if (!confirmModal) {

        // Muestra un error si no encuentra el modal
        console.error("No se encontró el modal #confirmModal");

        // Detiene la función
        return;
    }


    // ================= MOSTRAR RESUMEN =================

    // Busca el campo donde se muestra el servicio
    const summaryService = document.getElementById("summary-service");

    // Coloca el servicio seleccionado
    if (summaryService) {

        // Muestra el nombre del servicio
        summaryService.textContent = servicio;

    }


    // Busca el campo donde se muestra el barbero
    const summaryBarber = document.getElementById("summary-barber");

    // Coloca el barbero seleccionado
    if (summaryBarber) {

        // Muestra el nombre del barbero
        summaryBarber.textContent = barbero;

    }


    // Busca el campo donde se muestra la fecha
    const summaryDate = document.getElementById("summary-date");

    // Coloca la fecha seleccionada
    if (summaryDate) {

        // Formatea la fecha antes de mostrarla
        summaryDate.textContent = formatDateForModal(fecha);

    }


    // Busca el campo donde se muestra la hora
    const summaryTime = document.getElementById("summary-time");

    // Coloca la hora seleccionada
    if (summaryTime) {

        // Muestra la hora seleccionada
        summaryTime.textContent = hora;

    }


    // ================= ABRIR MODAL =================

    // Muestra el modal de confirmación
    confirmModal.style.display = "flex";


    // Muestra un mensaje en consola para comprobar que funciona
    console.log("Modal de confirmación abierto correctamente");

}

// ================= EXPONER FUNCIÓN GLOBAL =================

// Hace disponible la función para otros archivos JS
window.mostrarBotonAgendar = mostrarBotonAgendar;

// =========================================================
// 🔥 GUARDAR CITA REAL — BARBER1CONNECT2
// Archivo: js/schedule.js
// Conecta el formulario de confirmación con Firestore
// =========================================================


// ================= FORMULARIO DE CONFIRMACIÓN =================

// Busca el formulario real utilizado para confirmar la cita
const confirmForm = document.getElementById("confirmForm");


// Verifica que el formulario exista antes de trabajar con él
if (confirmForm) {

    // Escucha cuando el usuario presiona el botón "Confirmar cita"
    confirmForm.addEventListener("submit", async (event) => {

        // Evita que el formulario recargue la página
        event.preventDefault();


        // ================= OBTENER DATOS DE LA CITA =================

        // Obtiene el servicio seleccionado anteriormente
        const servicio = sessionStorage.getItem("selectedService");

        // Obtiene el barbero seleccionado anteriormente
        const barbero = sessionStorage.getItem("selectedBarber");

        // Obtiene la fecha seleccionada anteriormente
        const fecha = sessionStorage.getItem("selectedDate");

        // Obtiene la hora seleccionada anteriormente
        const hora = sessionStorage.getItem("selectedTime");


        // ================= OBTENER DATOS DEL CLIENTE =================

        // Obtiene el campo del nombre del cliente
        const nombreInput = document.getElementById("name");

        // Obtiene el campo del apellido del cliente
        const apellidoInput = document.getElementById("lastname");

        // Obtiene el campo del teléfono del cliente
        const telefonoInput = document.getElementById("phone");

        // Obtiene el campo de recomendaciones opcionales
        const notasInput = document.getElementById("notes");


        // ================= LEER INFORMACIÓN =================

        // Obtiene el nombre escrito por el cliente
        const nombre = nombreInput ? nombreInput.value.trim() : "";

        // Obtiene el apellido escrito por el cliente
        const apellido = apellidoInput ? apellidoInput.value.trim() : "";

        // Obtiene el teléfono escrito por el cliente
        const telefono = telefonoInput ? telefonoInput.value.trim() : "";

        // Obtiene las recomendaciones escritas por el cliente
        const notas = notasInput ? notasInput.value.trim() : "";


        // ================= VALIDAR DATOS OBLIGATORIOS =================

        // Verifica que existan todos los datos necesarios para crear la cita
        if (!servicio || !barbero || !fecha || !hora) {

            // Muestra un mensaje en la consola indicando qué ocurrió
            console.error("❌ Faltan datos de la cita.");

            // Informa al usuario que debe revisar su selección
            alert("Faltan datos de la cita. Por favor revisa el servicio, barbero, fecha y hora.");

            // Detiene el proceso
            return;

        }


        // Verifica que los datos obligatorios del cliente estén completos
        if (!nombre || !apellido || !telefono) {

            // Informa al usuario cuáles datos debe completar
            alert("Por favor completa nombre, apellido y teléfono.");

            // Detiene el proceso
            return;

        }


        // ================= PREPARAR CITA =================

        // Crea el objeto que será enviado a Firestore
        const datosCita = {

            // Guarda el servicio realmente seleccionado
            servicio: servicio,

            // Guarda el barbero realmente seleccionado
            barbero: barbero,

            // Guarda la fecha realmente seleccionada
            fecha: fecha,

            // Guarda la hora realmente seleccionada
            hora: hora,

            // Guarda el nombre real introducido por el cliente
            nombre: nombre,

            // Guarda el apellido real introducido por el cliente
            apellido: apellido,

            // Guarda el teléfono real introducido por el cliente
            telefono: telefono,

            // Guarda las notas opcionales del cliente
            notas: notas,

            // Define el estado inicial de la cita
            estado: "pendiente"

        };


        // Muestra en consola exactamente qué información se va a guardar
        console.log("📋 Datos de la cita preparados:", datosCita);


        // ================= DESACTIVAR BOTÓN =================

        // Busca el botón que envía el formulario
        const confirmarBtn = confirmForm.querySelector(".btn-confirm");

        // Verifica que el botón exista
        if (confirmarBtn) {

            // Desactiva temporalmente el botón para evitar doble clic
            confirmarBtn.disabled = true;

            // Cambia temporalmente el texto del botón
            confirmarBtn.textContent = "Guardando cita...";

        }


        // ================= GUARDAR EN FIREBASE =================

        try {

            // Envía los datos reales a la función de Firebase
            const citaId = await guardarCita(datosCita);


            // Muestra en consola el ID generado por Firestore
            console.log("✅ Cita guardada correctamente:", citaId);


            // ================= LIMPIAR DATOS TEMPORALES =================

            // Elimina el servicio temporal después de guardar la cita
            sessionStorage.removeItem("selectedService");

            // Elimina el barbero temporal después de guardar la cita
            sessionStorage.removeItem("selectedBarber");

            // Elimina la fecha temporal después de guardar la cita
            sessionStorage.removeItem("selectedDate");

            // Elimina la hora temporal después de guardar la cita
            sessionStorage.removeItem("selectedTime");


            // ================= MENSAJE DE ÉXITO =================

            // Informa al cliente que la cita fue creada correctamente
            alert("✅ ¡Tu cita fue agendada correctamente!");

            // ================= REINICIAR FLUJO =================

            // Muestra en consola que la cita fue guardada y se reiniciará la página
            console.log("🔄 Cita guardada correctamente. Reiniciando el sistema...");

            // Espera un pequeño momento después de cerrar el mensaje de éxito
            setTimeout(() => {

                // Recarga completamente schedule.html
                window.location.reload();

            }, 300);


            // ================= LIMPIAR FORMULARIO =================

            // Limpia los campos del formulario para evitar reutilizar información anterior
            confirmForm.reset();


            // ================= RESTAURAR BOTÓN =================

            // Verifica que el botón exista
            if (confirmarBtn) {

                // Vuelve a habilitar el botón
                confirmarBtn.disabled = false;

                // Devuelve el texto original del botón
                confirmarBtn.textContent = "Confirmar cita";

            }

        }

        catch (error) {

            // Muestra el error completo en la consola
            console.error("❌ No se pudo guardar la cita:", error);


            // Informa al usuario que ocurrió un problema
            alert("Lo sentimos, no pudimos guardar tu cita. Por favor inténtalo nuevamente.");


            // ================= RESTAURAR BOTÓN =================

            // Verifica que el botón exista
            if (confirmarBtn) {

                // Vuelve a habilitar el botón
                confirmarBtn.disabled = false;

                // Devuelve el texto original del botón
                confirmarBtn.textContent = "Confirmar cita";

            }

        }

    });

}