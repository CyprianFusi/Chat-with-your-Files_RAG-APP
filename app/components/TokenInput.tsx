'use client';

import { useEffect, useState } from 'react';
import { useApiKey } from '@/components/ApiKeyProvider';

export default function TokenInput() {
  const { apiKey, setApiKey } = useApiKey();
  const [tempToken, setTempToken] = useState(apiKey || '');
  const [showToken, setShowToken] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('openai-api-key');
    if (stored) {
      setApiKey(stored);
      setTempToken(stored);
      setTokenValid(stored.startsWith('sk-'));
    }
  }, [setApiKey]);

  const handleSave = () => {
    setApiKey(tempToken);
    localStorage.setItem('openai-api-key', tempToken);
    setTokenValid(tempToken.startsWith('sk-'));
  };

  return (
    <div className="p-4 border-b bg-gray-50">
      <div className="flex flex-col items-start max-w-4xl gap-4 mx-auto sm:flex-row sm:items-center">
        <div className="flex-1">
          <label htmlFor="openai-token" className="block mb-1 text-sm font-medium text-gray-700">
            OpenAI API Key
          </label>
          <div className="relative">
            <input
              id="openai-token"
              type={showToken ? "text" : "password"}
              value={tempToken}
              onChange={(e) => setTempToken(e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="w-full p-2 pr-10 border rounded"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute inset-y-0 right-0 flex items-center px-3"
            >
              {showToken ? "🙈" : "👁️"}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Your token is stored locally and never sent to our servers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1.5 rounded text-sm ${
              tempToken
                ? tokenValid
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {tempToken ? (tokenValid ? 'Valid' : 'Invalid') : 'Not set'}
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
