import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getNote } from "../firebase/firebaseConfig"; // Firebase-Funktion zum Abrufen der Notiz
import { Timestamp } from "firebase/firestore";

interface Note {
  text: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  isRead: boolean;
}

const NotePage = () => {
  const router = useRouter();
  const { noteId } = router.query;
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("useEffect ausgelöst"); // Log, wenn der useEffect ausgelöst wird
    console.log("noteId aus router.query:", noteId); // Log, um sicherzustellen, dass noteId korrekt extrahiert wird

    if (noteId) {
      const fetchNote = async () => {
        console.log("Daten werden abgerufen für noteId:", noteId); // Log, bevor die Notiz abgerufen wird
        try {
          const fetchedNote = await getNote(noteId as string);
          console.log("Notiz abgerufen:", fetchedNote); // Log, um zu sehen, welche Daten zurückgegeben werden

          if (fetchedNote) {
            const noteData: Note = {
              text: fetchedNote.text,
              createdAt: fetchedNote.createdAt,
              expiresAt: fetchedNote.expiresAt,
              isRead: fetchedNote.isRead,
            };
            setNote(noteData);
          } else {
            setError("Notiz nicht gefunden.");
            console.error("Notiz nicht gefunden"); // Log für Fehler, wenn keine Notiz gefunden wird
          }
        } catch (err) {
          setError("Fehler beim Abrufen der Notiz.");
          console.error("Fehler beim Abrufen der Notiz:", err); // Log für Fehler, wenn der Abruf der Notiz fehlschlägt
        } finally {
          setLoading(false);
        }
      };
      fetchNote();
    } else {
      console.warn("Keine noteId in der URL gefunden"); // Log, wenn keine noteId in der URL vorhanden ist
    }
  }, [noteId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const isExpired = note ? note.expiresAt.toDate() < new Date() : false;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Deine Notiz</h1>
        <p>{note?.text}</p>
        <p className="text-gray-600 mt-2">
          Erstellt am: {note?.createdAt.toDate().toLocaleString()}
        </p>
        <p className="text-gray-600 mt-2">
          Ablaufdatum: {note?.expiresAt.toDate().toLocaleString()}
        </p>
        {isExpired && (
          <p className="text-red-600 mt-2">Diese Notiz ist abgelaufen.</p>
        )}
        <p className="text-gray-600 mt-2">
          {note?.isRead
            ? "Notiz wurde gelesen."
            : "Notiz wurde noch nicht gelesen."}
        </p>
      </div>
    </div>
  );
};

export default NotePage;
