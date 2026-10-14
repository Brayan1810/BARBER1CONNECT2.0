// =========================================================
// 🔥 SERVICES FIREBASE — BARBER1CONNECT2
// Archivo: js/services.firebase.js
// Responsable de consultar los servicios desde Firestore
// =========================================================



/* ================= IMPORTACIONES ================= */

// Importa la instancia principal de Firestore
import { db } from "./firebase.js";

// Importa las funciones necesarias para consultar Firestore
import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* ================= CONFIGURACIÓN ================= */

// Obtiene el ID de la barbería actual
// Si todavía no existe utiliza barberia_demo
const BARBERIA_ID =
    localStorage.getItem("barberiaId") || "barberia_demo";



/* ================= OBTENER SERVICIOS ================= */

// Obtiene todos los servicios activos ordenados por el campo "orden"
export async function obtenerServicios() {

    // Intenta consultar Firestore
    try {

        // Referencia a la colección servicios
        const serviciosRef = collection(
            db,
            "barberias",
            BARBERIA_ID,
            "servicios"
        );

        // Obtiene todos los documentos de la colección servicios
        const snapshot = await getDocs(serviciosRef);
        // En esta fase obtenemos todos los servicios.
        // Más adelante volveremos a utilizar consultas optimizadas con índices.

        // Arreglo donde se almacenarán los servicios
        const servicios = [];

        // Recorre todos los documentos obtenidos
        snapshot.forEach((doc) => {

            // Obtiene los datos del documento
            const servicio = {

                // Guarda el ID del documento
                id: doc.id,

                // Copia el resto de la información
                ...doc.data()

            };

            // Verifica si el servicio está activo
            if (servicio.activo === true) {

                // Agrega el servicio al arreglo
                servicios.push(servicio);

            }

        });


        // Ordena los servicios utilizando el campo "orden"
        servicios.sort((a, b) => {

            // Si algún documento no tiene "orden", utiliza 999 para dejarlo al final
            const ordenA = a.orden ?? 999;

            // Si algún documento no tiene "orden", utiliza 999 para dejarlo al final
            const ordenB = b.orden ?? 999;

            // Devuelve el orden ascendente
            return ordenA - ordenB;

        });

        // Muestra en consola los servicios obtenidos
        console.log("✅ Servicios cargados:", servicios);

        // Devuelve el arreglo completo
        return servicios;

    }

    // Captura cualquier error
    catch (error) {

        // Muestra el error en consola
        console.error(
            "❌ Error obteniendo servicios:",
            error
        );

        // Devuelve un arreglo vacío
        return [];

    }

}