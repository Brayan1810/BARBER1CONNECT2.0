/* ========================================================= */
/* 📅 LÓGICA CALENDARIO — BARBER1CONNECT2.0 */
/* Archivo: js/calendar.js */
/* Este archivo ES REINICIABLE cada vez que se carga */
/* ========================================================= */
import { obtenerHorasDisponibles } from "./calendar.firebase.js"; // IMPORTA la función externa para consultar datos en Firebase.


console.log("📅 calendar.js cargado correctamente"); // NOTIFICA en la consola que el archivo JS se leyó con éxito.

function formatDate(dateString) { 
    // FUNCIÓN que convierte una fecha ISO o larga en formato DD/MM/YYYY para el cliente

    const date = new Date(dateString); 
    // Convierte el string recibido en un objeto Date de JavaScript

    const day = String(date.getDate()).padStart(2, "0"); 
    // Obtiene el día del mes y asegura dos dígitos

    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    // Obtiene el mes (se suma 1 porque JS empieza desde 0)

    const year = date.getFullYear(); 
    // Obtiene el año completo

    return `${day}/${month}/${year}`; 
    // Devuelve la fecha limpia para mostrar en el modal
}


function initCalendar() { // DEFINE la función principal que encapsula toda la lógica del calendario.
    // 🔁 FUNCIÓN PRINCIPAL DEL CALENDARIO
    // Se ejecuta CADA VEZ que un barbero es seleccionado
    console.log("🚀 initCalendar ejecutado"); // REGISTRA en consola que la inicialización ha comenzado.


    // ================= ESTADO BASE =================

    let currentDate = new Date(); // CREA un objeto de fecha en la memoria con la fecha y hora actual del sistema.
    // Reinicia la fecha base al día actual del sistema

    // ================= REFERENCIAS DOM =================

    const calendarDays = document.getElementById("calendarDays"); // VINCULA la variable con el contenedor HTML donde aparecerán los días.
    // Contenedor donde se renderizan los días

    const currentMonth = document.getElementById("currentMonth"); // VINCULA con el elemento HTML que muestra el nombre del mes.
    // Texto donde se muestra mes y año

    const prevMonthBtn = document.getElementById("prevMonth"); // VINCULA con el botón de "Mes Anterior" en el HTML.
    // Botón para ir al mes anterior

    const nextMonthBtn = document.getElementById("nextMonth"); // VINCULA con el botón de "Mes Siguiente" en el HTML.
    // Botón para ir al mes siguiente

        // ================= CONTROLES DE SCROLL DÍAS (DESKTOP) =================

    const dayPrevBtn = document.getElementById("dayPrev"); // VINCULA con la flecha izquierda de desplazamiento de días.
    // Botón flecha izquierda para mover días

    const dayNextBtn = document.getElementById("dayNext"); // VINCULA con la flecha derecha de desplazamiento de días.
    // Botón flecha derecha para mover días

    const calendarScroll = document.querySelector(".calendar-scroll"); // BUSCA el contenedor con scroll horizontal en el documento.
    // Contenedor que se desplaza horizontalmente con los días

    const SCROLL_AMOUNT = 160; // DEFINE en memoria la distancia en píxeles para el desplazamiento.
    // Cantidad de píxeles que se moverán por clic

    dayPrevBtn?.addEventListener("click", () => { // ESCUCHA el click en la flecha izquierda (si existe).
        // Evento click flecha izquierda

        calendarScroll.scrollBy({ // EJECUTA un movimiento de scroll hacia la izquierda en el contenedor.
            left: -SCROLL_AMOUNT, // RESTA píxeles a la posición horizontal.
            behavior: "smooth" // APLICA una animación suave al movimiento.
        });
    });

    dayNextBtn?.addEventListener("click", () => { // ESCUCHA el click en la flecha derecha (si existe).
        // Evento click flecha derecha

        calendarScroll.scrollBy({ // EJECUTA un movimiento de scroll hacia la derecha en el contenedor.
            left: SCROLL_AMOUNT, // SUMA píxeles a la posición horizontal.
            behavior: "smooth" // APLICA una animación suave al movimiento.
        });
    });


    // ⚠️ Defensa: si el HTML no está listo, no ejecutar nada
    if (!calendarDays || !currentMonth) { // VERIFICA si faltan elementos críticos en el HTML.
        console.warn("Calendario no listo aún"); // ADVIERTE en consola si el HTML no está cargado.
        return; // ABORTA la función para evitar errores de ejecución.
    }

    // ================= DATOS ESTÁTICOS =================

    const months = [ // ALMACENA en un array los nombres de los meses para mostrarlos en español.
        "Enero","Febrero","Marzo","Abril","Mayo","Junio",
        "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
    ];

    const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]; // ALMACENA los nombres cortos de la semana.
    // Nombres cortos de los días de la semana

    // ===================================================
    // 📅 FUNCIÓN: RENDERIZA EL MES COMPLETO
    // ===================================================

    function renderMonth() { // DEFINE la lógica para dibujar visualmente los días del mes.

        calendarDays.innerHTML = ""; // BORRA todo el contenido visual dentro de "calendarDays" en el HTML.
        // Limpia completamente los días antes de redibujar

        const year = currentDate.getFullYear(); // OBTIENE el número del año de la fecha actual en memoria.
        // Año actual del calendario

        const month = currentDate.getMonth(); // OBTIENE el número del mes (0-11) en memoria.
        // Mes actual (0–11)

        currentMonth.textContent = `${months[month]} ${year}`; // ACTUALIZA el texto en el HTML con el Mes y Año actual.
        // Muestra mes y año en pantalla

        const totalDays = new Date(year, month + 1, 0).getDate(); // CALCULA cuántos días tiene el mes actual (considera bisiestos).
        // Calcula automáticamente los días del mes

        const today = new Date(); // CREA una referencia de la fecha de "hoy" para comparar.
        // Fecha real del sistema

       for (let day = 1; day <= totalDays; day++) { // INICIA un ciclo que se repite por cada día del mes.

            const date = new Date(year, month, day); // CREA un objeto fecha específico para el día del ciclo actual.
            // Crea una fecha completa por cada día

            const dayCard = document.createElement("div"); // CREA un nuevo elemento DIV en la memoria para representar el día.
            // Crea la tarjeta visual del día

            dayCard.classList.add("calendar-day"); // ASIGNA la clase CSS para que la tarjeta tenga diseño.

            // Marca HOY como activo por defecto, dispara la carga de horas y centra el slider
            if ( // COMPRUEBA si el día que se está dibujando coincide con la fecha de hoy.
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                dayCard.classList.add("active"); // AGREGA la clase "active" para resaltar visualmente el día de hoy.


            }
            dayCard.innerHTML = `
                <span class="day-week">${weekDays[date.getDay()]}</span>
                <span class="day-number">${day} ${months[month].slice(0,3)}</span>
            `; // INSERTA el nombre del día y el número dentro del DIV creado.
            // Inserta día de la semana + fecha

            dayCard.addEventListener("click", async () => { // ESCUCHA cuando el usuario toca un día específico.
                // Evento al seleccionar un día (AHORA ASÍNCRONO)

                document.querySelectorAll(".calendar-day") // BUSCA todos los días dibujados en el HTML.
                    .forEach(d => d.classList.remove("active")); // QUITA la marca de selección a todos los días.
                // Quita selección previa

                dayCard.classList.add("active"); // MARCA el día clickeado como el seleccionado actualmente.
                // Marca día actual

                localStorage.setItem("fecha", date.toISOString()); // GUARDA la fecha completa en el almacenamiento local del navegador.
                // Guarda la fecha seleccionada

                console.log("Fecha seleccionada:", date); // INFORMA en consola qué día se eligió.

                // ================= OBTENER HORAS DESDE FIREBASE =================

                const barbero = localStorage.getItem("barbero"); // RECUPERA de la memoria el nombre del barbero seleccionado previamente.
                // Obtiene el barbero seleccionado

                if (!barbero) { // VALIDA si el usuario ya eligió a un barbero.
                    console.warn("No hay barbero seleccionado"); // AVISA que falta el barbero.
                    return; // DETIENE la carga de horas.
                }

                const horas = await obtenerHorasDisponibles(barbero, date.toISOString()); // SOLICITA a Firebase la lista de horas para ese barbero y fecha.
                // Consulta REAL a Firestore usando barbero + fecha

                console.log("⏰ Horas recibidas desde Firebase:", horas); // MUESTRA en consola los horarios que devolvió la base de datos.

                renderHoras(horas); // LLAMA a la función para dibujar los botones de las horas en pantalla.
                // Renderiza las horas disponibles en pantalla
            });


            calendarDays.appendChild(dayCard); // INSERTA la tarjeta del día en el contenedor visible del calendario.
            // Inserta el día en el calendario
        }
    }

    // ================= EVENTOS MES =================

    prevMonthBtn?.addEventListener("click", () => { // ESCUCHA el click en "Mes Anterior".
        currentDate.setMonth(currentDate.getMonth() - 1); // RESTA un mes a la fecha en memoria.
        renderMonth(); // REDIBUJA todo el calendario con el nuevo mes.
    });

    nextMonthBtn?.addEventListener("click", () => { // ESCUCHA el click en "Mes Siguiente".
        currentDate.setMonth(currentDate.getMonth() + 1); // SUMA un mes a la fecha en memoria.
        renderMonth(); // REDIBUJA todo el calendario con el nuevo mes.
    });

    
    // 🔥 RENDER INICIAL
    renderMonth(); // ← EJECUTA el dibujo del mes por primera vez al cargar la página.
}

