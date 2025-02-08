import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDoc, doc, Timestamp, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

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

    const docRef = await addDoc(collection(db, 'notes'), {
      text,
      createdAt: Timestamp.now(),
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
  console.log("Abruf der Notiz mit ID:", noteId); // Log, um zu sehen, welche ID abgerufen wird
  try {
    const docRef = doc(db, "notes", noteId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Notiz gefunden:", docSnap.data()); // Log, wenn die Notiz erfolgreich abgerufen wurde
      return docSnap.data();
    } else {
      console.warn("Notiz nicht gefunden"); // Log, wenn keine Notiz für diese ID existiert
      return null;
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Notiz aus Firebase:", error); // Log für Fehler bei Firebase
    throw error;
  }
};

// Funktion zum Markieren der Notiz als gelesen
export const updateNoteStatus = async (noteId: string, isRead: boolean) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, { isRead });
    console.log("Notiz als gelesen markiert:", noteId);
  } catch (error) {
    console.error("Fehler beim Markieren der Notiz als gelesen:", error);
  }
};

// Funktion zum Löschen der Notiz
export const deleteNote = async (noteId: string) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await deleteDoc(noteRef);
    console.log("Notiz gelöscht:", noteId);
  } catch (error) {
    console.error("Fehler beim Löschen der Notiz:", error);
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
