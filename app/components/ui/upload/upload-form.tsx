'use client';

import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Uploaded successfully. Parsed ${data.documentsParsed} documents.`);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage("❌ Upload failed. See console for details.");
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl">
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Upload PDF
      </button>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