// =========================================================
// 🚀 INICIALIZACIÓN DIRECTA DEL CALENDARIO
// =========================================================
initCalendar(); // DISPARA la función principal apenas se lee este archivo.

function renderHoras(horas) { // DEFINE cómo se muestran los horarios disponibles.

    const calendarHours = document.getElementById("calendarHours"); // BUSCA el contenedor de la sección de horas.
    const hoursGrid = document.getElementById("hoursGrid"); // BUSCA la cuadrícula donde van los botones de horas.

    hoursGrid.innerHTML = ""; // BORRA los botones de horas anteriores en el HTML.

   if (!horas.length) { // COMPRUEBA si Firebase devolvió una lista vacía.
        calendarHours.style.display = "block"; // MUESTRA el contenedor para que el mensaje sea visible.

        const mensaje = document.createElement("h3"); // CREA un elemento de título en memoria.
        mensaje.textContent = "No hay turnos disponibles para ese día"; // ASIGNA el texto de aviso.
        
        // ESTILOS DE CENTRADO
        mensaje.style.textAlign = "center"; // ALINEA el texto al centro.
        mensaje.style.width = "100%";       // EXPANDE el mensaje a todo el ancho.
        mensaje.style.gridColumn = "1 / -1"; // OCUPA todas las columnas si es un diseño Grid.
        mensaje.style.color = "#ffffffff"; // PINTA el texto de blanco.
        mensaje.style.margin = "20px 0";    // SEPARA el mensaje de los bordes.
        
        hoursGrid.appendChild(mensaje); // INSERTA el aviso de "No hay turnos" en el HTML.
        return; // FINALIZA la función aquí.
    }
    
    calendarHours.style.display = "block"; // HACE visible la sección si hay horas disponibles.

    horas.forEach(hora => { // RECORRE cada hora recibida de Firebase.

        const btn = document.createElement("div"); // CREA un botón visual en memoria.
        btn.classList.add("hour-btn"); // APLICA los estilos de botón definidos en CSS.
        btn.textContent = hora; // ESCRIBE la hora (ej: 14:00) en el botón.

        btn.addEventListener("click", () => { // ESCUCHA el click en una hora específica.

            document.querySelectorAll(".hour-btn") // BUSCA todos los botones de hora.
                .forEach(b => b.classList.remove("active")); // DESACTIVA cualquier hora previa.

            btn.classList.add("active"); // MARCA visualmente la hora seleccionada.

            /* ================= GUARDAR DATOS DEL FLUJO ================= */

            sessionStorage.setItem("selectedTime", hora); // GUARDA la hora elegida para el flujo de confirmación.

            sessionStorage.setItem("selectedDate", localStorage.getItem("fecha")); 
            // GUARDA la fecha previamente seleccionada en el calendario.

            sessionStorage.setItem("selectedBarber", localStorage.getItem("barbero")); 
            // GUARDA el barbero seleccionado en el paso anterior.

            sessionStorage.setItem("selectedService", localStorage.getItem("servicio")); 
            // GUARDA el servicio seleccionado previamente.

                /* ================= MOSTRAR MODAL DE CONFIRMACIÓN ================= */

            const modal = document.getElementById("confirmModal"); 
            // OBTIENE el contenedor del modal desde schedule.html

            document.getElementById("summary-service").textContent = 
                sessionStorage.getItem("selectedService"); 
            // INSERTA el servicio elegido en el resumen del modal

            document.getElementById("summary-barber").textContent = 
                sessionStorage.getItem("selectedBarber"); 
            // INSERTA el barbero elegido en el resumen del modal

            document.getElementById("summary-time").textContent = 
                sessionStorage.getItem("selectedTime"); 
            // INSERTA la hora elegida en el resumen del modal

            document.getElementById("summary-date").textContent = 
                formatDate(sessionStorage.getItem("selectedDate")); 
            // INSERTA la fecha limpia (DD/MM/YYYY) en el resumen del modal

            showConfirmModal();
            // Abre el modal usando la función que formatea la fecha

            // MUESTRA el modal sin recargar la página

        });


        hoursGrid.appendChild(btn); // INSERTA el botón de hora en la cuadrícula del HTML.
        
    });
}



// =========================================================
// 🌍 EXPONER INICIALIZADOR GLOBAL
// =========================================================

window.initCalendar = initCalendar; // COLOCA la función en el objeto 'window' para que sea accesible desde otros archivos JS.



// ================= MOSTRAR HORAS O MENSAJE =================

