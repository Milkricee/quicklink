"use client";
import { useState } from "react";
import { createNote } from "./firebase/firebaseConfig";

export default function Home() {
  const [noteText, setNoteText] = useState("");
  const [noteLink, setNoteLink] = useState<string | null>(null);

  // Funktion zum Erstellen der Notiz und Generieren des Links
  const handleCreateNote = async () => {
    if (noteText.trim()) {
      // Notiz in Firestore speichern
      const noteId = await createNote(noteText);
      if (noteId) {
        // Einmal-Link erstellen
        const link = `${window.location.origin}/${noteId}`;
        setNoteText(""); // Notiz-Text zurücksetzen
        setNoteLink(link); // Den generierten Link setzen
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Erstelle eine einmalige Notiz
        </h1>

        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Gib deine Notiz ein..."
          rows={4}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)} // Notiz-Text setzen
        />

        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md text-lg font-medium hover:bg-blue-600 transition-all"
          onClick={handleCreateNote} // Funktion zum Erstellen der Notiz aufrufen
        >
          Einmal-Link erstellen
        </button>

        {noteLink && (
          <div className="mt-4 text-center">
            <p className="text-gray-700">Dein einmaliger Link:</p>
            <a
              href={noteLink}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {noteLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
