// =========================================================
// 🧪 PRUEBA FIREBASE CITAS — BARBER1CONNECT2
// Archivo: js/appointments.test.js
// Este archivo únicamente verifica que guardarCita()
// funciona correctamente.
// =========================================================


// ================= IMPORTAR FUNCIÓN =================

// Importa la función que guarda una cita
import { guardarCita } from "./appointments.firebase.js";


// ================= EJECUTAR PRUEBA =================

// Ejecuta una función asíncrona de prueba
(async () => {

    // Muestra un mensaje para confirmar que inició la prueba
    console.log("🧪 Iniciando prueba de creación de cita...");

    try {

        // Llama la función guardarCita con datos ficticios
        const id = await guardarCita({

            // Servicio de prueba
            servicio: "PRUEBA",

            // Barbero de prueba
            barbero: "Brayan",

            // Fecha de prueba
            fecha: "2026-07-01",

            // Hora de prueba
            hora: "10:00",

            // Nombre de prueba
            nombre: "Usuario",

            // Apellido de prueba
            apellido: "Prueba",

            // Teléfono de prueba
            telefono: "3000000000",

            // Notas de prueba
            notas: "",

            // Estado inicial
            estado: "pendiente"

        });

        // Muestra el ID generado
        console.log("✅ Documento creado correctamente:", id);

    }

    catch (error) {

        // Muestra el error completo
        console.error("❌ La prueba falló:", error);

    }

})();