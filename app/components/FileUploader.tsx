
'use client';

import { useState } from 'react';

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadStatus('Uploading...');
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Get file names and token count from response
        const fileNames = data.files.join(', ');
        const tokenCount = data.tokenCount;
        
        // Update status with actual values from response
        setUploadStatus(`✅ Upload successful: ${fileNames} (${tokenCount} tokens indexed)`);
      } else {
        setUploadStatus(`❌ Upload failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus('❌ Upload failed.');
    }
  };

  return (
    <div className="border rounded-md p-4 bg-gray-50 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Upload your files for Analysis</h2>
      <div className="flex items-center space-x-4">
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="border p-1 rounded" 
          accept=".pdf,.txt,.docx,.csv,.xlsx" 
        />
        <button
          onClick={handleUpload}
          disabled={!file}
          className={`px-4 py-1 rounded ${
            file 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Upload
        </button>
      </div>
      {uploadStatus && (
        <div className={`mt-2 text-sm ${
          uploadStatus.includes('✅') ? 'text-green-600' : 'text-red-600'
        }`}>
          {uploadStatus}
        </div>
      )}
    </div>
  );
}


