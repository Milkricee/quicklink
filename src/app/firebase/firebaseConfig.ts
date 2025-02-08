// firebase/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDoc, doc, Timestamp, getDocs } from 'firebase/firestore';

// Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyD6z1w-MojqvEE6SgFEjuL4XCg-7VkhJsM",
  authDomain: "quicklink-f3a09.firebaseapp.com",
  projectId: "quicklink-f3a09",
  storageBucket: "quicklink-f3a09.firebasestorage.app",
  messagingSenderId: "959761003619",
  appId: "1:959761003619:web:024b8f4327dac1aca8f456",
  measurementId: "G-JB6FLS0RRV"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funktion zum Erstellen einer Notiz
export const createNote = async (text: string) => {
  try {
    const expiresAt = Timestamp.fromDate(new Date(Date.now() + 5 * 60 * 60 * 1000)); // 5 Stunden nach Erstellung

    const docRef = await addDoc(collection(db, 'notes'), {
      text,
      createdAt: Timestamp.now(),
      expiresAt,
      isRead: false,
    });

    console.log("Notiz erstellt mit ID:", docRef.id);
    return docRef.id;  // Gibt die ID der Notiz zurück
  } catch (error) {
    console.error("Fehler beim Erstellen der Notiz:", error);
  }
};

// Funktion zum Abrufen einer Notiz
export const getNote = async (noteId: string) => {
  const noteRef = doc(db, 'notes', noteId);
  const docSnap = await getDoc(noteRef);

  if (docSnap.exists()) {
    console.log("Notiz gefunden:", docSnap.data());
    return docSnap.data();
  } else {
    console.log("Notiz nicht gefunden!");
    return null;
  }
};

// Funktion zum Abrufen aller Notizen
export const testConnection = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'notes'));
    if (snapshot.empty) {
      console.log('Keine Notizen gefunden.');
    } else {
      snapshot.forEach(doc => {
        console.log(doc.id, " => ", doc.data());
      });
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Notizen:", error);
  }
};

