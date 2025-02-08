"use client"; // Kennzeichnet die Komponente als Client-Komponente
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import {
  getNote,
  updateNoteStatus,
  deleteNote,
} from "../../firebase/firebaseConfig";

interface Note {
  text: string;
  createdAt: Timestamp;
  isRead: boolean;
}

const NotePage = () => {
  const { noteId } = useParams<{ noteId: string }>(); // Hole die noteId aus der URL
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (noteId) {
      const fetchNote = async () => {
        try {
          const fetchedNote = await getNote(
            Array.isArray(noteId) ? noteId[0] : noteId
          );
          if (fetchedNote) {
            const noteData: Note = {
              text: fetchedNote.text,
              createdAt: fetchedNote.createdAt,
              isRead: fetchedNote.isRead,
            };
            setNote(noteData);

            // Wenn die Notiz noch nicht gelesen wurde, markiere sie als gelesen und lösche sie danach
            if (!fetchedNote.isRead) {
              await updateNoteStatus(noteId, true); // Setze "isRead" auf true
              await deleteNote(noteId); // Lösche die Notiz aus der Datenbank
            }
          } else {
            setError("Notiz nicht gefunden.");
          }
        } catch (err) {
          setError("Fehler beim Abrufen der Notiz.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchNote();
    }
  }, [noteId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 relative">
      {/* Fehlerbenachrichtigung */}
      {error && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-4 rounded-md shadow-lg">
          {error}
        </div>
      )}

      {/* Nur anzeigen, wenn eine Notiz abgerufen wurde */}
      {note && (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center mb-4">Message:</h1>
          <p>{note.text}</p>
          <p className="text-gray-600 mt-2">
            Erstellt am:{" "}
            {note.createdAt.toDate().toLocaleString("de-DE", {
              hour12: false,
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default NotePage;
