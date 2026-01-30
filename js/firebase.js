// ===================== FIREBASE CONFIG ===================== //

// Importa las funciones necesarias desde Firebase SDK // Se encarga de cargar Firebase en el proyecto
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"; 

// Importa Firestore para base de datos // Permite leer y escribir datos en la nube
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; 

// Importa Authentication // Maneja login, logout y usuarios
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"; 

// Configuración del proyecto Firebase // Conecta esta web con TU proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCo_CD4VdQg0fTcsUepSadfgYtHl75hEiA",
  authDomain: "barber1connect2.firebaseapp.com",
  projectId: "barber1connect2",
  storageBucket: "barber1connect2.firebasestorage.app",
  messagingSenderId: "936288218116",
  appId: "1:936288218116:web:692414a26e81586af55951",
  measurementId: "G-5FR8Z82M73"
};

// Inicializa Firebase con la configuración // Arranca Firebase en barber1connect2.0
const app = initializeApp(firebaseConfig); 

// Inicializa Firestore // Base de datos principal del sistema
const db = getFirestore(app); 

// Inicializa Authentication // Control de usuarios y sesiones
const auth = getAuth(app); 

// Exporta Firestore y Auth // Permite usarlos en otros archivos JS
export { db, auth };
