// =========================================================
// 🔥 FIREBASE HORARIOS — BARBER1CONNECT2
// Archivo: js/calendar.firebase.js
// Consulta horarios desde un SOLO documento por barbero
// =========================================================

import { db } from "./firebase.js";
// Importa la instancia principal de Firestore

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// Importa funciones para leer documentos específicos

// ===================== CONSTANTES ===================== //

const BARBERIA_ID = "barberia_demo";
// ID fijo de la barbería (luego será dinámico)

// =========================================================
// ⏰ OBTENER HORAS DISPONIBLES
// =========================================================

export async function obtenerHorasDisponibles(barberoId, fechaISO) {

  const fecha = new Date(fechaISO);
  // Convierte la fecha ISO a objeto Date

  const dias = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado"
  ];
  // Días de la semana (SIN tildes, igual que en Firestore)

  const diaSemana = dias[fecha.getDay()];
  // Obtiene el día de la semana correspondiente

  console.log("📅 Día consultado:", diaSemana);
  // Log de control para debug

  const horarioRef = doc(
    db,
    "barberias",
    BARBERIA_ID,
    "horarios",
    barberoId
  );
  // Referencia al documento del barbero

  const snapshot = await getDoc(horarioRef);
  // Lee el documento desde Firestore

  if (!snapshot.exists()) {
    console.warn("⚠️ El barbero no tiene horarios configurados");
    return [];
  }

  const data = snapshot.data();
  // Obtiene todos los horarios del barbero

  const dia = data[diaSemana];
  // Accede al objeto del día consultado

  if (!dia || !dia.activo) {
    console.warn("⚠️ Día sin horario activo");
    return [];
  }

  const horas = [];
  // Array donde se almacenan las horas disponibles

  let [h, m] = dia.inicio.split(":").map(Number);
  // Convierte hora inicio a números

  let [hFin, mFin] = dia.fin.split(":").map(Number);
  // Convierte hora fin a números

  let inicioMin = h * 60 + m;
  // Convierte inicio a minutos totales

  let finMin = hFin * 60 + mFin;
  // Convierte fin a minutos totales

  // ===================== ALMUERZO ===================== //

  let almuerzoInicio = null;
  let almuerzoFin = null;

  if (dia.almuerzo) {
    // Verifica si el día tiene almuerzo configurado

    const [aH, aM] = dia.almuerzo.inicio.split(":").map(Number);
    // Convierte inicio de almuerzo a números

    const [fH, fM] = dia.almuerzo.fin.split(":").map(Number);
    // Convierte fin de almuerzo a números

    almuerzoInicio = aH * 60 + aM;
    // Minutos inicio almuerzo

    almuerzoFin = fH * 60 + fM;
    // Minutos fin almuerzo
  }

  // ===================== GENERAR HORAS ===================== //

  while (inicioMin + dia.bloque <= finMin) {

    // ❌ Salta horas dentro del almuerzo
    if (
      almuerzoInicio !== null &&
      inicioMin >= almuerzoInicio &&
      inicioMin < almuerzoFin
    ) {
      inicioMin += dia.bloque;
      continue;
    }

    const hh = String(Math.floor(inicioMin / 60)).padStart(2, "0");
    // Hora en formato 2 dígitos

    const mm = String(inicioMin % 60).padStart(2, "0");
    // Minutos en formato 2 dígitos

    horas.push(`${hh}:${mm}`);
    // Agrega la hora al array final

    inicioMin += dia.bloque;
    // Avanza al siguiente bloque
  }

  console.log("⏰ Horas disponibles:", horas);
  // Log final para confirmar funcionamiento

  return horas;
}
