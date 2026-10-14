// =========================================================
// 🔥 FIREBASE HORARIOS — BARBER1CONNECT2
// Archivo: js/calendar.firebase.js
// Consulta horarios del barbero y elimina las horas ocupadas
// =========================================================

// Importa la instancia principal de Firestore
import { db } from "./firebase.js";

// Importa las funciones necesarias para consultar Firestore
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===================== CONSTANTES ===================== //

// Define el identificador actual de la barbería
const BARBERIA_ID = "barberia_demo";

// =========================================================
// ⏰ OBTENER HORAS DISPONIBLES
// =========================================================

// Exporta la función para que calendar.js pueda utilizarla
export async function obtenerHorasDisponibles(barberoId, fechaISO) {

  // Convierte la fecha recibida a un objeto Date
  const fecha = new Date(fechaISO);

  // Define los nombres de los días exactamente como están en Firestore
  const dias = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado"
  ];

  // Obtiene el nombre del día correspondiente a la fecha seleccionada
  const diaSemana = dias[fecha.getDay()];

  // Muestra en consola el día que se está consultando
  console.log("📅 Día consultado:", diaSemana);

  // =========================================================
  // 📋 OBTENER HORARIO DEL BARBERO
  // =========================================================

  // Crea la referencia al documento de horarios del barbero
  const horarioRef = doc(
    db,
    "barberias",
    BARBERIA_ID,
    "horarios",
    barberoId
  );

  // Consulta el documento del horario en Firestore
  const snapshot = await getDoc(horarioRef);

  // Verifica si el documento del barbero existe
  if (!snapshot.exists()) {

    // Muestra advertencia si no existen horarios configurados
    console.warn("⚠️ El barbero no tiene horarios configurados");

    // Devuelve una lista vacía para evitar errores
    return [];
  }

  // Obtiene toda la información del documento del barbero
  const data = snapshot.data();

  // Obtiene únicamente la configuración del día seleccionado
  const dia = data[diaSemana];

  // Verifica si el día existe y está activo
  if (!dia || !dia.activo) {

    // Muestra advertencia si el día no tiene horario activo
    console.warn("⚠️ Día sin horario activo");

    // Devuelve una lista vacía porque no hay disponibilidad
    return [];
  }

  // =========================================================
  // ⏰ GENERAR HORAS SEGÚN EL HORARIO DEL BARBERO
  // =========================================================

  // Crea el array donde se almacenarán las horas generadas
  const horas = [];

  // Separa la hora de inicio en horas y minutos
  let [h, m] = dia.inicio.split(":").map(Number);

  // Separa la hora final en horas y minutos
  let [hFin, mFin] = dia.fin.split(":").map(Number);

  // Convierte la hora inicial a minutos totales
  let inicioMin = h * 60 + m;

  // Convierte la hora final a minutos totales
  let finMin = hFin * 60 + mFin;

  // =========================================================
  // 🍽️ CONFIGURAR HORARIO DE ALMUERZO
  // =========================================================

  // Inicializa el inicio del almuerzo como inexistente
  let almuerzoInicio = null;

  // Inicializa el final del almuerzo como inexistente
  let almuerzoFin = null;

  // Comprueba si el día tiene horario de almuerzo configurado
  if (dia.almuerzo) {

    // Separa la hora inicial del almuerzo
    const [aH, aM] = dia.almuerzo.inicio.split(":").map(Number);

    // Separa la hora final del almuerzo
    const [fH, fM] = dia.almuerzo.fin.split(":").map(Number);

    // Convierte el inicio del almuerzo a minutos totales
    almuerzoInicio = aH * 60 + aM;

    // Convierte el final del almuerzo a minutos totales
    almuerzoFin = fH * 60 + fM;
  }

  // =========================================================
  // 🕐 GENERAR BLOQUES DE HORARIO
  // =========================================================

  // Recorre todos los bloques disponibles dentro del horario laboral
  while (inicioMin + dia.bloque <= finMin) {

    // Comprueba si la hora actual está dentro del horario de almuerzo
    if (
      almuerzoInicio !== null &&
      inicioMin >= almuerzoInicio &&
      inicioMin < almuerzoFin
    ) {

      // Salta directamente al siguiente bloque
      inicioMin += dia.bloque;

      // Continúa con la siguiente iteración
      continue;
    }

    // Convierte las horas a formato de dos dígitos
    const hh = String(Math.floor(inicioMin / 60)).padStart(2, "0");

    // Convierte los minutos a formato de dos dígitos
    const mm = String(inicioMin % 60).padStart(2, "0");

    // Agrega la hora completa al array
    horas.push(`${hh}:${mm}`);

    // Avanza al siguiente bloque de horario
    inicioMin += dia.bloque;
  }

  // Muestra en consola todas las horas generadas inicialmente
  console.log("⏰ Horas según horario del barbero:", horas);

  // =========================================================
  // 🔒 OBTENER HORAS YA OCUPADAS
  // =========================================================

  // Obtiene la referencia a la colección de ocupaciones de la barbería
  const ocupacionesRef = collection(
    db,
    "barberias",
    BARBERIA_ID,
    "ocupaciones"
  );

  // Crea una consulta para buscar únicamente las ocupaciones del barbero
  // y de la fecha seleccionada
  const ocupacionesQuery = query(
    ocupacionesRef,
    where("barbero", "==", barberoId),
    where("fecha", "==", fechaISO)
  );

  // Ejecuta la consulta de ocupaciones en Firestore
  const ocupacionesSnapshot = await getDocs(ocupacionesQuery);

  // Crea un Set para almacenar las horas ocupadas sin duplicados
  const horasOcupadas = new Set();

  // Recorre todos los documentos de ocupaciones encontrados
  ocupacionesSnapshot.forEach(ocupacionDoc => {

    // Obtiene los datos de la ocupación actual
    const ocupacion = ocupacionDoc.data();

    // Verifica que la ocupación tenga una hora registrada
    if (ocupacion.hora) {

      // Agrega la hora ocupada al Set
      horasOcupadas.add(ocupacion.hora);
    }
  });

  // Muestra en consola las horas que ya están ocupadas
  console.log(
    "🔒 Horas ocupadas:",
    Array.from(horasOcupadas)
  );

  // =========================================================
  // 🚫 ELIMINAR HORAS OCUPADAS
  // =========================================================

  // Filtra las horas normales eliminando las que ya están ocupadas
  const horasDisponibles = horas.filter(hora => {

    // Devuelve true únicamente cuando la hora NO está ocupada
    return !horasOcupadas.has(hora);
  });

  // =========================================================
  // 📊 MOSTRAR RESULTADO FINAL
  // =========================================================

  // Muestra en consola únicamente las horas que el cliente puede reservar
  console.log(
    "✅ Horas disponibles después de eliminar ocupadas:",
    horasDisponibles
  );

  // Devuelve únicamente las horas realmente disponibles
  return horasDisponibles;
}