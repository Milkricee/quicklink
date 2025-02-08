import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDoc, doc, Timestamp, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

// Firebase-Konfiguration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
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
