'use client';

import { useApiKey } from './ApiKeyProvider';

const ApiKeyInput = () => {
  const { apiKey, setApiKey } = useApiKey();

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-1">
        OpenAI API Key:
      </label>
      <input
        type="password"
        placeholder="sk-..."
        className="w-full border rounded px-3 py-2"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
    </div>
  );
};

export default ApiKeyInput;
