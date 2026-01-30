// =========================================================
// 🛠 ADMIN HORARIOS — BARBER1CONNECT2.0
// Archivo: js/admin-horarios.js
// Control de flujo progresivo + guardado en Firestore
// =========================================================

// ===================== IMPORTS ===================== //

import { db } from "./firebase.js"; 
// Importa la instancia de Firestore configurada en firebase.js

import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// Importa funciones para crear y guardar documentos en Firestore

// ===================== CONSTANTES ===================== //

const BARBERIA_ID = "barberia_demo"; 
// ID fijo de la barbería (modo demo dentro del proyecto)

const diasSemana = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo"
]; 
// Lista de días válidos para Firestore (sin tildes)

// ===================== REFERENCIAS AL DOM ===================== //

const barberoSelect = document.getElementById("barberoSelect"); 
// Select donde se elige el barbero a modificar

const diasSeleccion = document.getElementById("diasSeleccion"); 
// Contenedor donde se muestran los checkboxes de días

const formHorarios = document.getElementById("formHorarios"); 
// Formulario para modificar horarios

const guardarBtn = document.getElementById("guardarHorarios"); 
// Botón que guarda los horarios en Firestore

const status = document.getElementById("adminStatus"); 
// Texto que muestra mensajes de éxito o error

// ===================== ESTADO INICIAL ===================== //

diasSeleccion.classList.add("hidden"); 
// Oculta la selección de días al cargar la página

formHorarios.classList.add("hidden"); 
// Oculta el formulario de horarios al cargar

// ===================== RENDER DE DÍAS ===================== //

diasSemana.forEach(dia => {

    const label = document.createElement("label"); 
    // Crea un elemento label para cada día

    label.innerHTML = `
        <input type="checkbox" value="${dia}" class="diaCheck" disabled>
        ${dia.charAt(0).toUpperCase() + dia.slice(1)}
    `; 
    // Inserta checkbox deshabilitado + nombre del día

    diasSeleccion.appendChild(label); 
    // Inserta el día dentro del contenedor en el DOM
});

// ===================== EVENTO: SELECCIÓN DE BARBERO ===================== //

barberoSelect.addEventListener("change", () => {

    const barberoSeleccionado = barberoSelect.value; 
    // Obtiene el valor del barbero seleccionado

    if (barberoSeleccionado) {

        diasSeleccion.classList.remove("hidden"); 
        // Muestra el bloque de selección de días

        document.querySelectorAll(".diaCheck").forEach(check => {
            check.disabled = false; 
            // Habilita todos los checkboxes de días
        });

    } else {

        diasSeleccion.classList.add("hidden"); 
        // Oculta la selección de días

        formHorarios.classList.add("hidden"); 
        // Oculta el formulario de horarios

        document.querySelectorAll(".diaCheck").forEach(check => {
            check.checked = false; 
            // Desmarca todos los días
            check.disabled = true; 
            // Vuelve a deshabilitar los días
        });
    }
});

// ===================== EVENTO: SELECCIÓN DE DÍAS ===================== //

diasSeleccion.addEventListener("change", () => {

    const diasActivos = document.querySelectorAll(".diaCheck:checked"); 
    // Obtiene los días seleccionados

    if (diasActivos.length > 0) {

        formHorarios.classList.remove("hidden"); 
        // Muestra el formulario si hay días seleccionados

    } else {

        formHorarios.classList.add("hidden"); 
        // Oculta el formulario si no hay días seleccionados
    }
});

// ===================== EVENTO: GUARDAR HORARIOS ===================== //

guardarBtn.addEventListener("click", async () => {

    const barberoId = barberoSelect.value; 
    // Obtiene el barbero actualmente seleccionado

    if (!barberoId) {
        alert("Selecciona un barbero"); 
        // Evita guardar sin barbero
        return; 
    }

    // ================= VALIDACIÓN FORMULARIO ================= //

    if (
        !document.getElementById("inicio").value ||
        !document.getElementById("fin").value ||
        !document.getElementById("bloque").value
    ) {
        alert("Completa todos los horarios antes de guardar"); 
        // Evita guardar datos incompletos (especialmente en móvil)
        return; 
    }

    const diasSeleccionados = document.querySelectorAll(".diaCheck:checked"); 
    // Obtiene los días que se van a modificar

    const data = {}; 
    // Objeto final que se enviará a Firestore

    diasSeleccionados.forEach(check => {

        data[check.value] = {
            activo: true, 
            // Marca el día como activo

            inicio: document.getElementById("inicio").value, 
            // Hora de inicio del día

            fin: document.getElementById("fin").value, 
            // Hora de fin del día

            bloque: Number(document.getElementById("bloque").value), 
            // Duración del bloque en minutos

            almuerzoInicio: document.getElementById("almuerzoInicio").value, 
            // Hora de inicio de almuerzo

            almuerzoFin: document.getElementById("almuerzoFin").value 
            // Hora de fin de almuerzo
        };
    });

    try {

        await setDoc(
            doc(db, "barberias", BARBERIA_ID, "horarios", barberoId),
            data,
            { merge: true }
        ); 
        // Guarda solo los días seleccionados sin borrar los demás

        status.textContent = "✅ Horarios guardados correctamente"; 
        // Mensaje visual de éxito

        status.style.color = "lime"; 
        // Color verde de confirmación

        // ===================== RESET COMPLETO ===================== //

        barberoSelect.value = ""; 
        // Reinicia selección de barbero

        diasSeleccion.classList.add("hidden"); 
        // Oculta selección de días

        formHorarios.classList.add("hidden"); 
        // Oculta formulario

        document.querySelectorAll(".diaCheck").forEach(check => {
            check.checked = false; 
            // Desmarca días
            check.disabled = true; 
            // Deshabilita días
        });

        document.getElementById("inicio").value = ""; 
        // Limpia hora inicio

        document.getElementById("fin").value = ""; 
        // Limpia hora fin

        document.getElementById("bloque").value = "30"; 
        // Restaura bloque por defecto

        document.getElementById("almuerzoInicio").value = ""; 
        // Limpia almuerzo inicio

        document.getElementById("almuerzoFin").value = ""; 
        // Limpia almuerzo fin

    } catch (error) {

        console.error("❌ Error guardando horarios", error); 
        // Muestra error en consola

        status.textContent = "❌ Error al guardar horarios"; 
        // Mensaje visual de error

        status.style.color = "red"; 
        // Color rojo de error
    }
});

// ===================== CARGA HEADER Y FOOTER ===================== //

fetch("./header.html")
  .then(res => res.text()) 
  // Convierte la respuesta en texto HTML
  .then(html => {
    document.getElementById("header-container").innerHTML = html; 
    // Inserta el header universal en la página
  });

fetch("./footer.html")
  .then(res => res.text()) 
  // Convierte la respuesta en texto HTML
  .then(html => {
    document.getElementById("footer-container").innerHTML = html; 
    // Inserta el footer universal en la página
  });
