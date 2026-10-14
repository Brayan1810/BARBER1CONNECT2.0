// =========================================================
// 🔥 FIREBASE CITAS — BARBER1CONNECT2
// Archivo: js/appointments.firebase.js
// Guarda las citas de los clientes y registra las horas ocupadas
// =========================================================


// ================= IMPORTAR FIREBASE =================

// Importa la instancia principal de Firestore
import { db } from "./firebase.js";


// ================= IMPORTAR FIRESTORE =================

import {

    collection,

    addDoc,

    doc,

    setDoc,

    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// Importa las funciones necesarias para trabajar con Firestore


// ================= CONSTANTES =================

// Define el identificador de la barbería actual
const BARBERIA_ID = "barberia_demo";


// ================= FUNCIÓN GUARDAR CITA =================

// Exporta la función para que pueda ser utilizada desde schedule.js
export async function guardarCita(datosCita) {

    try {

        // =========================================================
        // 📋 GUARDAR CITA COMPLETA
        // =========================================================

        // Guarda un nuevo documento dentro de la colección privada de citas
        const docRef = await addDoc(

            // Define la ubicación de la colección de citas
            collection(
                db,
                "barberias",
                BARBERIA_ID,
                "citas"
            ),

            // Define toda la información que tendrá la cita
            {

                // Copia todos los datos reales enviados por el formulario
                ...datosCita,

                // Guarda automáticamente la fecha y hora de creación
                createdAt: serverTimestamp()

            }

        );


        // Muestra en consola el identificador generado para la cita
        console.log("✅ Cita creada:", docRef.id);


        // =========================================================
        // 🔒 REGISTRAR HORARIO OCUPADO
        // =========================================================

        // Convierte el nombre del barbero en un formato seguro para utilizarlo como ID
        const barberoId = String(datosCita.barbero)
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_");


        // Convierte la hora en un formato adecuado para utilizarla dentro del ID
        const horaId = String(datosCita.hora)
            .trim()
            .replace(":", "-");


        // Construye un identificador único utilizando barbero, fecha y hora
        const ocupacionId =
            `${barberoId}_${datosCita.fecha}_${horaId}`;


        // Crea la referencia al documento de la ocupación
        const ocupacionRef = doc(
            db,
            "barberias",
            BARBERIA_ID,
            "ocupaciones",
            ocupacionId
        );


        // Guarda únicamente la información necesaria para controlar disponibilidad
        await setDoc(
            ocupacionRef,
            {

                // Guarda el identificador del barbero
                barbero: datosCita.barbero,

                // Guarda la fecha de la cita
                fecha: datosCita.fecha,

                // Guarda la hora reservada
                hora: datosCita.hora,

                // Indica que este horario actualmente está ocupado
                estado: "ocupada",

                // Guarda el momento en que se realizó la ocupación
                createdAt: serverTimestamp()

            }
        );


        // Muestra en consola el identificador de la ocupación creada
        console.log("🔒 Horario ocupado registrado:", ocupacionId);


        // =========================================================
        // ✅ FINALIZAR FUNCIÓN
        // =========================================================

        // Devuelve el identificador de la cita creada
        return docRef.id;

    }

    catch (error) {

        // Muestra en consola cualquier error producido durante el proceso
        console.error("❌ Error guardando cita:", error);


        // Envía nuevamente el error hacia schedule.js
        throw error;

    }

}