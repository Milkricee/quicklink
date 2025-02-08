"use client";

import { testConnection } from "../firebase/firebaseConfig";

export default function Home() {
  const handleTestConnection = async () => {
    console.log("Button geklickt!");
    await testConnection();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Firebase Test
        </h1>
        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md text-lg font-medium hover:bg-blue-600 transition-all"
          onClick={handleTestConnection}
        >
          Test Verbindung
        </button>
      </div>
    </div>
  );
}
