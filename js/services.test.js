// =========================================================
// 🧪 PRUEBA SERVICES UI
// =========================================================

// Importa la función que consulta Firestore
import { obtenerServicios } from "./services.firebase.js";

// Importa la función que construirá la interfaz
import { mostrarPrimerServicio } from "./services.ui.js";

// Función principal de prueba
async function iniciarPrueba() {

    // Obtiene los servicios desde Firestore
    const servicios = await obtenerServicios();

    // Envía los servicios al módulo de interfaz
    mostrarPrimerServicio(servicios);

}

// Ejecuta la prueba
iniciarPrueba();