// ===================== TEST FIREBASE ===================== //
// Este archivo SOLO prueba si Firestore se puede leer

import { db } from "./firebase.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("🧪 firebase.test.js cargado");

async function testLectura() {
  try {
    const ref = doc(db, "barberias", "test_lectura");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      console.warn("❌ Documento NO existe");
      return;
    }

    console.log("✅ FIREBASE LEE CORRECTAMENTE");
    console.log("📄 Datos:", snap.data());

  } catch (error) {
    console.error("🔥 ERROR LECTURA FIREBASE:", error);
  }
}

testLectura();
