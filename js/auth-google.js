// ================= LOGIN CON GOOGLE =================
// Archivo: js/auth-google.js
// Maneja autenticación Google desde el botón del flujo schedule
// Valida perfil y desbloquea confirmación de cita

// ================= CONFIGURACIÓN =================

let PERFIL_COMPLETO = false; 
// Variable global que bloquea el flujo hasta completar perfil

const BARBERIA_ID = "barberia_demo"; 
// ID fijo de la barbería (luego se hace dinámico)

// ================= IMPORTS =================

// Importa auth y db ya inicializados
import { auth, db } from "./firebase.js"; 
// Instancias de Firebase configuradas

// Firebase Auth
import {
    GoogleAuthProvider,      
    signInWithPopup,         
    onAuthStateChanged       
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"; 
// SDK Firebase Auth

// Firestore
import {
    doc,                     
    getDoc,                  
    setDoc,                  
    updateDoc,               
    serverTimestamp          
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; 
// SDK Firestore

// ================= DOM READY =================

document.addEventListener("DOMContentLoaded", () => {

    // Captura el botón REAL del flujo (schedule.html)
    const googleBtn = document.querySelector(".btn-google"); 
    // Botón "Continuar con Google"

    // ================= ESTADO DE SESIÓN =================

    onAuthStateChanged(auth, async (user) => {
        // Se ejecuta cuando cambia el estado de login

        if (!user) return; 
        // Si no hay usuario, no continúa

        // Referencia al usuario dentro de la barbería
        const userRef = doc(
            db,
            "barberias",
            BARBERIA_ID,
            "usuarios",
            user.uid
        );

        // Consulta datos del usuario
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

            const data = userSnap.data();

            // Verifica si el perfil está completo
            if (!data.nombre || !data.apellido || !data.telefono) {

                // Perfil incompleto → forzar formulario
                abrirPopupCompletarPerfil();

            } else {

                // Perfil completo → desbloquea flujo
                PERFIL_COMPLETO = true;

                console.log("✅ Usuario completo, puede confirmar cita");

                // Continúa automáticamente al modal final
                if (typeof showConfirmModal === "function") {
                    showConfirmModal();
                }
            }
        }
    });

    // Si el botón no existe, corta ejecución
    if (!googleBtn) return;

    // ================= CLICK BOTÓN GOOGLE =================

    // ================= CLICK BOTÓN GOOGLE =================

    googleBtn.addEventListener("click", async (e) => {

        e.preventDefault(); 
        // Evita recargas o submits automáticos

        // ================= CAPTURA INPUTS DEL MODAL =================

        const nombreInput = document.getElementById("name"); 
        // Input nombre del formulario confirm

        const apellidoInput = document.getElementById("lastname"); 
        // Input apellido del formulario confirm

        const telefonoInput = document.getElementById("phone"); 
        // Input teléfono del formulario confirm

        const nombre = nombreInput.value.trim();
        // Valor limpio del nombre

        const apellido = apellidoInput.value.trim();
        // Valor limpio del apellido

        const telefono = telefonoInput.value.trim();
        // Valor limpio del teléfono

        // ================= VALIDACIÓN OBLIGATORIA =================

        if (!nombre || !apellido || !telefono) {
            // Si falta algún campo obligatorio

            alert("Para continuar debes completar nombre, apellido y teléfono.");
            // Mensaje UX claro para el usuario

            nombreInput.focus();
            // Lleva el foco al primer campo

            return;
            // ⛔ BLOQUEA el login con Google
        }

        // ================= LOGIN GOOGLE =================

        try {

            const result = await signInWithPopup(
                auth,
                new GoogleAuthProvider()
            );
            // Abre el popup oficial de Google

            const user = result.user;
            // Usuario autenticado

            // ================= REFERENCIA FIRESTORE =================

            const userRef = doc(
                db,
                "barberias",
                BARBERIA_ID,
                "usuarios",
                user.uid
            );

            const userSnap = await getDoc(userRef);
            // Consulta si ya existe el usuario

            // ================= CREAR / ACTUALIZAR USUARIO =================

            if (!userSnap.exists()) {

                // Usuario nuevo → se crea con TODO completo
                await setDoc(userRef, {
                    nombre: nombre,
                    apellido: apellido,
                    telefono: telefono,
                    email: user.email || "",
                    provider: "google",
                    rol: "cliente",
                    activo: true,
                    citasAcumuladas: 0,
                    creadoEn: serverTimestamp()
                });

            } else {

                // Usuario existente → se asegura info completa
                await updateDoc(userRef, {
                    nombre: nombre,
                    apellido: apellido,
                    telefono: telefono,
                    actualizadoEn: serverTimestamp()
                });
            }

            PERFIL_COMPLETO = true;
            // Marca perfil como completo

            // ================= CONTINÚA FLUJO =================

            if (typeof showConfirmModal === "function") {
                showConfirmModal();
            }

        } catch (error) {

            console.error("❌ Error Google Auth:", error);
        }
    });


});

// ================= MODAL COMPLETAR PERFIL =================

function abrirPopupCompletarPerfil() {

    const modal = document.getElementById("perfilModal");
    // Modal de completar datos

    modal.style.display = "flex";
    // Muestra el modal

    const btnGuardar = document.getElementById("guardarPerfilBtn");
    // Botón guardar perfil

    btnGuardar.onclick = async () => {

        const nombre = document.getElementById("inputNombre").value.trim();
        const apellido = document.getElementById("inputApellido").value.trim();
        const telefono = document.getElementById("inputTelefono").value.trim();

        // Validación obligatoria
        if (!nombre || !apellido || !telefono) {
            alert("Para continuar debes completar nombre, apellido y teléfono.");
            return;
        }

        const user = auth.currentUser;
        if (!user) return;

        // Guarda datos en Firestore
        await guardarDatosCliente(user, {
            nombre,
            apellido,
            telefono
        });

        PERFIL_COMPLETO = true;
        // Marca perfil como completo

        modal.style.display = "none";
        // Cierra el modal

        // Continúa flujo automáticamente
        if (typeof showConfirmModal === "function") {
            showConfirmModal();
        }
    };
}

// ================= GUARDAR PERFIL =================

async function guardarDatosCliente(user, datosFormulario) {

    const userRef = doc(
        db,
        "barberias",
        BARBERIA_ID,
        "usuarios",
        user.uid
    );

    await updateDoc(userRef, {
        nombre: datosFormulario.nombre,
        apellido: datosFormulario.apellido,
        telefono: datosFormulario.telefono,
        actualizadoEn: serverTimestamp()
    });
}
